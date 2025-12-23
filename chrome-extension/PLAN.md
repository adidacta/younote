# YouNote Chrome Extension - Design & Implementation Plan

## Overview
A Chrome extension for quick note-taking while watching YouTube videos. Notes are automatically synced to the YouNote web app with zero friction.

## Core Concept
**Simple, focused note-adding interface** - Users can quickly capture timestamped notes while watching YouTube videos. No browsing/viewing notes in the extension - that's done in the web app.

---

## Authentication (Option 3: Smart Auto-Detection)

### Flow:
1. Extension checks for active Supabase session in browser storage
2. **If logged in**: Works immediately, uses existing session
3. **If not logged in**:
   - Shows "Login to YouNote" in extension popup
   - Opens YouNote web app in new tab
   - After login, extension auto-detects session and activates

### Technical:
- Read Supabase auth token from browser localStorage/cookies
- Store token in extension local storage for quick access
- Refresh token when needed
- Clear on logout

---

## Extension Popup (when icon clicked)

```
┌──────────────────────────┐
│ Hey, [User Nickname]!    │
│                          │
│ [Open YouNote →]         │
│                          │
│ [Logout]                 │
└──────────────────────────┘
```

**When not logged in:**
```
┌──────────────────────────┐
│ YouNote Extension        │
│                          │
│ [Login to YouNote →]     │
└──────────────────────────┘
```

---

## UI Placement on YouTube

### Placement Strategy (Context-Aware):
- **Default layout**: Below video, above description
- **Theater mode** (clips visible): Above clips/suggestions (pushes them down)

### Responsive Behavior:
- Adapts to YouTube's layout changes
- Always non-intrusive
- Respects YouTube's native UI

---

## Note Interface States

### **1. Collapsed State (Title Bar Only)**
```
[📝 New Note ▼]
```
- Minimal space usage
- Click to expand

### **2. Expanded State (Default)**
```
┌──────────────────────────────────┐
│ 📝 New Note ▲                    │
├──────────────────────────────────┤
│ [Markdown textarea]              │
│                                  │
│                                  │
│ 🕐 Timestamp: 1:23               │
│ (auto-captured on first char)   │
├──────────────────────────────────┤
│ [Save Note] (disabled if empty) │
└──────────────────────────────────┘
```

**Behavior:**
- Starts expanded by default
- Markdown textarea (supports basic markdown)
- Timestamp auto-captured when user starts typing (first character)
- Save button disabled when textarea is empty

### **3. Saving State**
```
┌──────────────────────────────────┐
│ 📝 New Note ▲                    │
├──────────────────────────────────┤
│ Saving to your Extension         │
│ Notebook...                      │
│                                  │
│ [🔄 Saving...]                   │
└──────────────────────────────────┘
```

### **4. Success State**
```
✨ (brief flash animation on interface)
→ Immediately resets to empty "New Note" state
→ User can add next note right away
```

### **5. Error State**
```
┌──────────────────────────────────┐
│ 📝 New Note ▲                    │
├──────────────────────────────────┤
│ [Previously typed content        │
│  preserved here]                 │
│                                  │
│ ❌ Failed to save note           │
│ [Retry]                          │
└──────────────────────────────────┘
```
- Content preserved
- Inline error message
- Retry button
- User doesn't lose their work

---

## Notebook & Page Management

### Notebook: "Browser Extension Notes"
- **Name**: "Browser Extension Notes" (user can rename later)
- **Storage**: Store notebook **ID** (not name) in extension local storage
- **Creation**: Auto-create on first note save if doesn't exist
- **Rename-proof**: Always uses ID, so renaming notebook doesn't break extension

### Page Auto-Creation Logic:
1. Check if page exists for current video (by `youtube_video_id`)
2. **If exists**: Add note to that page
3. **If new video**:
   - Create new page in "Browser Extension Notes" notebook
   - Add note to new page

### First Note Flow:
1. User saves first note
2. Extension checks: Does "Browser Extension Notes" notebook exist?
   - Search user's notebooks by title
   - **If found**: Store notebook ID in extension storage
   - **If not found**: Create notebook, store ID
3. Check if page exists for current video
   - **If found**: Use that page
   - **If not found**: Create page with video metadata
4. Create note with timestamp
5. Show success feedback

---

## Technical Architecture

### File Structure:
```
chrome-extension/
├── manifest.json           # Chrome Extension Manifest V3
├── background.js           # Service worker (API calls, auth)
├── content.js              # Injected into youtube.com pages
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── styles/
│   └── youtube.css        # Styles for injected note UI
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── PLAN.md                # This file
```

### Key Components:

#### 1. **manifest.json**
- Manifest V3
- Permissions: `storage`, `activeTab`, `scripting`
- Host permissions: `*://www.youtube.com/*`, `*://youtu.be/*`
- Content scripts: Inject into youtube.com

#### 2. **background.js** (Service Worker)
- Handle API communication with YouNote backend
- Manage authentication state
- Store/retrieve Supabase session
- Create notebooks/pages/notes
- Handle errors and retries

#### 3. **content.js** (Content Script)
- Detect YouTube video pages
- Inject note-taking UI into page
- Capture video timestamp
- Detect YouTube layout changes (theater mode, etc.)
- Send messages to background script for API calls

#### 4. **popup.html/js** (Extension Popup)
- Show login status
- Display user nickname
- "Open YouNote" button (opens web app in new tab)
- Logout button
- Handle login flow

---

## API Integration

### Endpoints Used:
All existing YouNote API endpoints - no new endpoints needed!

1. **Authentication**: Use existing Supabase auth
2. **Get User Data**: `GET /api/user` (to get nickname)
3. **Get/Create Notebook**:
   - Search: `GET /api/notebooks`
   - Create: `POST /api/notebooks`
4. **Get/Create Page**:
   - Search: `GET /api/pages?youtube_video_id={videoId}`
   - Create: `POST /api/pages`
5. **Create Note**: `POST /api/notes`

### Authentication Token:
- Read from browser storage (Supabase session)
- Include in API requests: `Authorization: Bearer {token}`
- Refresh when expired

---

## User Flow Examples

### **First-Time User**
1. Install extension
2. Go to YouTube video
3. See "Login to YouNote" message in note interface
4. Click extension icon → "Login to YouNote" button
5. Opens web app in new tab → User logs in
6. Extension detects session → Ready to use!

### **Returning User (Already Logged In)**
1. Go to YouTube video
2. Note interface appears immediately (expanded)
3. Start typing → Timestamp captured
4. Click "Save" → Note saved to YouNote
5. Success animation → Interface resets
6. Add another note immediately if desired

### **Adding Multiple Notes**
1. Watch video, type first note → Save
2. Interface resets → Type second note → Save
3. Interface resets → Type third note → Save
4. All notes saved to same page with different timestamps

---

## Error Handling

### Network Errors:
- Show inline error: "Failed to save note"
- Keep note content
- Offer "Retry" button
- Don't lose user's work

### Authentication Errors:
- Token expired → Prompt to refresh/login
- Not logged in → Show login button

### API Errors:
- Rate limiting → Show "Please try again in a moment"
- Server error → Show "Server error, please retry"

---

## Future Enhancements (Out of Scope for MVP)

- ❌ View existing notes in extension
- ❌ Edit notes in extension
- ❌ Offline support with sync
- ❌ Rich text editor
- ❌ Keyboard shortcuts for formatting
- ❌ Note templates
- ❌ Multiple notebook support
- ❌ Search notes in extension

---

## Success Metrics

### MVP Success Criteria:
1. ✅ User can login via extension
2. ✅ Note interface appears on YouTube videos
3. ✅ Timestamp auto-captures on first character
4. ✅ Notes save to YouNote successfully
5. ✅ "Browser Extension Notes" notebook auto-creates
6. ✅ Pages auto-create for new videos
7. ✅ Error handling preserves user content
8. ✅ Interface resets after successful save

### Performance Goals:
- Note save latency: < 1 second
- UI injection: < 100ms
- No impact on YouTube video playback
- Extension size: < 1MB

---

## Development Phases

### Phase 1: Core Infrastructure ✅
- [x] Manifest.json setup
- [x] Authentication flow
- [x] Basic UI injection

### Phase 2: Note Creation
- [ ] UI implementation
- [ ] Timestamp capture
- [ ] API integration
- [ ] Success/error states

### Phase 3: Notebook Management
- [ ] Auto-create notebook
- [ ] Store notebook ID
- [ ] Page auto-creation

### Phase 4: Polish & Testing
- [ ] Error handling
- [ ] Loading states
- [ ] Animations
- [ ] Cross-browser testing
- [ ] Publish to Chrome Web Store

---

## Testing Checklist

### Authentication:
- [ ] New user can login successfully
- [ ] Existing session detected automatically
- [ ] Logout works correctly
- [ ] Token refresh works

### Note Creation:
- [ ] Timestamp captured on first character
- [ ] Save button disabled when empty
- [ ] Note saves successfully
- [ ] Interface resets after save
- [ ] Multiple notes can be added in sequence

### Notebook/Page Management:
- [ ] Notebook auto-creates on first use
- [ ] Notebook ID stored correctly
- [ ] Page creates for new videos
- [ ] Existing pages detected correctly
- [ ] Works after notebook rename

### Error Handling:
- [ ] Network error preserves content
- [ ] Retry button works
- [ ] Auth error shows login prompt
- [ ] Server error handled gracefully

### UI/UX:
- [ ] Placement adapts to YouTube layout
- [ ] Expand/collapse works smoothly
- [ ] Success animation shows
- [ ] Loading state displays
- [ ] No conflicts with YouTube UI

---

## Security Considerations

1. **Token Storage**: Store auth tokens securely in extension storage
2. **API Communication**: Always use HTTPS
3. **Permissions**: Request minimal permissions needed
4. **Data Privacy**: Never store notes locally (only in YouNote backend)
5. **XSS Protection**: Sanitize all user input before rendering
6. **CSP**: Follow Content Security Policy best practices

---

## Browser Compatibility

**Target**: Chrome/Chromium browsers
- Chrome (primary)
- Edge (Chromium-based)
- Brave
- Opera

**Not supported** (for MVP):
- Firefox (different extension API)
- Safari (different extension API)

---

## Deployment

### Chrome Web Store:
1. Create developer account
2. Package extension (.zip)
3. Submit for review
4. Publish (usually takes 1-3 days)

### Update Process:
1. Increment version in manifest.json
2. Package and upload new version
3. Users auto-update within 24 hours
