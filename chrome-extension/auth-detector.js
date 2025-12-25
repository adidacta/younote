// YouNote Auth Detector - Runs on YouNote domain to capture auth session

console.log('[YouNote Extension] Auth detector loaded on:', window.location.href);
console.log('[YouNote Extension] Extension ID:', chrome.runtime.id);

// Listen for messages from the YouNote web app
window.addEventListener('message', (event) => {
  console.log('[YouNote Extension] Received postMessage:', {
    origin: event.origin,
    windowOrigin: window.location.origin,
    hasSource: !!event.data?.source,
    source: event.data?.source,
    type: event.data?.type
  });

  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) {
    console.log('[YouNote Extension] Ignoring message from different origin');
    return;
  }

  // Check if this is a message from YouNote webapp
  if (event.data?.source === 'younote-webapp' && event.data?.type === 'AUTH_DETECTED') {
    console.log('[YouNote Extension] Received auth from webpage via postMessage');
    handleAuthFromWebpage(event.data.data);
  } else {
    console.log('[YouNote Extension] Message does not match expected format');
  }
});

async function handleAuthFromWebpage(authData) {
  try {
    console.log('[YouNote Extension] Processing auth from webpage:', {
      hasToken: !!authData.authToken,
      hasNickname: !!authData.userNickname,
      userId: authData.userId
    });

    // Send to extension background script
    console.log('[YouNote Extension] Sending AUTH_DETECTED message to background...');

    chrome.runtime.sendMessage({
      type: 'AUTH_DETECTED',
      data: authData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[YouNote Extension] Error sending auth to extension:',
                     chrome.runtime.lastError);
      } else {
        console.log('[YouNote Extension] Auth sent successfully, response:', response);

        // Show success message to user
        showAuthSuccessMessage();
      }
    });
  } catch (error) {
    console.error('[YouNote Extension] Error handling auth from webpage:', error);
  }
}

// Check for auth session periodically
let checkInterval = null;
let lastAuthState = null;

async function checkForAuth() {
  try {
    console.log('[YouNote Extension] Checking for auth...');

    // Check if we're logged in by looking for user data in localStorage
    // Supabase stores session data in localStorage with keys like:
    // sb-<project-id>-auth-token

    const storageKeys = Object.keys(localStorage);
    console.log('[YouNote Extension] LocalStorage keys:', storageKeys);

    // Try to find Supabase auth key - be flexible with the format
    let supabaseAuthKey = null;
    let authData = null;

    // First, try the standard format
    supabaseAuthKey = storageKeys.find(key =>
      key.startsWith('sb-') && key.includes('-auth-token')
    );

    // If not found, try to find any sb- key that contains auth data
    if (!supabaseAuthKey) {
      console.log('[YouNote Extension] Standard auth-token key not found, checking all sb- keys...');
      const sbKeys = storageKeys.filter(k => k.startsWith('sb-'));
      console.log('[YouNote Extension] Found sb- keys:', sbKeys);

      for (const key of sbKeys) {
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;

          const parsed = JSON.parse(data);
          console.log(`[YouNote Extension] Checking key "${key}":`, {
            hasAccessToken: !!parsed?.access_token,
            hasUser: !!parsed?.user,
            keys: Object.keys(parsed || {})
          });

          if (parsed?.access_token && parsed?.user) {
            console.log(`[YouNote Extension] Found valid auth data in key: ${key}`);
            supabaseAuthKey = key;
            authData = parsed;
            break;
          }
        } catch (e) {
          console.log(`[YouNote Extension] Key "${key}" is not valid JSON`);
        }
      }
    }

    if (!supabaseAuthKey) {
      console.log('[YouNote Extension] No auth token found in localStorage');
      return;
    }

    console.log('[YouNote Extension] Found auth key:', supabaseAuthKey);

    // If we haven't already parsed the auth data, do it now
    if (!authData) {
      const authDataStr = localStorage.getItem(supabaseAuthKey);
      if (!authDataStr) {
        console.log('[YouNote Extension] Auth key exists but no data');
        return;
      }
      authData = JSON.parse(authDataStr);
    }

    const accessToken = authData?.access_token;
    const user = authData?.user;

    if (!accessToken || !user) {
      console.log('[YouNote Extension] Incomplete auth data:', {
        hasAccessToken: !!accessToken,
        hasUser: !!user,
        authDataKeys: Object.keys(authData || {})
      });
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
      console.log('[YouNote Extension] Sending AUTH_DETECTED message to background...');

      try {
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
            console.error('[YouNote Extension] This might mean the extension is not loaded or disabled');
          } else {
            console.log('[YouNote Extension] Auth sent successfully, response:', response);

            // Show success message to user
            showAuthSuccessMessage();
          }
        });
      } catch (error) {
        console.error('[YouNote Extension] Exception while sending message:', error);
      }
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
console.log('[YouNote Extension] Starting auth detection...');
checkForAuth();

// Check periodically while page is open (every 2 seconds)
checkInterval = setInterval(checkForAuth, 2000);

// Also check after a delay (in case page hasn't fully loaded)
setTimeout(checkForAuth, 1000);
setTimeout(checkForAuth, 3000);

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
