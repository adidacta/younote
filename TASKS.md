# YouNote - Open Tasks

This file tracks open tasks, bugs, and feature requests for the YouNote project.

## Status Key
- 🔴 **Not Started** - Task has not been started
- 🟡 **In Progress** - Currently being worked on
- 🟢 **Completed** - Task is finished
- 🔵 **Needs Discussion** - Requires brainstorming or decision-making

---

## Current Tasks

### 20. Chrome Extension for YouTube.com Note-Taking 🔴
**Priority**: High
**Type**: Feature - Browser Extension

**Objective**:
Create a Chrome extension that allows users to take notes directly while watching videos on YouTube.com, seamlessly integrating with the YouNote web app.

**Core Features**:
- Inject note-taking UI into YouTube.com video pages
- Capture current video timestamp when creating notes
- Auto-detect YouTube video ID and metadata
- Sync notes to YouNote account in real-time
- Quick access to existing notes for the current video
- Option to create new page/notebook or add to existing

**Technical Requirements**:
- Chrome Extension Manifest V3
- Content script injection on youtube.com
- Background service worker for API communication
- Authentication with YouNote backend (OAuth or API key)
- Real-time sync with Supabase database
- Minimal performance impact on YouTube

**UI/UX Considerations**:
- Non-intrusive overlay or sidebar on YouTube video page
- Keyboard shortcut to quickly capture notes (e.g., Ctrl+Shift+N)
- Visual indicator when notes exist for current video
- Toggle to show/hide extension interface
- Responsive to YouTube's theater mode and fullscreen

**Implementation Questions**:
1. UI placement: Sidebar, overlay, or below video player?
2. Authentication method: OAuth flow or API key?
3. Should extension work offline with local storage sync?
4. Should it support YouTube playlist note-taking?
5. Integration with existing notebooks - auto-create or prompt user?
6. Should we support other video platforms (Vimeo, etc.)?

**Files to Create**:
- `extension/manifest.json` - Extension configuration
- `extension/content.js` - Content script for YouTube pages
- `extension/background.js` - Background service worker
- `extension/popup.html` - Extension popup UI
- `extension/options.html` - Extension settings page
- API authentication endpoints for extension

---

### 4. In-App Rating System 🔴
**Priority**: Medium
**Type**: Feature

**Requirements**:

**Rating Widget (Below New Note Section)**:
- Only appears after user has created 3 notes
- 1-5 star rating interface
- Once user submits rating, widget is permanently dismissed for that user
- Should be unobtrusive but noticeable

**Home Page Rating Display**:
- Show average rating (e.g., "4.2 ⭐")
- Show total number of ratings (e.g., "based on 127 ratings")
- Should be an elegant widget similar to stats widgets

**Database Requirements**:
- New table: `ratings`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `rating` (integer, 1-5)
  - `created_at` (timestamp)
  - Unique constraint on `user_id` (one rating per user)

**Technical Details**:
- Track user's note count to determine when to show rating widget
- Store dismissed state in user preferences (could use localStorage + database)
- API endpoint: `/api/ratings` (POST to submit, GET for stats)

**Files to Create/Modify**:
- Rating widget component (shown after 3 notes)
- Rating display component (home page)
- API route: `/app/api/ratings/route.ts`
- Database migration for `ratings` table
- Database functions in `/lib/database/ratings.ts`

**Questions Before Implementation**:
1. Should the widget appear on every page after 3 notes, or only on specific pages?
2. Dismissal behavior - should it:
   - Disappear immediately after rating?
   - Show a thank you message first?
   - Have a "remind me later" option?
3. What if user clicks "X" to dismiss without rating - show again later or never?
4. Should users be able to change their rating later?
5. Should we track when the rating was given (for analytics)?
6. Any minimum usage requirement before showing? (e.g., account must be X days old?)
7. Where should the average rating display go on the home page?
8. If no ratings exist yet, what should we show?

---

### 5. Feature Requests & Bug Reports System 🔵
**Priority**: Medium
**Type**: Feature - Needs Brainstorming

**Objective**:
Implement a system to collect feature requests and bug reports from users within the app.

**Questions to Consider**:
- **UI/UX**: Where should users access this? (e.g., feedback button in navbar, command palette, dedicated page)
- **Form Fields**: What information to collect?
  - Title
  - Description
  - Type (feature request vs bug report)
  - Priority/severity?
  - Screenshots/attachments?
  - Affected page/component?
- **Storage**: Database table vs external service (e.g., GitHub Issues, Canny, etc.)?
- **Notifications**: How to notify admin of new submissions?
- **User Feedback**: Should users see status updates on their submissions?
- **Voting**: Should users be able to upvote feature requests?

**Possible Approaches**:
1. **In-App Database**:
   - Create `feedback` table
   - Build admin dashboard to view/manage submissions
   - Pros: Full control, integrated with app
   - Cons: More development effort

2. **External Service Integration**:
   - Integrate with GitHub Issues, Linear, Canny, etc.
   - Pros: Less development, proven solutions
   - Cons: Additional cost, less customization

3. **Hybrid**:
   - Collect in database
   - Sync to external tool via webhook/API

**Next Steps**:
- Decide on approach
- Design user interface mockups
- Plan database schema (if in-app)
- Estimate development effort

**Questions Before Implementation**:
1. Which approach do you prefer:
   - **In-app database** (full control, more dev work)?
   - **External service** (if so, which? GitHub Issues, Canny, Tally forms)?
   - **Hybrid** (collect in DB, sync to external)?
2. For UI/UX:
   - Where should users access this? (dedicated page, navbar button, command palette command?)
   - Should feedback be anonymous or always linked to user account?
3. What fields should we collect:
   - Title (required?)
   - Description (required?)
   - Type: Feature Request vs Bug Report (required?)
   - Category/tags?
   - Screenshot upload?
   - Email for follow-up (if not logged in)?
4. Admin notifications:
   - Email notification for each submission?
   - Daily digest?
   - In-app admin panel?
5. Should users be able to:
   - See their submission history?
   - See status updates (e.g., "in progress", "completed")?
   - Upvote other requests?

---



### 14. Remove Next.js FAB (Network Warning) 🔴
**Priority**: Low
**Type**: Bug Fix

**Issue**:
- Next.js FAB (floating action button) appearing in development
- Likely the Next.js development overlay or inspector
- May be showing network warnings or other dev tools

**Requirements**:
- Identify source of Next.js FAB
- Disable or hide it in development mode
- Ensure it doesn't appear in production

**Files to Check**:
- `next.config.ts` - check for devIndicators settings
- May need to disable via config: `devIndicators: { buildActivityPosition: 'bottom-right' }`

**Questions Before Implementation**:
1. Is this the Next.js build activity indicator?
2. Or is it a different development overlay?
3. Should we hide it completely or just reposition it?

---

### 17. Add Google Analytics and Session Recording 🔴
**Priority**: Medium
**Type**: Feature - Analytics

**Requirements**:
- Integrate Google Analytics (GA4)
- Add session recording tool (e.g., Hotjar, LogRocket, FullStory)
- Track key user events and page views
- Privacy-compliant implementation

**Google Analytics Setup**:
- Create GA4 property
- Add GA tracking script to app
- Set up custom events:
  - Notebook created
  - Page created
  - Note created
  - Video played
  - Share link generated
- Configure user privacy settings

**Session Recording Setup**:
- Choose tool: Hotjar, LogRocket, Microsoft Clarity, or FullStory
- Install tracking script
- Configure privacy settings (mask sensitive data)
- Set up recording filters (e.g., only record authenticated users)

**Privacy Considerations**:
- Cookie consent banner (required for GDPR)
- Respect Do Not Track (DNT) browser setting
- Anonymize IP addresses
- Allow users to opt-out
- Document in Privacy Policy

**Files to Create/Modify**:
- Add GA script to `app/layout.tsx`
- Create analytics utility functions (`lib/analytics.ts`)
- Event tracking throughout app
- Cookie consent component
- Update Privacy Policy

**Questions Before Implementation**:
1. Google Analytics account set up? (need Measurement ID)
2. Preferred session recording tool?
   - **Hotjar** (heatmaps + recordings)
   - **Microsoft Clarity** (free, good recordings)
   - **LogRocket** (dev-focused, error tracking)
   - **FullStory** (comprehensive but expensive)
3. Which events to track? (beyond the basics listed above)
4. Cookie consent approach:
   - Banner at bottom?
   - Modal on first visit?
   - Opt-in or opt-out?
5. Should analytics be disabled for development?
6. Do you need e-commerce tracking (future monetization)?

---


## Completed Tasks

### 1. Fix Breadcrumb Animation 🟢
**Completed**: 2025-12-22
**Type**: Bug Fix

Fixed breadcrumb animation issues including speed, selective animation, and layout shifts.

### 2. Content Width Inconsistency 🟢
**Completed**: 2025-12-22
**Type**: Bug Fix

Resolved content width differences between pages and breadcrumb shifting issues.

### 3. Home Page Statistics Widgets 🟢
**Completed**: 2025-12-22
**Type**: Feature

Created elegant stats widgets with count-up animations showing total and 24h counts for notebooks, pages, and notes.

### 6. Fix Mobile Navigation Bar 🟢
**Completed**: 2025-12-22
**Type**: Bug Fix

Fixed overlapping elements in mobile navigation bar.

### 13. Fetch YouTube Transcripts 🟢
**Completed**: 2025-12-22
**Type**: Feature

Implemented YouTube transcript fetching using `youtube-transcript` package with clickable timestamps.

### 16. Add Terms of Use and Privacy Policy 🟢
**Completed**: 2025-12-22
**Type**: Feature - Compliance

Created comprehensive Terms of Use and Privacy Policy pages with GDPR/CCPA compliance. Added required checkbox to sign-up form with links to legal pages.

### 18. Implement Onboarding Notebook 🟢
**Completed**: 2025-12-22
**Type**: Feature - Onboarding

Implemented hybrid onboarding approach with auto-created tutorial notebook for new users.

### 7. Add Nickname to User Registration 🟢
**Completed**: 2025-12-22
**Type**: Feature

Implemented user nickname system with required field during registration. Created user_profiles table with validation (3-20 chars, alphanumeric only). Added settings page at /settings for editing nickname. Nicknames stored in both user metadata and database.

### 12. Limit Note Height with "Show More" Expansion 🟢
**Completed**: 2025-12-22
**Type**: Enhancement

Implemented note height limiting with expand/collapse functionality:
- Notes limited to 200px height by default
- Automatically detects if content is truncated
- "Show more/Show less" button for long notes
- Smooth 300ms expand/collapse animation
- Fade gradient overlay when truncated
- Button only appears if content actually exceeds height limit

### 11. Fix Logo Aspect Ratio Warning 🟢
**Completed**: 2025-12-22
**Type**: Bug Fix

Fixed logo aspect ratio inconsistency:
- Changed authenticated layout logo dimensions from 150x30 to 120x40
- Now consistent 3:1 aspect ratio across all pages (home, auth pages, authenticated layout)
- Eliminates console warning about modified image dimensions

### 8. Personalized Breadcrumb - "[Nickname]'s Notebooks" 🟢
**Completed**: 2025-12-22
**Type**: Enhancement

Implemented personalized breadcrumbs:
- Created `getNotebooksBreadcrumb()` helper function in `lib/breadcrumb/personalize.ts`
- Fetches user nickname from user_profiles table
- Displays "[Nickname]'s Notebooks" (e.g., "Oscar's Notebooks")
- Handles possessive apostrophe correctly (e.g., "James's Notebooks")
- Falls back to "Notebooks" if no nickname is set
- Updated all three notebook pages (list, detail, page detail)

### 19. Add Notes Outline/Navigation Sidebar 🟢
**Completed**: 2025-12-22
**Type**: Feature - Navigation Enhancement

Implemented minimalistic vertical dots navigation:
- Created `NotesOutline` component with vertical dots (one dot per note)
- Active note shown as filled dot (●), inactive notes as outlined dots (○)
- Click any dot to smooth scroll to that note
- Uses Intersection Observer to automatically track and highlight visible note
- Always visible on desktop (~30px wide), hidden on mobile
- Super minimalistic design - no text, no tooltips, no collapse functionality
- Added `data-note-id` attributes to notes for scroll tracking

---

## Notes

None yet.

---

## Notes

- Tasks are sorted by creation date
- Update status emoji as work progresses
- Move completed tasks to "Completed Tasks" section with completion date
- For new tasks, use the template below:

### Template:
```markdown
### [Task Number]. [Task Title] 🔴
**Priority**: High/Medium/Low
**Type**: Feature/Bug Fix/Enhancement

**Description**:
[Clear description of the task]

**Requirements**:
- [Requirement 1]
- [Requirement 2]

**Files to Create/Modify**:
- [File paths]

**Notes**:
- [Any additional context]
```
