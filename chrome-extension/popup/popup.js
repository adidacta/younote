// YouNote Extension Popup Script

const YOUNOTE_URL = "https://younote-two.vercel.app"; // Change to production URL when deploying

// DOM Elements
const loadingDiv = document.getElementById("loading");
const notLoggedInDiv = document.getElementById("not-logged-in");
const loggedInDiv = document.getElementById("logged-in");
const loginBtn = document.getElementById("login-btn");
const openYouNoteBtn = document.getElementById("open-younote-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNicknameSpan = document.getElementById("user-nickname");

// Check auth status on popup load
async function checkAuthStatus() {
  try {
    console.log('[YouNote Popup] Checking auth status...');
    const result = await chrome.storage.local.get([
      "authToken",
      "userNickname",
      "userId",
      "userEmail"
    ]);

    console.log('[YouNote Popup] Storage contents:', {
      hasToken: !!result.authToken,
      hasNickname: !!result.userNickname,
      userId: result.userId,
      userEmail: result.userEmail
    });

    if (result.authToken && result.userNickname) {
      // User is logged in
      console.log('[YouNote Popup] User is logged in:', result.userNickname);
      showLoggedInState(result.userNickname);
    } else {
      // User is not logged in
      console.log('[YouNote Popup] User is not logged in');
      showNotLoggedInState();
    }
  } catch (error) {
    console.error('[YouNote Popup] Error checking auth status:', error);
    showNotLoggedInState();
  }
}

function showLoggedInState(nickname) {
  loadingDiv.classList.add("hidden");
  notLoggedInDiv.classList.add("hidden");
  loggedInDiv.classList.remove("hidden");
  userNicknameSpan.textContent = nickname;
}

function showNotLoggedInState() {
  loadingDiv.classList.add("hidden");
  loggedInDiv.classList.add("hidden");
  notLoggedInDiv.classList.remove("hidden");
}

// Login button click
loginBtn.addEventListener("click", async () => {
  try {
    // Open YouNote login page in new tab
    await chrome.tabs.create({ url: `${YOUNOTE_URL}/auth/login` });

    // Close popup
    window.close();
  } catch (error) {
    console.error("Error opening YouNote:", error);
  }
});

// Open YouNote button click
openYouNoteBtn.addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: YOUNOTE_URL });
    window.close();
  } catch (error) {
    console.error("Error opening YouNote:", error);
  }
});

// Logout button click
logoutBtn.addEventListener("click", async () => {
  try {
    // Clear stored auth data
    await chrome.storage.local.remove([
      "authToken",
      "userNickname",
      "notebookId",
    ]);

    // Send message to background script to clear auth
    chrome.runtime.sendMessage({ type: "LOGOUT" });

    // Update UI
    showNotLoggedInState();
  } catch (error) {
    console.error("Error logging out:", error);
  }
});

// Initialize
checkAuthStatus();

// Listen for auth status changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && (changes.authToken || changes.userNickname)) {
    checkAuthStatus();
  }
});
