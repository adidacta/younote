// YouNote Extension Background Service Worker

const YOUNOTE_API_URL = "https://younote-two.vercel.app/api"; // Change to production URL when deploying
const NOTEBOOK_NAME = "Browser Extension Notes";

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CREATE_NOTE") {
    handleCreateNote(request.data).then(sendResponse);
    return true; // Keep message channel open for async response
  }

  if (request.type === "CHECK_AUTH") {
    checkAuthStatus().then(sendResponse);
    return true;
  }

  if (request.type === "LOGOUT") {
    handleLogout().then(sendResponse);
    return true;
  }

  if (request.type === "AUTH_DETECTED") {
    handleAuthDetected(request.data).then(sendResponse);
    return true;
  }
});

// Check if user is authenticated
async function checkAuthStatus() {
  try {
    const result = await chrome.storage.local.get(["authToken"]);

    if (!result.authToken) {
      return { authenticated: false };
    }

    // Verify token with API
    const response = await fetch(`${YOUNOTE_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${result.authToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Store user nickname
      await chrome.storage.local.set({ userNickname: data.nickname || "User" });
      return { authenticated: true, user: data };
    } else {
      // Token invalid, clear storage
      await chrome.storage.local.remove(["authToken", "userNickname"]);
      return { authenticated: false };
    }
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { authenticated: false, error: error.message };
  }
}

// Handle logout
async function handleLogout() {
  try {
    await chrome.storage.local.remove([
      "authToken",
      "userNickname",
      "notebookId",
    ]);
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: error.message };
  }
}

// Create a note
async function handleCreateNote(data) {
  try {
    const { videoId, videoTitle, videoUrl, content, timestamp } = data;

    // Get auth token
    const result = await chrome.storage.local.get(["authToken"]);
    if (!result.authToken) {
      return { success: false, error: "Not authenticated" };
    }

    // 1. Get or create notebook
    const notebookId = await getOrCreateNotebook(result.authToken);
    if (!notebookId) {
      return { success: false, error: "Failed to get/create notebook" };
    }

    // 2. Get or create page
    const pageId = await getOrCreatePage(
      result.authToken,
      videoId,
      videoTitle,
      videoUrl,
      notebookId
    );
    if (!pageId) {
      return { success: false, error: "Failed to get/create page" };
    }

    // 3. Create note
    const note = await createNote(result.authToken, pageId, content, timestamp);
    if (!note) {
      return { success: false, error: "Failed to create note" };
    }

    return { success: true, note };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: error.message };
  }
}

// Get or create the extension notebook
async function getOrCreateNotebook(authToken) {
  try {
    // Check if we have stored notebook ID
    const result = await chrome.storage.local.get(["notebookId"]);
    if (result.notebookId) {
      // Verify it still exists
      const response = await fetch(
        `${YOUNOTE_API_URL}/notebooks/${result.notebookId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        return result.notebookId;
      }
      // Notebook doesn't exist anymore, clear storage
      await chrome.storage.local.remove(["notebookId"]);
    }

    // Search for notebook by name
    const notebooks = await fetch(`${YOUNOTE_API_URL}/notebooks`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json());

    const existingNotebook = notebooks.find((nb) => nb.title === NOTEBOOK_NAME);
    if (existingNotebook) {
      await chrome.storage.local.set({ notebookId: existingNotebook.id });
      return existingNotebook.id;
    }

    // Create new notebook
    const response = await fetch(`${YOUNOTE_API_URL}/notebooks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: NOTEBOOK_NAME }),
    });

    if (!response.ok) {
      throw new Error("Failed to create notebook");
    }

    const notebook = await response.json();
    await chrome.storage.local.set({ notebookId: notebook.id });
    return notebook.id;
  } catch (error) {
    console.error("Error getting/creating notebook:", error);
    return null;
  }
}

// Get or create page for video
async function getOrCreatePage(
  authToken,
  videoId,
  videoTitle,
  videoUrl,
  notebookId
) {
  try {
    // Search for existing page by video ID
    const response = await fetch(
      `${YOUNOTE_API_URL}/pages?youtube_video_id=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.ok) {
      const pages = await response.json();
      if (pages.length > 0) {
        return pages[0].id;
      }
    }

    // Create new page
    const createResponse = await fetch(`${YOUNOTE_API_URL}/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notebook_id: notebookId,
        youtube_url: videoUrl,
        title: videoTitle,
      }),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create page");
    }

    const page = await createResponse.json();
    return page.id;
  } catch (error) {
    console.error("Error getting/creating page:", error);
    return null;
  }
}

// Create note
async function createNote(authToken, pageId, content, timestamp) {
  try {
    const response = await fetch(`${YOUNOTE_API_URL}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_id: pageId,
        content,
        timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create note");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating note:", error);
    return null;
  }
}

// Handle auth detected from YouNote website
async function handleAuthDetected(data) {
  try {
    console.log('Auth detected from website:', data);

    // Store auth data
    await chrome.storage.local.set({
      authToken: data.authToken,
      userNickname: data.userNickname,
      userId: data.userId,
      userEmail: data.userEmail
    });

    console.log('Auth data stored successfully');

    return {
      success: true,
      message: 'Extension connected to YouNote account'
    };
  } catch (error) {
    console.error('Error handling auth detection:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Listen for web app authentication (when user logs in via web app)
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouNote extension installed");
});
