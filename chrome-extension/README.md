# YouNote Chrome Extension

Take timestamped notes while watching YouTube videos. Automatically syncs to YouNote.

## 🚀 Quick Start

### Installation (Development Mode)

1. **Clone the repository** and navigate to the extension folder:
   ```bash
   cd chrome-extension
   ```

2. **Add extension icons** (required before loading):
   - Place icon files in the `icons/` folder:
     - `icon16.png` (16x16px)
     - `icon48.png` (48x48px)
     - `icon128.png` (128x128px)
   - You can use any PNG images, but they should represent the YouNote brand

3. **Load extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder
   - Extension should now appear in your extensions list

4. **Test the extension**:
   - Go to any YouTube video
   - Look for the YouNote note-taking interface below the video
   - Click the extension icon to login/view status

### Configuration

Before using the extension, update the API URL in these files:

1. **popup/popup.js**:
   ```javascript
   const YOUNOTE_URL = 'http://localhost:3000'; // Change to your production URL
   ```

2. **background.js**:
   ```javascript
   const YOUNOTE_API_URL = 'http://localhost:3000/api'; // Change to your production URL
   ```

For production deployment:
- Development: `http://localhost:3000`
- Production: `https://younote.vercel.app` (or your production domain)

## 📁 File Structure

```
chrome-extension/
├── manifest.json           # Extension configuration
├── background.js           # Background service worker (API calls)
├── content.js              # Content script (injected into YouTube)
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── styles/
│   └── youtube.css        # Styles for note UI on YouTube
├── icons/
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
├── PLAN.md                # Detailed design document
└── README.md              # This file
```

## 🔧 Development

### Prerequisites

- Chrome browser (or Chromium-based browser)
- YouNote backend running (locally or deployed)
- Basic knowledge of Chrome Extension APIs

### Testing Workflow

1. Make changes to extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the YouNote extension card
4. Test on YouTube video pages

### Debugging

- **Content Script**: Open DevTools on YouTube page → Console tab
- **Background Script**: Go to `chrome://extensions/` → Click "Service Worker" link under extension
- **Popup**: Right-click extension icon → "Inspect popup"

### Common Issues

**Extension not loading:**
- Check that all required files exist
- Verify `manifest.json` is valid JSON
- Ensure icon files are present in `icons/` folder

**Note UI not appearing:**
- Check browser console for errors
- Verify you're on a YouTube video page (`/watch` or `/live`)
- Try refreshing the extension and reloading the page

**Authentication not working:**
- Verify API URL is correct in `background.js` and `popup.js`
- Check that YouNote backend is running
- Open background service worker console to see API errors

## 🎯 Features

### Current Features (MVP)

- ✅ Auto-detect YouTube videos
- ✅ Inject note-taking interface
- ✅ Capture video timestamp on first character typed
- ✅ Save notes to YouNote backend
- ✅ Auto-create "Browser Extension Notes" notebook
- ✅ Auto-create pages for new videos
- ✅ Success/error feedback
- ✅ Expand/collapse note interface
- ✅ Dark mode support

### Future Features

- [ ] Keyboard shortcuts (e.g., Ctrl+Shift+N to open note)
- [ ] Rich text editor with markdown preview
- [ ] Offline support with sync
- [ ] Note templates
- [ ] View existing notes for current video
- [ ] Firefox and Safari support

## 📚 API Requirements

The extension uses these YouNote API endpoints:

- `GET /api/user` - Get user info (nickname)
- `GET /api/notebooks` - List notebooks
- `POST /api/notebooks` - Create notebook
- `GET /api/pages?youtube_video_id={videoId}` - Find page by video
- `POST /api/pages` - Create new page
- `POST /api/notes` - Create note

All endpoints require authentication via `Authorization: Bearer {token}` header.

## 🔐 Authentication Flow

1. Extension checks for stored auth token
2. If not found, user clicks "Login to YouNote"
3. Opens YouNote web app in new tab
4. User logs in to web app
5. Extension detects session and stores token
6. User can now create notes

**Note**: Currently requires manual token storage. Future versions will auto-detect Supabase session from browser.

## 🚀 Deployment to Chrome Web Store

When ready to publish:

1. **Create icons** (if not done):
   - 16x16, 48x48, 128x128 PNG files
   - Place in `icons/` folder

2. **Update URLs** for production:
   - Change `YOUNOTE_URL` in `popup.js`
   - Change `YOUNOTE_API_URL` in `background.js`

3. **Update manifest** version:
   ```json
   "version": "1.0.0"
   ```

4. **Create ZIP file**:
   ```bash
   cd chrome-extension
   zip -r younote-extension.zip . -x ".*" -x "PLAN.md" -x "README.md"
   ```

5. **Publish to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay $5 one-time developer fee (if first extension)
   - Upload ZIP file
   - Fill in store listing details
   - Submit for review (usually 1-3 days)

## 📝 Development Notes

### Adding New Features

1. Update `PLAN.md` with feature description
2. Implement feature in appropriate file:
   - UI changes → `content.js` + `styles/youtube.css`
   - API calls → `background.js`
   - Popup changes → `popup/` files
3. Update `manifest.json` if new permissions needed
4. Test thoroughly on YouTube
5. Update version number

### Code Style

- Use semicolons
- Use `async/await` for promises
- Add comments for complex logic
- Keep functions focused and small
- Handle all error cases

### Performance Considerations

- Minimize DOM manipulation
- Use event delegation where possible
- Lazy load resources
- Debounce frequent operations
- Keep extension size small

## 🐛 Troubleshooting

### "Failed to create notebook"

- Check API URL configuration
- Verify YouNote backend is running
- Check background script console for API errors
- Ensure user is authenticated

### "Timestamp not capturing"

- Verify YouTube video player is loaded
- Check that video element exists: `document.querySelector('video')`
- Try refreshing the page

### "UI not injecting"

- Check that you're on `/watch` or `/live` URL
- Verify content script is loading (check DevTools Sources tab)
- Try disabling and re-enabling extension

## 📞 Support

For issues or questions:
- Check `PLAN.md` for design details
- Review YouNote web app documentation
- Check Chrome Extension API docs: https://developer.chrome.com/docs/extensions/

## 📄 License

Same license as YouNote main project.
