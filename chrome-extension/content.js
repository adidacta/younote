// YouNote Extension Content Script - Injected into YouTube pages

let noteUI = null;
let currentVideoId = null;
let capturedTimestamp = null;
let isAuthenticated = false;
let isDragging = false;
let hasDragged = false; // Track if actual movement occurred
let dragOffset = { x: 0, y: 0 };
let isFloating = false;

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
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
      console.warn('[YouNote] Extension context invalidated - page reload required');
      isAuthenticated = false;
      return;
    }

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

  // Make draggable if floating
  if (isFloating) {
    noteUI.classList.add('younote-draggable');
    restoreSavedPosition();
  }

  // Add event listeners
  setupEventListeners();

  // Add drag listeners if floating
  if (isFloating) {
    setupDragListeners();
  }
}

// Check if video is in theatre or fullscreen mode
function isTheatreOrFullscreen() {
  // Check for fullscreen
  if (document.fullscreenElement) {
    return true;
  }

  // Check for theatre mode
  const player = document.querySelector('ytd-watch-flexy');
  if (player && player.hasAttribute('theater')) {
    return true;
  }

  return false;
}

// Find where to insert the note UI
function findInsertionPoint() {
  // Force floating mode in theatre or fullscreen
  if (isTheatreOrFullscreen()) {
    console.log('[YouNote] Theatre or fullscreen detected - using floating mode');
    isFloating = true;
    return document.body;
  }

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
      isFloating = false;
      return element;
    } else {
      console.log('[YouNote] Selector not found:', selector);
    }
  }

  console.log('[YouNote] Could not find insertion point. Using floating mode as fallback.');
  // Last resort: return body (floating mode)
  isFloating = true;
  return document.body;
}

// Update UI based on authentication status
function updateUIForAuthStatus() {
  if (!noteUI) return;

  if (!isAuthenticated) {
    noteUI.innerHTML = `
      <div class="younote-card younote-not-auth">
        ${isFloating ? '<div class="younote-drag-border"><span class="younote-drag-grip">⋮⋮</span></div>' : ''}
        <div class="younote-main">
          <div class="younote-header">
            ${isFloating ? `
              <div class="younote-window-controls">
                <span class="younote-status-dot"></span>
              </div>
            ` : ''}
            <h3 class="younote-title">You|Note</h3>
          </div>
          <div class="younote-content">
            <p class="younote-message">Not connected</p>
            <button class="younote-btn younote-btn-primary" id="younote-login-btn">
              Connect Extension
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    noteUI.innerHTML = `
      <div class="younote-card" id="younote-card">
        ${isFloating ? '<div class="younote-drag-border"><span class="younote-drag-grip">⋮⋮</span></div>' : ''}
        <div class="younote-main">
          <div class="younote-header">
            ${isFloating ? `
              <div class="younote-window-controls">
                <button class="younote-control-btn younote-state-btn" id="younote-toggle-btn" title="Toggle"></button>
              </div>
            ` : ''}
            <h3 class="younote-title">New You|Note</h3>
            ${!isFloating ? '<button class="younote-toggle-btn" id="younote-toggle-btn">▲</button>' : ''}
          </div>
          <div class="younote-content" id="younote-content">
          <textarea
            class="younote-textarea"
            id="younote-textarea"
            placeholder="Type your note here... (supports Markdown)"
            rows="4"
            dir="auto"
          ></textarea>
          <div class="younote-info">
            <span class="younote-timestamp" id="younote-timestamp"></span>
          </div>
          <button
            class="younote-btn younote-btn-primary younote-btn-save"
            id="younote-save-btn"
            disabled
          >
            <span class="younote-btn-text">Save Note</span>
            <span class="younote-btn-spinner" style="display: none;">
              <svg class="younote-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="younote-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="younote-spinner-path" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
              </svg>
              Saving...
            </span>
          </button>
          <div class="younote-feedback" id="younote-feedback"></div>
        </div>
        </div>
      </div>
    `;
  }

  // Re-setup event listeners
  setupEventListeners();

  // Re-setup drag listeners if floating
  if (isFloating) {
    setupDragListeners();
  }
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
  if (toggleBtn && !isFloating) {
    // When not floating, entire header is clickable
    const header = noteUI.querySelector('.younote-header');
    if (header) {
      header.addEventListener('click', handleToggleClick);
    }
  } else if (toggleBtn && isFloating) {
    // When floating, only the minimize button is clickable (not entire header - that's for drag)
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
  // Open YouNote in a new tab for user to connect
  window.open('https://younote-two.vercel.app', '_blank');
}

// Handle toggle button click (expand/collapse)
function handleToggleClick(e) {
  // Don't toggle if we just finished dragging (actual movement occurred)
  if (hasDragged) {
    hasDragged = false;
    return;
  }

  const content = noteUI.querySelector('#younote-content');
  const toggleBtn = noteUI.querySelector('#younote-toggle-btn');
  const card = noteUI.querySelector('#younote-card');

  if (content && card) {
    const isExpanded = !card.classList.contains('younote-collapsed');

    if (isExpanded) {
      // Collapse
      card.classList.add('younote-collapsed');
      if (toggleBtn) {
        if (isFloating) {
          toggleBtn.classList.add('younote-collapsed-state');
        } else {
          toggleBtn.textContent = '▼';
        }
      }
    } else {
      // Expand
      card.classList.remove('younote-collapsed');
      if (toggleBtn) {
        if (isFloating) {
          toggleBtn.classList.remove('younote-collapsed-state');
        } else {
          toggleBtn.textContent = '▲';
        }
      }
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
  const btnText = saveBtn.querySelector('.younote-btn-text');
  const btnSpinner = saveBtn.querySelector('.younote-btn-spinner');
  if (btnText) btnText.style.display = 'none';
  if (btnSpinner) btnSpinner.style.display = 'flex';

  if (feedback) {
    feedback.textContent = 'Saving to your Extension Notebook...';
    feedback.className = 'younote-feedback younote-feedback-info';
  }

  try {
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
      throw new Error('Extension was updated. Please reload this page to continue using YouNote.');
    }

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
        const btnText = saveBtn.querySelector('.younote-btn-text');
        const btnSpinner = saveBtn.querySelector('.younote-btn-spinner');
        if (btnText) {
          btnText.style.display = 'inline';
          btnText.textContent = 'Save Note';
        }
        if (btnSpinner) btnSpinner.style.display = 'none';
      }, 1500);
    } else {
      // Show error feedback
      if (feedback) {
        feedback.textContent = `❌ ${response.error || 'Failed to save note'}`;
        feedback.className = 'younote-feedback younote-feedback-error';
      }
      saveBtn.disabled = false;
      const btnText = saveBtn.querySelector('.younote-btn-text');
      const btnSpinner = saveBtn.querySelector('.younote-btn-spinner');
      if (btnText) {
        btnText.style.display = 'inline';
        btnText.textContent = 'Retry';
      }
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  } catch (error) {
    console.error('Error saving note:', error);

    // Check if it's an extension context error
    const isContextError = error.message?.includes('Extension context invalidated') ||
                          error.message?.includes('Extension was updated') ||
                          error.message?.includes('reload this page');

    if (feedback) {
      if (isContextError) {
        feedback.innerHTML = `❌ Extension updated. <a href="#" onclick="location.reload(); return false;" style="color: #3b82f6; text-decoration: underline;">Reload page</a> to continue.`;
      } else {
        feedback.textContent = `❌ ${error.message || 'Failed to save note'}`;
      }
      feedback.className = 'younote-feedback younote-feedback-error';
    }

    saveBtn.disabled = false;
    const btnText = saveBtn.querySelector('.younote-btn-text');
    const btnSpinner = saveBtn.querySelector('.younote-btn-spinner');
    if (btnText) {
      btnText.style.display = 'inline';
      btnText.textContent = isContextError ? 'Reload Page' : 'Retry';
    }
    if (btnSpinner) btnSpinner.style.display = 'none';

    // If context error, make button reload the page
    if (isContextError) {
      saveBtn.onclick = () => location.reload();
    }
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

// Draggable functionality
function setupDragListeners() {
  const header = noteUI.querySelector('.younote-header');
  const dragBorder = noteUI.querySelector('.younote-drag-border');
  console.log('[YouNote] Setting up drag listeners', { header, dragBorder });

  if (!header && !dragBorder) {
    console.error('[YouNote] No draggable elements found');
    return;
  }

  // Remove old listeners first to prevent duplicates
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', handleDragEnd);

  // Add listeners to header and drag border
  if (header) {
    header.addEventListener('mousedown', handleDragStart);
  }
  if (dragBorder) {
    dragBorder.addEventListener('mousedown', handleDragStart);
  }

  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);
  console.log('[YouNote] Drag listeners attached');
}

function handleDragStart(e) {
  console.log('[YouNote] Drag start', e.button, e.target);

  // Only drag with left mouse button
  if (e.button !== 0) {
    console.log('[YouNote] Not left button, ignoring');
    return;
  }

  // Don't drag if clicking interactive elements
  if (e.target.matches('textarea, button, input') ||
      e.target.closest('textarea, button, input, .younote-window-controls')) {
    console.log('[YouNote] Clicked interactive element, ignoring');
    return;
  }

  console.log('[YouNote] Starting drag');
  isDragging = true;
  hasDragged = false; // Reset on new drag start
  noteUI.classList.add('younote-dragging');

  const rect = noteUI.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;

  e.preventDefault();
}

function handleDragMove(e) {
  if (!isDragging) return;

  hasDragged = true; // Mark that actual movement occurred
  console.log('[YouNote] Dragging to', e.clientX, e.clientY);

  const x = e.clientX - dragOffset.x;
  const y = e.clientY - dragOffset.y;

  // Keep within viewport bounds
  const maxX = window.innerWidth - noteUI.offsetWidth;
  const maxY = window.innerHeight - noteUI.offsetHeight;

  const boundedX = Math.max(0, Math.min(x, maxX));
  const boundedY = Math.max(0, Math.min(y, maxY));

  noteUI.style.left = boundedX + 'px';
  noteUI.style.top = boundedY + 'px';
  noteUI.style.right = 'auto';
  noteUI.style.bottom = 'auto';

  e.preventDefault();
}

function handleDragEnd(e) {
  if (!isDragging) return;

  isDragging = false;
  noteUI.classList.remove('younote-dragging');

  // If we didn't actually drag (just clicked), toggle collapse
  if (!hasDragged) {
    handleToggleClick();
  } else {
    // Save position if we actually moved
    savePosition();
  }

  e.preventDefault();
}

function savePosition() {
  const rect = noteUI.getBoundingClientRect();
  localStorage.setItem('younote-position', JSON.stringify({
    left: rect.left,
    top: rect.top,
  }));
}

function restoreSavedPosition() {
  const saved = localStorage.getItem('younote-position');
  if (!saved) return;

  try {
    const { left, top } = JSON.parse(saved);

    // Validate position is still within viewport
    const maxX = window.innerWidth - noteUI.offsetWidth;
    const maxY = window.innerHeight - noteUI.offsetHeight;

    const boundedLeft = Math.max(0, Math.min(left, maxX));
    const boundedTop = Math.max(0, Math.min(top, maxY));

    noteUI.style.left = boundedLeft + 'px';
    noteUI.style.top = boundedTop + 'px';
    noteUI.style.right = 'auto';
    noteUI.style.bottom = 'auto';
  } catch (error) {
    console.error('[YouNote] Error restoring position:', error);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
