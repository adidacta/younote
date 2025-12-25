// YouNote Auth Detector - Runs on YouNote domain to capture auth session

console.log('[YouNote Extension] Auth detector loaded');

// Check for auth session periodically
let checkInterval = null;
let lastAuthState = null;

async function checkForAuth() {
  try {
    // Check if we're logged in by looking for user data in localStorage
    // Supabase stores session data in localStorage with keys like:
    // sb-<project-id>-auth-token

    const storageKeys = Object.keys(localStorage);
    const supabaseAuthKey = storageKeys.find(key =>
      key.startsWith('sb-') && key.includes('-auth-token')
    );

    if (!supabaseAuthKey) {
      console.log('[YouNote Extension] No auth token found in localStorage');
      return;
    }

    const authDataStr = localStorage.getItem(supabaseAuthKey);
    if (!authDataStr) {
      console.log('[YouNote Extension] Auth key exists but no data');
      return;
    }

    const authData = JSON.parse(authDataStr);
    const accessToken = authData?.access_token;
    const user = authData?.user;

    if (!accessToken || !user) {
      console.log('[YouNote Extension] Incomplete auth data');
      return;
    }

    // Get user profile/nickname
    const nickname = user.user_metadata?.nickname ||
                     user.user_metadata?.full_name ||
                     user.email?.split('@')[0] ||
                     'User';

    const authState = {
      token: accessToken,
      userId: user.id,
      email: user.email,
      nickname: nickname
    };

    // Check if auth state changed (user just logged in)
    const authStateStr = JSON.stringify(authState);
    if (authStateStr !== lastAuthState) {
      console.log('[YouNote Extension] Auth state changed, sending to extension...', {
        userId: user.id,
        email: user.email,
        nickname: nickname
      });

      lastAuthState = authStateStr;

      // Send to extension background script
      chrome.runtime.sendMessage({
        type: 'AUTH_DETECTED',
        data: {
          authToken: accessToken,
          userId: user.id,
          userEmail: user.email,
          userNickname: nickname
        }
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[YouNote Extension] Error sending auth to extension:',
                       chrome.runtime.lastError);
        } else {
          console.log('[YouNote Extension] Auth sent successfully:', response);

          // Show success message to user
          showAuthSuccessMessage();
        }
      });
    }
  } catch (error) {
    console.error('[YouNote Extension] Error checking auth:', error);
  }
}

function showAuthSuccessMessage() {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = '✓ YouNote Extension Connected!';

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 3000);
}

// Start checking for auth on page load
checkForAuth();

// Check periodically while page is open (every 2 seconds)
checkInterval = setInterval(checkForAuth, 2000);

// Also check when localStorage changes
window.addEventListener('storage', (e) => {
  if (e.key && e.key.includes('auth-token')) {
    console.log('[YouNote Extension] Storage changed, checking auth...');
    checkForAuth();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
