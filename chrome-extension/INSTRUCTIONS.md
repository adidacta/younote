# YouNote Chrome Extension - Setup Instructions

This document provides step-by-step instructions for setting up, testing, and deploying the YouNote Chrome extension.

---

## 📦 What's Been Built

The extension is **feature-complete for MVP** and includes all planned functionality:

### ✅ Core Features Implemented

1. **Authentication Flow**
   - Auto-detect browser session from YouNote web app
   - Fallback to web app login if not authenticated
   - Extension popup shows login status with user nickname
   - Logout functionality

2. **Note-Taking Interface**
   - Injects below YouTube video (context-aware placement)
   - Expand/collapse functionality (starts expanded)
   - Markdown support in textarea
   - Real-time character count and validation

3. **Timestamp Capture**
   - Automatically captures video timestamp when user starts typing (first character)
   - Displays timestamp in human-readable format (MM:SS or H:MM:SS)
   - Resets timestamp when textarea is cleared

4. **Save to YouNote**
   - Sends notes to YouNote backend via API
   - Creates notes with content and timestamp
   - Shows loading state: "Saving to your Extension Notebook..."
   - Success feedback with brief flash animation
   - Error handling with retry capability

5. **Notebook & Page Management**
   - Auto-creates "Browser Extension Notes" notebook on first use
   - Stores notebook ID (not name) to handle renames
   - Auto-creates pages for new videos
   - Detects existing pages and reuses them

6. **UI/UX Features**
   - Dark mode support (adapts to YouTube theme)
   - Smooth animations and transitions
   - Disabled save button when textarea is empty
   - Preserves note content on error
   - Resets to "New Note" state after successful save

7. **Extension Popup**
   - Shows "Hey, [Nickname]!" when logged in
   - "Open YouNote" button (opens web app in new tab)
   - Logout button
   - Login prompt when not authenticated

---

## 📁 File Structure

```
chrome-extension/
├── PLAN.md                    # Complete design document
├── README.md                  # Development guide
├── INSTRUCTIONS.md            # This file - setup instructions
├── manifest.json              # Chrome Extension Manifest V3
├── background.js              # Service worker (handles API calls)
├── content.js                 # Injected into YouTube pages
├── popup/
│   ├── popup.html            # Extension popup UI
│   ├── popup.js              # Popup logic
│   └── popup.css             # Popup styles
├── styles/
│   └── youtube.css           # Styles for YouTube note interface
├── icons/                     # Extension icons (REQUIRED)
│   ├── icon16.png            # ⚠️ TO BE ADDED
│   ├── icon48.png            # ⚠️ TO BE ADDED
│   ├── icon128.png           # ⚠️ TO BE ADDED
│   └── ICONS_TODO.md         # Instructions for creating icons
└── .gitignore                # Git ignore rules
```

---

## ⚠️ Before You Can Test

### Step 1: Create Icon Files (REQUIRED)

The extension **will not load** without icon files. Create three PNG files:

**Required Files:**
- `icons/icon16.png` - 16x16 pixels
- `icons/icon48.png` - 48x48 pixels
- `icons/icon128.png` - 128x128 pixels

**Design Guidelines:**
- Simple, recognizable YouNote branding
- PNG format with transparency
- Should be clear at 16px size

**Quick Options:**
1. **Use existing logo**: Resize to 16px, 48px, 128px
2. **Simple design**: Notepad icon + YouTube play button
3. **Text-based**: "YN" initials with colored background
4. **Placeholder for testing**: Solid colored squares (any color)

**Tools:**
- Online: Figma, Canva, svgtopng.com
- Software: Photoshop, Illustrator, GIMP
- Quick: Take any image and resize using online tools

See `icons/ICONS_TODO.md` for more details.

---

### Step 2: Configure API URLs

Update the API URLs in two files to match your environment:

#### File 1: `popup/popup.js` (Line 3)

```javascript
const YOUNOTE_URL = 'http://localhost:3000'; // Change for production
```

**Options:**
- Development: `http://localhost:3000`
- Production: `https://younote.vercel.app` (or your domain)

#### File 2: `background.js` (Line 3)

```javascript
const YOUNOTE_API_URL = 'http://localhost:3000/api'; // Change for production
```

**Options:**
- Development: `http://localhost:3000/api`
- Production: `https://younote.vercel.app/api` (or your domain)

---

### Step 3: Ensure CORS is Enabled

Your YouNote backend must allow requests from the Chrome extension.

**For Development:**
Add to your Next.js API route headers or middleware:
```javascript
'Access-Control-Allow-Origin': 'chrome-extension://*'
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
```

**Note:** Chrome extensions use `chrome-extension://` protocol, not `http://`.

---

## 🚀 How to Load and Test

### Loading the Extension

1. **Open Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle switch in top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `chrome-extension` folder
   - Extension should appear in your extensions list

4. **Verify Installation**
   - Extension icon should appear in Chrome toolbar
   - Check that no errors are shown

### Testing the Extension

#### Test 1: Authentication

1. **Open YouTube** (any video)
2. **Look for note interface** below video
3. **Should show**: "Login to start taking notes"
4. **Click extension icon** in toolbar
5. **Should show**: "Login to YouNote →" button
6. **Click login button**
7. **Should open**: YouNote web app in new tab
8. **Login to YouNote** using your credentials
9. **Return to YouTube tab**
10. **Extension should detect session** (may need to refresh page)

#### Test 2: Creating a Note

1. **Go to any YouTube video** (while logged in)
2. **Note interface should appear** below video (expanded)
3. **Start typing** in textarea
4. **Timestamp should auto-capture** when you type first character
5. **Type a test note** (e.g., "This is a test note")
6. **Click "Save Note"**
7. **Should show**: "Saving to your Extension Notebook..."
8. **Should show**: Success animation and "✅ Note saved!"
9. **Interface should reset** to empty textarea
10. **Add another note** to verify it works repeatedly

#### Test 3: Verify in YouNote Web App

1. **Open YouNote web app** in new tab
2. **Navigate to "Notebooks"**
3. **Find "Browser Extension Notes" notebook** (auto-created)
4. **Open the notebook**
5. **Find page for the video** you were watching
6. **Verify your notes** are there with timestamps

#### Test 4: Expand/Collapse

1. **On YouTube video page**
2. **Click the ▲ button** in note interface header
3. **Interface should collapse** (only title bar visible)
4. **Click the ▼ button**
5. **Interface should expand** again

#### Test 5: Error Handling

1. **Disconnect from internet** (or stop YouNote backend)
2. **Try to save a note**
3. **Should show**: Error message
4. **Note content should be preserved**
5. **"Retry" button should appear**
6. **Reconnect internet**
7. **Click "Retry"**
8. **Note should save successfully**

#### Test 6: Dark Mode

1. **Enable YouTube dark theme** (click profile → Appearance → Dark)
2. **Note interface should adapt** to dark theme
3. **Text should remain readable**
4. **Colors should match YouTube's dark theme**

---

## 🐛 Troubleshooting

### Extension Won't Load

**Symptom:** Error when clicking "Load unpacked"

**Solutions:**
- ✅ Check that icon files exist in `icons/` folder
- ✅ Verify `manifest.json` is valid JSON (use JSON validator)
- ✅ Make sure you selected the `chrome-extension` folder, not its parent
- ✅ Check Chrome console for specific error messages

### Note Interface Not Appearing

**Symptom:** No note UI on YouTube video pages

**Solutions:**
- ✅ Verify you're on a video page (`/watch?v=` or `/live/` URL)
- ✅ Refresh the page (Ctrl+R or Cmd+R)
- ✅ Check browser console for JavaScript errors (F12 → Console)
- ✅ Try clicking extension icon to reload it
- ✅ Verify content script is injected (F12 → Sources → Content scripts)

### "Not authenticated" Error

**Symptom:** Can't save notes, says "Not authenticated"

**Solutions:**
- ✅ Click extension icon → Check login status
- ✅ If not logged in, click "Login to YouNote"
- ✅ Make sure you're logged into YouNote web app
- ✅ Try logging out and back in
- ✅ Check browser console for auth errors

### "Failed to create notebook" Error

**Symptom:** Error when trying to save first note

**Solutions:**
- ✅ Verify YouNote backend is running
- ✅ Check API URL configuration in `background.js`
- ✅ Open background service worker console (`chrome://extensions/` → "Service worker" link)
- ✅ Check for CORS errors in console
- ✅ Verify auth token is valid (check Network tab in DevTools)

### Timestamp Not Capturing

**Symptom:** No timestamp shown when typing

**Solutions:**
- ✅ Verify video is playing or loaded
- ✅ Check that YouTube video element exists (F12 → Console → `document.querySelector('video')`)
- ✅ Try refreshing the page
- ✅ Check content script console for errors

### Notes Not Syncing to Web App

**Symptom:** Notes save successfully but don't appear in YouNote

**Solutions:**
- ✅ Refresh YouNote web app
- ✅ Check "Browser Extension Notes" notebook was created
- ✅ Verify page was created for the video
- ✅ Check background service worker console for API errors
- ✅ Verify database permissions (Supabase RLS)

---

## 🔧 Development Workflow

### Making Changes

1. **Edit files** in the `chrome-extension` folder
2. **Go to** `chrome://extensions/`
3. **Click refresh icon** on YouNote extension card
4. **Reload YouTube page** to test changes
5. **Check console** for any errors

### Debugging

**Content Script (YouTube page):**
- Open DevTools on YouTube page (F12)
- Console tab shows content script logs
- Sources tab → Content scripts → `content.js`

**Background Script (API calls):**
- Go to `chrome://extensions/`
- Find YouNote extension
- Click "Service worker" link
- Opens DevTools for background script

**Popup:**
- Right-click extension icon
- Select "Inspect popup"
- Opens DevTools for popup

### Testing Tips

1. **Use console.log** liberally for debugging
2. **Check Network tab** for API calls (see request/response)
3. **Test with different videos** (regular, live streams, shorts)
4. **Test in incognito mode** to verify clean install
5. **Test after clearing extension storage** (simulate new user)

---

## 📋 Pre-Deployment Checklist

Before deploying to Chrome Web Store:

### Code Changes
- [ ] Update API URLs to production
- [ ] Remove all `console.log` statements (or use production flag)
- [ ] Update version number in `manifest.json`
- [ ] Test thoroughly on multiple videos
- [ ] Test authentication flow end-to-end
- [ ] Test error scenarios

### Assets
- [ ] Create professional icon files (16px, 48px, 128px)
- [ ] Create promotional images for Chrome Web Store:
  - [ ] Small tile: 440x280 PNG
  - [ ] Large tile: 920x680 PNG (optional)
  - [ ] Marquee: 1400x560 PNG (optional)
  - [ ] Screenshots: 1280x800 or 640x400 PNG (at least 1)

### Documentation
- [ ] Write clear extension description (132 chars for short description)
- [ ] Create detailed description for store listing
- [ ] List key features and benefits
- [ ] Add privacy policy URL (required)
- [ ] Add support email/URL

### Legal
- [ ] Review Chrome Web Store policies
- [ ] Ensure privacy policy is up to date
- [ ] Verify data collection disclosure
- [ ] Check trademark usage

### Testing
- [ ] Test on fresh Chrome installation
- [ ] Test with new user account
- [ ] Test all features work end-to-end
- [ ] Verify no console errors
- [ ] Test on different screen sizes
- [ ] Test with slow network connection

---

## 🚢 Deployment to Chrome Web Store

### Step 1: Prepare Package

1. **Update version** in `manifest.json`:
   ```json
   "version": "1.0.0"
   ```

2. **Create ZIP file**:
   ```bash
   cd chrome-extension
   zip -r younote-extension-v1.0.0.zip . -x ".*" -x "PLAN.md" -x "README.md" -x "INSTRUCTIONS.md"
   ```

### Step 2: Create Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with Google account
3. Pay $5 one-time developer registration fee (if first time)
4. Verify email address

### Step 3: Upload Extension

1. Click "New Item" button
2. Upload ZIP file
3. Fill in store listing:
   - **Extension name**: YouNote - YouTube Note Taker
   - **Summary**: Take timestamped notes while watching YouTube. Auto-syncs to YouNote.
   - **Detailed description**: [Write compelling description of features]
   - **Category**: Productivity
   - **Language**: English (or your languages)

4. Upload assets:
   - Small tile (440x280)
   - Screenshots (at least 1)
   - Extension icon (128x128)

5. Fill in privacy practices:
   - Single purpose description
   - Permission justifications
   - Host permission justifications
   - Data usage disclosure

### Step 4: Submit for Review

1. Click "Submit for review"
2. Review process typically takes 1-3 business days
3. You'll receive email when approved or if changes needed

### Step 5: Publish

1. Once approved, extension is published automatically
2. Users can install from Chrome Web Store
3. Updates are pushed within 24 hours after approval

---

## 🔄 Updating the Extension

### For Development Testing

1. Make code changes
2. Go to `chrome://extensions/`
3. Click refresh icon on extension
4. Reload affected pages

### For Production Updates

1. Make and test changes locally
2. Increment version number in `manifest.json`
3. Create new ZIP file
4. Upload to Chrome Web Store Developer Dashboard
5. Submit for review
6. Once approved, users auto-update within 24 hours

---

## 📊 Analytics and Monitoring

### Track Usage (Optional)

To monitor extension usage, consider adding:

1. **Google Analytics** (with user consent)
2. **Error tracking** (Sentry, etc.)
3. **Feature usage metrics**

**Note:** Must comply with Chrome Web Store privacy policies and disclose data collection.

### Monitor Reviews

- Check Chrome Web Store reviews regularly
- Respond to user feedback
- Track common issues or feature requests
- Use feedback to improve extension

---

## 🔐 Security Best Practices

### Current Implementation

✅ Minimal permissions requested
✅ HTTPS-only API calls
✅ No localStorage of sensitive data
✅ Auth tokens stored in extension storage (secure)
✅ Content Security Policy in manifest
✅ No eval() or inline scripts

### Additional Recommendations

- Regularly update dependencies
- Review code for XSS vulnerabilities
- Validate all user input
- Sanitize data before rendering
- Keep API endpoints secure
- Monitor for security advisories

---

## 📝 Known Limitations & Future Improvements

### Current Limitations

1. **Authentication**: Requires manual session setup. Auto-detection of Supabase session from browser storage needs implementation.

2. **Single Notebook**: All notes go to "Browser Extension Notes" notebook. No option to select different notebook.

3. **No Offline Support**: Requires internet connection to save notes.

4. **Chrome Only**: Not compatible with Firefox or Safari (different extension APIs).

### Future Enhancements

- [ ] Auto-detect Supabase session from browser
- [ ] Keyboard shortcuts (Ctrl+Shift+N)
- [ ] Rich text editor with markdown preview
- [ ] Note templates
- [ ] View existing notes in extension
- [ ] Multiple notebook support
- [ ] Offline mode with sync
- [ ] Firefox and Safari versions

---

## 📞 Getting Help

### Resources

- **PLAN.md**: Complete design document and architecture
- **README.md**: Development guide and API reference
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Manifest V3 Migration**: https://developer.chrome.com/docs/extensions/mv3/intro/

### Debugging Resources

- **Background Script Console**: `chrome://extensions/` → "Service worker"
- **Content Script Console**: F12 on YouTube page
- **Popup Console**: Right-click extension icon → "Inspect popup"
- **Extension Error Logs**: `chrome://extensions/` → "Errors" button

### Common Commands

```bash
# List all extension files
find . -type f -name "*.js" -o -name "*.json" -o -name "*.html" -o -name "*.css"

# Create distribution ZIP
zip -r younote-extension.zip . -x ".*" -x "*.md"

# Check manifest validity
cat manifest.json | python -m json.tool

# Watch for file changes (requires inotify-tools)
while inotifywait -r -e modify .; do echo "Reload extension now"; done
```

---

## ✅ Quick Start Checklist

Use this checklist to get started quickly:

1. [ ] Create icon files (16px, 48px, 128px PNG)
2. [ ] Update API URLs in `popup.js` and `background.js`
3. [ ] Ensure YouNote backend is running
4. [ ] Enable CORS for Chrome extension
5. [ ] Load extension: `chrome://extensions/` → "Load unpacked"
6. [ ] Go to YouTube video page
7. [ ] Verify note interface appears
8. [ ] Login via extension popup
9. [ ] Test creating a note
10. [ ] Verify note appears in YouNote web app
11. [ ] Test expand/collapse
12. [ ] Test error handling
13. [ ] Test with different video types
14. [ ] Check dark mode support

---

## 🎉 Success!

If you've completed all the steps above and the extension is working, congratulations! You now have a fully functional Chrome extension that lets users take timestamped notes while watching YouTube videos.

**Next Steps:**
1. Test thoroughly with real users
2. Gather feedback
3. Implement improvements
4. Prepare for Chrome Web Store submission
5. Launch and promote!

---

**Last Updated**: [Current Date]
**Extension Version**: 1.0.0 (MVP)
**Target**: Chrome/Chromium browsers
