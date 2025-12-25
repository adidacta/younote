# Chrome Extension Debugging Guide

## Testing the Auth Detection Fix

I've added comprehensive logging throughout the extension to help debug the authentication persistence issue.

### Step 1: Reload the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Find "YouNote - YouTube Note Taker"
3. Click the **Reload** button (circular arrow icon)

### Step 2: Test the Login Flow

1. **Go to YouTube** and click the YouNote extension icon
2. Click the **"Login"** button (should open https://younote-two.vercel.app/auth/login)
3. **Open Browser Console** on the YouNote tab (F12 or Cmd+Option+I on Mac)
4. **Log in** to YouNote
5. **Stay on the YouNote page** for 5-10 seconds after logging in
6. **Check the console** for logs starting with `[YouNote Extension]`

### Step 3: Check What the Logs Show

#### Expected Console Output on YouNote Page:

```
[YouNote Extension] Auth detector loaded on: https://younote-two.vercel.app/...
[YouNote Extension] Extension ID: abc123...
[YouNote Extension] Checking for auth...
[YouNote Extension] LocalStorage keys: [...]
[YouNote Extension] Found auth key: sb-xxx-auth-token
[YouNote Extension] Sending AUTH_DETECTED message to background...
[YouNote Extension] Auth sent successfully, response: { success: true, ... }
✓ YouNote Extension Connected! (notification should appear)
```

#### If Something's Wrong, You Might See:

**No content script logs at all:**
- Content script not loading → Extension match patterns issue

**"No auth token found in localStorage":**
- Auth not being stored by Supabase → Need to check Supabase client config

**"Standard auth-token key not found, checking all sb- keys...":**
- Different localStorage key format → Logs will show what keys exist

**"Error sending auth to extension":**
- Message passing issue → Extension might be disabled or crash

### Step 4: Check Background Script

1. Go to `chrome://extensions/`
2. Find YouNote extension
3. Click **"service worker"** link (opens console for background script)
4. Look for logs starting with `[YouNote Background]`

#### Expected Background Logs:

```
[YouNote Background] Service worker starting...
[YouNote Background] Received message: AUTH_DETECTED from: https://younote-two.vercel.app/...
[YouNote Background] AUTH_DETECTED message received with data: { ... }
[YouNote Background] Auth data stored successfully
[YouNote Background] Verification - stored data: { hasToken: true, hasNickname: true }
```

### Step 5: Check Popup

1. Go back to YouTube
2. Click the YouNote extension icon
3. Right-click on the popup and select **"Inspect"**
4. Check console for `[YouNote Popup]` logs

#### Expected Popup Logs:

```
[YouNote Popup] Checking auth status...
[YouNote Popup] Storage contents: { hasToken: true, hasNickname: true, userId: '...', userEmail: '...' }
[YouNote Popup] User is logged in: YourNickname
```

## Common Issues and Fixes

### Issue 1: Content Script Not Loading

**Symptom:** No `[YouNote Extension]` logs in YouNote page console

**Fix:** Check that:
- Extension is enabled in chrome://extensions/
- You're on the correct URL (https://younote-two.vercel.app or http://localhost:3000)
- Extension was reloaded after code changes

### Issue 2: Wrong localStorage Key Format

**Symptom:** Logs show "Standard auth-token key not found" followed by list of sb- keys

**Solution:** The improved code now checks ALL sb- keys and tries to find one with auth data. Check what keys are shown in the logs.

### Issue 3: Message Not Reaching Background

**Symptom:** Content script logs show "Auth sent successfully" but background script has no logs

**Fix:**
- Check if background service worker is running (chrome://extensions/ → service worker link)
- If service worker is "inactive", it might have crashed → Check for errors in service worker console

### Issue 4: Storage Not Persisting

**Symptom:** Background logs show "stored successfully" but popup still shows "Login" button

**Fix:**
- Check popup logs to see what it's reading from storage
- Try manually checking storage:
  ```javascript
  // In background console:
  chrome.storage.local.get(['authToken', 'userNickname'], (result) => console.log(result))
  ```

## Report Back

After testing, please share:
1. Screenshots of console logs from YouNote page
2. Screenshots of background service worker logs
3. Screenshots of popup console logs
4. Description of what you see vs. what's expected

This will help identify exactly where the auth detection is failing.
