# YouNote - Open Tasks

This file tracks open tasks, bugs, and feature requests for the YouNote project.

## Status Key
- 🔴 **Not Started** - Task has not been started
- 🟡 **In Progress** - Currently being worked on
- 🟢 **Completed** - Task is finished
- 🔵 **Needs Discussion** - Requires brainstorming or decision-making

---

## Current Tasks

### 27. Quick Add Page from /notebooks 🔵
**Priority**: Medium
**Type**: Feature - Needs Discussion

**Objective**:
Add a "Quick Add" feature that allows users to quickly add a new page directly from the /notebooks view without having to first select or create a notebook.

**Current Flow**:
1. User goes to /notebooks
2. Clicks on a notebook
3. Clicks "New Page" button
4. Enters YouTube URL

**Proposed Flow**:
1. User goes to /notebooks
2. Clicks "Quick Add" (UI/UX TBD)
3. Enters YouTube URL
4. Optionally selects which notebook to add to (or creates new notebook)
5. Page is created

**UI/UX Questions to Resolve**:
1. **Placement**: Where should Quick Add button/feature appear?
   - Floating action button (FAB)?
   - Button in navbar/header?
   - Keyboard shortcut (e.g., Cmd+K)?
   - Command palette command?
   - All of the above?

2. **User Flow**: What should the quick add dialog/modal include?
   - YouTube URL input (required)
   - Notebook selector dropdown (with "Create new notebook" option)
   - Should it default to most recently used notebook?
   - Auto-create page immediately or show preview first?

3. **Notebook Selection**:
   - Required or optional?
   - If optional, where does page go? (create default "Quick Notes" notebook?)
   - Should we show notebook thumbnails/icons in selector?

4. **Visual Design**:
   - Modal dialog?
   - Slide-over panel?
   - Inline form?
   - Full page?

**Technical Considerations**:
- Reuse existing page creation logic from `CreatePageDialog`
- May need to extend CreatePageDialog to accept notebook preselection
- Consider adding to command palette as well
- Mobile vs desktop UX differences

**Files to Create/Modify**:
- New `QuickAddPageDialog` component (or extend existing CreatePageDialog)
- `/app/(authenticated)/notebooks/page.tsx` - Add Quick Add trigger
- Command palette integration (optional)

**Next Steps**:
- Decide on UI/UX approach
- Design mockups
- Determine if this should be desktop-only or mobile-friendly
- Consider keyboard shortcut implementation

---

### 26. Add "Buy Me a Coffee" Support Button 🔴
**Priority**: Low
**Type**: Feature - Monetization

**Objective**:
Add a "Buy Me a Coffee" button to allow users to support the project with optional donations.

**Placement Options**:
1. Footer - subtle link in footer alongside other links
2. Settings page - dedicated "Support" section
3. Navbar - small coffee icon (desktop only)
4. About/FAQ section - "Love YouNote? Buy me a coffee"

**Technical Implementation**:
- Sign up for Buy Me a Coffee account (https://buymeacoffee.com)
- Get embed widget or button code
- Choose placement strategy
- Style to match YouNote design system
- Optional: Add supporter badge/thank you message

**Questions Before Implementation**:
1. Where should the button be placed? (Footer recommended for subtlety)
2. Button style: Icon only, text + icon, or widget?
3. Should it open in new tab or embedded widget?
4. Show coffee icon persistently or only in certain sections?
5. Add "Supporters" page to showcase donors? (optional)

**Files to Create/Modify**:
- Footer component (if adding to footer)
- Settings page (if adding support section)
- New "Support" page (optional)

---

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

### 21. Improve Chrome Extension Authentication 🔴
**Priority**: High
**Type**: Feature - Chrome Extension Enhancement

**Objective**:
Streamline the Chrome extension authentication flow to eliminate the need for users to manually click "connect extension" button.

**Current Issue**:
- Users must manually click "connect extension" after installing the extension
- Extra friction in onboarding process
- Not intuitive for non-technical users

**Proposed Solution**:
- Implement automatic authentication detection when extension is installed
- Use Chrome's `chrome.identity` API for seamless OAuth flow
- Store auth tokens securely in extension storage
- Auto-sync with web app session when both are open

**Technical Approaches**:
1. **Chrome Identity API**: Use `chrome.identity.getAuthToken()` for Google OAuth
2. **WebSocket Connection**: Establish persistent connection between extension and web app
3. **Shared Session**: Use service worker to sync auth state automatically
4. **Deep Link**: Open web app in new tab to complete OAuth, then close automatically

**Files to Modify**:
- `extension/background.js` - Auto-detect and handle authentication
- `extension/manifest.json` - Add identity permissions
- Web app OAuth callback to handle extension authentication
- Extension popup UI to remove manual "connect" button

**Questions Before Implementation**:
1. Which authentication approach is most seamless?
2. Should we keep manual connect as a fallback option?
3. How to handle token refresh in the extension?
4. Security considerations for storing tokens in extension?

---

### 22. Integrate Transactional Email Provider 🔴
**Priority**: Medium
**Type**: Feature - Email Integration

**Objective**:
Connect with a transactional email service to send automated emails (password reset, notifications, sharing, etc.).

**Use Cases**:
- Password reset emails
- Email verification
- Share notifications ("Someone shared a note with you")
- Weekly digest emails (optional)
- Account activity notifications
- Welcome emails for new users

**Email Provider Options**:
1. **Resend** (Recommended)
   - Pros: Developer-friendly, great API, affordable, React email templates
   - Cons: Newer service
   - Pricing: Free tier (3,000 emails/month)

2. **SendGrid**
   - Pros: Established, reliable, good free tier
   - Cons: Complex API, older UI
   - Pricing: Free tier (100 emails/day)

3. **Postmark**
   - Pros: Great deliverability, simple API
   - Cons: More expensive
   - Pricing: 100 free emails/month trial

4. **AWS SES**
   - Pros: Cheap, scalable
   - Cons: More setup, requires AWS infrastructure
   - Pricing: $0.10 per 1,000 emails

**Technical Requirements**:
- Set up email provider account
- Configure DNS records (SPF, DKIM, DMARC)
- Create email templates
- Build email sending utility functions
- Add email sending to relevant API endpoints
- Handle bounces and complaints

**Files to Create/Modify**:
- `lib/email/client.ts` - Email provider client setup
- `lib/email/templates/` - Email template components
- `app/api/auth/reset-password/route.ts` - Send reset emails
- Environment variables for email API keys

**Questions Before Implementation**:
1. Which email provider do you prefer?
2. Which emails should we send immediately vs. later?
3. Email template design - plain text, HTML, or React Email?
4. Sender email address (e.g., noreply@younote.com)?
5. Domain for sending emails - need to set up?
6. Should we include unsubscribe options for non-critical emails?

---

### 24. Publish Chrome Extension to Chrome Web Store 🔴
**Priority**: High
**Type**: Deployment - Chrome Extension

**Objective**:
Publish the Chrome extension to the Chrome Web Store and add installation instructions in the web app.

**Prerequisites**:
- Complete Chrome extension development (Task #20)
- Improve authentication flow (Task #21)
- Test extension thoroughly across platforms
- Create extension icons (16x16, 48x48, 128x128)
- Write extension description and screenshots

**Chrome Web Store Submission Requirements**:
- Developer account ($5 one-time fee)
- Extension icons in all required sizes
- Promotional images:
  - Small tile: 440x280
  - Marquee: 1400x560
  - Screenshots: 1280x800 or 640x400
- Privacy policy URL (already have this)
- Detailed description
- Category selection
- Version number and changelog

**In-App Installation Instructions**:
- Create dedicated page: `/extension` or section in `/settings`
- Step-by-step installation guide with screenshots
- Chrome Web Store link with "Add to Chrome" button
- Video demo of extension in action (optional)
- FAQ section for common issues
- Link from navbar or settings menu

**Promotional Materials Needed**:
- 3-5 screenshots of extension in action
- Short description (132 chars max for Web Store)
- Detailed description (explaining features)
- Extension demo video (optional but recommended)

**Files to Create**:
- `app/extension/page.tsx` - Installation guide page
- Extension promotional images
- Chrome Web Store listing copy
- Update navbar/footer with extension link

**Post-Publication**:
- Monitor reviews and ratings
- Respond to user feedback
- Track installation analytics
- Plan update schedule

**Questions Before Implementation**:
1. Extension name: "YouNote" or "YouNote - YouTube Notes"?
2. Target categories for Web Store?
3. Should we create a video demo? (YouTube video)
4. Beta testing before public release?
5. Versioning strategy (semantic versioning)?

---

### 25. Google OAuth App Verification 🔴
**Priority**: High
**Type**: Compliance - OAuth Verification

**Objective**:
Get the app verified by Google for OAuth authentication to remove "unverified app" warning and enable all users to sign in with Google.

**Current Issue**:
- App shows "Google hasn't verified this app" warning
- Can scare users away from signing in
- Limited to test users until verified
- Affects trust and conversion rates

**Google Verification Requirements**:
1. **Domain Verification**:
   - Verify ownership of younote.com (or deployed domain)
   - Add DNS TXT record or upload verification file

2. **OAuth Consent Screen**:
   - Complete all required fields
   - Add app logo (120x120 minimum)
   - Privacy Policy URL ✅ (already have)
   - Terms of Service URL ✅ (already have)
   - Authorized domains list
   - Support email address

3. **Scopes Justification**:
   - Explain why each OAuth scope is needed
   - Current scopes: email, profile
   - Prepare written explanation for each

4. **App Homepage**:
   - Must be publicly accessible
   - Show clear description of app
   - Link to privacy policy and terms

5. **Demonstration Video**:
   - YouTube video showing OAuth flow
   - Demonstrate how user data is used
   - Show consent screen in action

**Verification Process**:
1. Submit verification request in Google Cloud Console
2. Wait for Google review (can take 3-6 weeks)
3. Respond to any questions from Google reviewers
4. Fix any issues and resubmit if needed

**Files to Create/Modify**:
- OAuth consent screen in Google Cloud Console
- Verification documentation
- Demo video for Google reviewers
- App logo for OAuth screen

**Questions Before Implementation**:
1. Domain to use for verification (younote.com vs younote-two.vercel.app)?
2. Support email address for OAuth screen?
3. App logo ready? (120x120 px minimum)
4. Should we start verification now or wait until extension is ready?
5. Do we need additional OAuth scopes in the future?

**Important Notes**:
- Process can take 3-6 weeks
- Must maintain compliance after verification
- Need to update if scopes or app purpose changes
- Worth doing early to avoid delays in user onboarding

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

### 23. Social Media Sharing Metadata (Open Graph & Twitter Cards) 🟢
**Completed**: 2025-12-26
**Type**: Feature - SEO & Sharing

Implemented Open Graph and Twitter Card metadata for beautiful social media link previews:
- Created metadata extraction utilities (`lib/metadata/extract-metadata.ts`)
- Extracts note titles from markdown (first H1/H2 or first line)
- Generates 160-character descriptions from note content
- Uses YouTube video thumbnails as OG images
- Added `generateMetadata()` to both share page routes
- Shared notes now display with rich previews on WhatsApp, Facebook, Twitter, LinkedIn, Slack, etc.

### UI/UX Improvements (December 26, 2025) 🟢
**Completed**: 2025-12-26
**Type**: Enhancement - User Experience

Multiple UI/UX improvements to notes and sharing:

**Timestamp Play Icons**:
- Added black play icon to the right of all note timestamps
- Icon becomes primary color on hover for clear clickability
- Applied to both demo and real notes

**Hebrew Font Support**:
- Integrated Noto Sans Hebrew Regular for better Hebrew text rendering
- Applied to all note editing textareas (note-item, new-note-card, demo-note-editor)
- Replaces thin, hard-to-read font-mono for Hebrew characters

**Action Bar Visibility**:
- Action bar now stays visible when emoji picker is open
- Prevents confusing disappearance when selecting emojis
- Added state tracking for dropdown open/closed state

**Share Button Feedback**:
- Instant "Copying link..." toast on share button click
- Uses toast.promise() for smooth loading → success → error states
- Eliminates delay concern - users get immediate feedback

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
