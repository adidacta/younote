// YouNote Extension Content Script - Injected into YouTube pages

let noteUI = null;
let currentVideoId = null;
let capturedTimestamp = null;
let isAuthenticated = false;

// Initialize extension on YouTube video pages
function init() {
  // Check if we're on a video page
  if (!isVideoPage()) {
    return;
  }

  // Get video ID
  currentVideoId = getVideoIdFromUrl();
  if (!currentVideoId) {
    return;
  }

  // Check authentication status
  checkAuth();

  // Create and inject note UI
  createNoteUI();

  // Watch for URL changes (YouTube is a SPA)
  observeUrlChanges();
}

// Check if current page is a YouTube video page
function isVideoPage() {
  const url = window.location.href;
  return url.includes('youtube.com/watch') || url.includes('youtube.com/live');
}

// Extract video ID from URL
function getVideoIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');

  if (videoId) {
    return videoId;
  }

  // Check for /live/ format
  const match = window.location.pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Check authentication status
async function checkAuth() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'CHECK_AUTH' });
    isAuthenticated = response.authenticated || false;

    if (noteUI) {
      updateUIForAuthStatus();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    isAuthenticated = false;
  }
}

// Create note UI
function createNoteUI() {
  // Don't create if already exists
  if (noteUI) {
    return;
  }

  // Find insertion point (below video, above description)
  const targetContainer = findInsertionPoint();
  if (!targetContainer) {
    console.error('Could not find insertion point for note UI');
    return;
  }

  // Create UI container
  noteUI = document.createElement('div');
  noteUI.id = 'younote-extension-container';
  noteUI.className = 'younote-container';

  // Set initial HTML
  updateUIForAuthStatus();

  // Insert into page
  targetContainer.insertBefore(noteUI, targetContainer.firstChild);

  // Add event listeners
  setupEventListeners();
}

// Find where to insert the note UI
function findInsertionPoint() {
  // Try multiple selectors for YouTube's changing DOM
  const selectors = [
    'ytd-watch-flexy #secondary #secondary-inner',  // Modern YouTube
    'ytd-watch-flexy #secondary',                   // YouTube Polymer
    '#secondary #secondary-inner',                   // Alternative
    '#secondary-inner',                              // Standalone
    '#secondary',                                    // Classic YouTube
    '#columns #secondary',                           // Older layout
    'ytd-watch-next-secondary-results-renderer',    // Direct sidebar renderer
  ];

  console.log('[YouNote] Searching for insertion point...');

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      console.log('[YouNote] Found insertion point:', selector, element);
      return element;
    } else {
      console.log('[YouNote] Selector not found:', selector);
    }
  }

  console.error('[YouNote] Could not find insertion point. Trying body as fallback.');
  // Last resort: return body (will still work but not ideal placement)
  return document.body;
}

// Update UI based on authentication status
function updateUIForAuthStatus() {
  if (!noteUI) return;

  if (!isAuthenticated) {
    noteUI.innerHTML = `
      <div class="younote-card younote-not-auth">
        <div class="younote-header">
          <h3 class="younote-title">📝 YouNote</h3>
        </div>
        <div class="younote-content">
          <p class="younote-message">Login to start taking notes</p>
          <button class="younote-btn younote-btn-primary" id="younote-login-btn">
            Login to YouNote →
          </button>
        </div>
      </div>
    `;
  } else {
    noteUI.innerHTML = `
      <div class="younote-card" id="younote-card">
        <div class="younote-header">
          <h3 class="younote-title">📝 New Note</h3>
          <button class="younote-toggle-btn" id="younote-toggle-btn">▲</button>
        </div>
        <div class="younote-content" id="younote-content">
          <textarea
            class="younote-textarea"
            id="younote-textarea"
            placeholder="Type your note here... (supports Markdown)"
            rows="4"
          ></textarea>
          <div class="younote-info">
            <span class="younote-timestamp" id="younote-timestamp"></span>
          </div>
          <button
            class="younote-btn younote-btn-primary younote-btn-save"
            id="younote-save-btn"
            disabled
          >
            Save Note
          </button>
          <div class="younote-feedback" id="younote-feedback"></div>
        </div>
      </div>
    `;
  }

  // Re-setup event listeners
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  if (!noteUI) return;

  // Login button
  const loginBtn = noteUI.querySelector('#younote-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLoginClick);
  }

  // Toggle button (expand/collapse)
  const toggleBtn = noteUI.querySelector('#younote-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', handleToggleClick);
  }

  // Textarea
  const textarea = noteUI.querySelector('#younote-textarea');
  if (textarea) {
    textarea.addEventListener('input', handleTextareaInput);
  }

  // Save button
  const saveBtn = noteUI.querySelector('#younote-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveClick);
  }
}

// Handle login button click
function handleLoginClick() {
  chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
}

// Handle toggle button click (expand/collapse)
function handleToggleClick() {
  const content = noteUI.querySelector('#younote-content');
  const toggleBtn = noteUI.querySelector('#younote-toggle-btn');
  const card = noteUI.querySelector('#younote-card');

  if (content && toggleBtn && card) {
    const isExpanded = !card.classList.contains('younote-collapsed');

    if (isExpanded) {
      // Collapse
      card.classList.add('younote-collapsed');
      toggleBtn.textContent = '▼';
    } else {
      // Expand
      card.classList.remove('younote-collapsed');
      toggleBtn.textContent = '▲';
    }
  }
}

// Handle textarea input
function handleTextareaInput(event) {
  const textarea = event.target;
  const saveBtn = noteUI.querySelector('#younote-save-btn');
  const timestampSpan = noteUI.querySelector('#younote-timestamp');

  // Enable/disable save button
  if (saveBtn) {
    saveBtn.disabled = textarea.value.trim() === '';
  }

  // Capture timestamp on first character
  if (textarea.value.length === 1 && capturedTimestamp === null) {
    const video = document.querySelector('video');
    if (video) {
      capturedTimestamp = Math.floor(video.currentTime);
      if (timestampSpan) {
        timestampSpan.textContent = `🕐 Timestamp: ${formatTimestamp(capturedTimestamp)}`;
      }
    }
  }

  // Clear timestamp if textarea is empty
  if (textarea.value.trim() === '' && capturedTimestamp !== null) {
    capturedTimestamp = null;
    if (timestampSpan) {
      timestampSpan.textContent = '';
    }
  }
}

// Handle save button click
async function handleSaveClick() {
  const textarea = noteUI.querySelector('#younote-textarea');
  const saveBtn = noteUI.querySelector('#younote-save-btn');
  const feedback = noteUI.querySelector('#younote-feedback');

  if (!textarea || !saveBtn) return;

  const content = textarea.value.trim();
  if (content === '') return;

  // Get video info
  const videoTitle = document.querySelector('h1.ytd-watch-metadata')?.textContent?.trim() || 'Untitled';
  const videoUrl = window.location.href;

  // Show saving state
  saveBtn.disabled = true;
  saveBtn.textContent = '🔄 Saving...';
  if (feedback) {
    feedback.textContent = 'Saving to your Extension Notebook...';
    feedback.className = 'younote-feedback younote-feedback-info';
  }

  try {
    // Send to background script
    const response = await chrome.runtime.sendMessage({
      type: 'CREATE_NOTE',
      data: {
        videoId: currentVideoId,
        videoTitle,
        videoUrl,
        content,
        timestamp: capturedTimestamp || 0,
      },
    });

    if (response.success) {
      // Show success feedback
      if (feedback) {
        feedback.textContent = '✅ Note saved!';
        feedback.className = 'younote-feedback younote-feedback-success';
      }

      // Flash animation
      const card = noteUI.querySelector('#younote-card');
      if (card) {
        card.classList.add('younote-flash-success');
        setTimeout(() => {
          card.classList.remove('younote-flash-success');
        }, 300);
      }

      // Reset form after brief delay
      setTimeout(() => {
        textarea.value = '';
        capturedTimestamp = null;
        const timestampSpan = noteUI.querySelector('#younote-timestamp');
        if (timestampSpan) {
          timestampSpan.textContent = '';
        }
        if (feedback) {
          feedback.textContent = '';
          feedback.className = 'younote-feedback';
        }
        saveBtn.disabled = true;
        saveBtn.textContent = 'Save Note';
      }, 1500);
    } else {
      // Show error feedback
      if (feedback) {
        feedback.textContent = `❌ ${response.error || 'Failed to save note'}`;
        feedback.className = 'younote-feedback younote-feedback-error';
      }
      saveBtn.disabled = false;
      saveBtn.textContent = 'Retry';
    }
  } catch (error) {
    console.error('Error saving note:', error);
    if (feedback) {
      feedback.textContent = `❌ ${error.message || 'Failed to save note'}`;
      feedback.className = 'younote-feedback younote-feedback-error';
    }
    saveBtn.disabled = false;
    saveBtn.textContent = 'Retry';
  }
}

// Format timestamp (seconds) to MM:SS or H:MM:SS
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Watch for URL changes (YouTube is a SPA)
function observeUrlChanges() {
  let lastUrl = window.location.href;

  new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;

      // Remove old UI
      if (noteUI) {
        noteUI.remove();
        noteUI = null;
      }

      // Reset state
      currentVideoId = null;
      capturedTimestamp = null;

      // Reinitialize on new video
      if (isVideoPage()) {
        setTimeout(init, 500); // Small delay to let YouTube load
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// Listen for auth status changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.authToken) {
    checkAuth();
  }
});

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
