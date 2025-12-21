# YouNote - Open Tasks

This file tracks open tasks, bugs, and feature requests for the YouNote project.

## Status Key
- 🔴 **Not Started** - Task has not been started
- 🟡 **In Progress** - Currently being worked on
- 🟢 **Completed** - Task is finished
- 🔵 **Needs Discussion** - Requires brainstorming or decision-making

---

## Current Tasks

### 1. Fix Breadcrumb Animation 🟡
**Priority**: Medium
**Type**: Bug Fix

**Issue**:
- Animation is too slow ✅ FIXED (50% faster)
- Currently animates ALL breadcrumb items when it should only animate the last two ✅ FIXED
- Problem: When navigating back from a page to a notebook, the "Notebooks" breadcrumb also animates unnecessarily ✅ FIXED
- Character counter in editable page title causes entire breadcrumb to shift down 🔴 NEW ISSUE

**Requirements**:
- Make animation faster ✅ DONE
- Only animate the last two breadcrumb items (current and previous) ✅ DONE
- The "Notebooks" item should remain static when going back from page → notebook ✅ DONE
- Fix character counter layout so breadcrumbs don't shift vertically when editing 🔴 TODO

**Files to Check**:
- Breadcrumb component (likely in `/components/`)
- Related animation logic using Framer Motion
- `components/pages/editable-page-title.tsx` - character counter positioning

**Answered Requirements**:
1. **Speed**: Increase current speed by 50% (need to check current duration first)
2. **Animation Style**: Keep the letter-by-letter bold transition effect
3. **Animation Scenarios** (5 total):
   - **Scenario 1**: Notebooks → Notebook (forward navigation)
   - **Scenario 2**: Notebook → Notebooks (backward navigation)
   - **Scenario 3**: Notebook → Page (forward navigation)
   - **Scenario 4**: Page → Notebook (backward navigation)
   - **Scenario 5**: Page → Notebooks (backward - direct click)

   **Key Behaviors**:
   - Going back: Letters completely hide from section we're moving away from
   - All animations happen on TARGET page (see current page name when navigating back, then it disappears)
   - Example: Page → Notebook: Still see page name initially, then it quickly disappears and notebook name gets bolder (right to left)
   - "Notebooks" remains static when going Page → Notebook

4. **Direction Logic**: Keep it (forward = left→right, backward = right→left)

---

### 2. Content Width Inconsistency 🔴
**Priority**: Medium
**Type**: Bug Fix

**Issue**:
- Content section width differs between pages
- Breadcrumbs shift slightly left when navigating from notebooks/notebook → page
- Likely caused by YouTube embed taking additional space on page view

**Observable Behavior**:
- Notebooks page: content width X
- Notebook detail page: content width X
- Page (with YouTube player): content width X + offset
- Result: Visible breadcrumb shift

**Requirements**:
- Ensure consistent content width across all pages
- Breadcrumbs should not shift position during navigation
- YouTube embed should not affect overall layout width

**Files to Check**:
- Layout components for authenticated routes
- Page component with YouTube player
- CSS/Tailwind classes for content containers

**Questions Before Implementation**:
1. Should the YouTube player width match the notebooks/notebook content width, or should content expand to match the player?
2. What's your preferred max-width for consistency across all pages?
3. Should the layout be:
   - Single column (video above notes)?
   - Side-by-side on larger screens?
   - Something else?

---

### 3. Home Page Statistics Widgets 🔴
**Priority**: High
**Type**: Feature

**Requirements**:
- Display elegant stat widgets on home page showing:
  1. Total notebooks count
  2. Total pages count
  3. Total notes count
  4. New notebooks created in past 24 hours
  5. New pages created in past 24 hours
  6. New notes created in past 24 hours

**Design Requirements**:
- Elegant, modern widget design
- Count-up animation when page loads (numbers animate from 0 to actual value)
- Should fit well with existing dark/light theme

**Technical Requirements**:
- Query Supabase for counts (total and 24h filtered by `created_at`)
- Implement count-up animation (consider using a library like `react-countup` or custom implementation)
- Ensure performant queries with proper indexing

**Files to Create/Modify**:
- Home page component (likely `/app/(authenticated)/page.tsx` or similar)
- New API endpoint for stats: `/api/stats`
- Stats widget component

**Questions Before Implementation**:
1. Where exactly on the home page should these widgets appear? (top, below hero, in a grid?)
2. Layout preference:
   - 3 columns (notebooks | pages | notes)?
   - 2 rows x 3 columns?
   - Cards or inline stats?
3. For the "past 24 hours" counts - should they be:
   - Displayed as separate numbers below totals?
   - Shown as a delta (e.g., "+5 today")?
   - In a tooltip on hover?
4. Count-up animation speed? (e.g., 1 second, 2 seconds?)
5. Should these be user-specific stats (my notebooks/pages/notes) or system-wide?

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

### 6. Fix Mobile Navigation Bar 🔴
**Priority**: High
**Type**: Bug Fix

**Issue**:
- Elements in the mobile navigation bar overlap each other
- Likely responsive design issue at smaller breakpoints

**Requirements**:
- Fix element positioning/spacing in mobile nav
- Ensure all nav items are properly visible and accessible
- Test across different mobile screen sizes (320px, 375px, 390px, 414px)
- Maintain visual consistency with desktop design

**Files to Check**:
- Navigation component (likely in `/components/`)
- Mobile menu implementation
- Tailwind responsive classes for navigation

**Questions Before Implementation**:
1. Which elements are overlapping specifically? (I should investigate the code first, but knowing what you're seeing helps)
2. What screen size are you testing on when you see the overlap?
3. Should mobile nav be:
   - Hamburger menu?
   - Bottom navigation?
   - Current design but fixed spacing?
4. Are there elements that should be hidden on mobile to reduce clutter?

---

### 7. Add Nickname to User Registration 🔴
**Priority**: Medium
**Type**: Feature

**Requirements**:
- Add nickname field to user registration flow
- Nickname should be optional or required (decide which)
- Validate nickname (length, allowed characters, uniqueness?)
- Store nickname in user profile

**Database Requirements**:
- Add `nickname` field to user profiles table
- If using Supabase Auth metadata:
  - Store in `auth.users.raw_user_meta_data`
- Or create separate `user_profiles` table:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users, unique)
  - `nickname` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

**Files to Create/Modify**:
- Registration form component
- User profile type definitions in `/types/database.ts`
- Database migration for user profiles
- Auth signup flow

**Questions Before Implementation**:
1. Should nickname be **required** or **optional**?
2. If optional, what should fallback display be? (email username? "User"? first name?)
3. Validation rules:
   - Min/max length? (suggested: 3-20 characters)
   - Allowed characters? (alphanumeric only? allow spaces? emojis? special chars?)
   - Must be unique across all users?
4. Should users be able to edit nickname after registration?
   - If yes, from where? (settings page?)
   - Should there be a cooldown between changes?
5. Storage preference:
   - **Option A**: Store in `auth.users.raw_user_meta_data` (simpler)
   - **Option B**: Create separate `user_profiles` table (more flexible)
6. Display name vs nickname - are they the same thing or separate fields?

---

### 8. Personalized Breadcrumb - "[Nickname]'s Notebooks" 🔴
**Priority**: Low
**Type**: Enhancement

**Requirements**:
- Replace static "Notebooks" text in breadcrumbs with personalized version
- Format: `[Nickname]'s Notebooks` (e.g., "Oscar's Notebooks")
- Should dynamically pull from user's nickname
- Fallback to "Notebooks" if nickname not set

**Implementation Details**:
- Fetch current user's nickname (from profile or auth metadata)
- Update breadcrumb component to display personalized text
- Handle possessive apostrophe correctly (Oscar's vs James')
- Ensure consistent capitalization

**Files to Modify**:
- Breadcrumb component
- May need to pass user context to breadcrumb component

**Dependencies**:
- Requires Task #7 (Add Nickname) to be completed first

**Questions Before Implementation**:
1. This depends on Task #7 - should we do #7 first?
2. For possessive form:
   - "Oscar's Notebooks" (standard)
   - "James's Notebooks" or "James' Notebooks"? (names ending in 's')
3. If user hasn't set a nickname yet, show:
   - "Notebooks" (generic)
   - "My Notebooks"
   - Something else?
4. Should this personalization apply elsewhere too? (page titles, navigation, etc.)

---

### 9. Move "How to Note" Below Video 🔴
**Priority**: Medium
**Type**: Enhancement

**Current State**:
- "How to Note" guide is currently displayed somewhere on the page (location TBD)

**Requirements**:
- Relocate the "How to Note" guide to appear below the YouTube video player
- Keep the exact same style as regular notes
- Keep the same functionality as regular notes (markdown rendering, editing capabilities, etc.)
- Should visually integrate seamlessly with other notes

**Implementation Details**:
- Move component position in page layout
- Ensure it's clearly identifiable as a guide (maybe with a subtle badge/icon?)
- Consider making it collapsible to save space
- Should it be editable by the user? (clarify)

**Files to Modify**:
- Page component with YouTube player
- "How to Note" guide component
- Layout/styling for notes section

**Questions Before Implementation**:
1. Where is the "How to Note" guide currently located? (I should find it in the code)
2. Should the guide be:
   - **Always visible** below the video?
   - **Collapsible** (can be expanded/collapsed)?
   - **Dismissible** (hide forever after clicking X)?
   - **Read-only** or **editable** by the user?
3. If editable - do changes persist per-user or per-page?
4. Should it have a visual distinction (border, background, icon) to show it's a guide, not a regular note?
5. Does "same style as notes" mean:
   - Same card/container design?
   - Same markdown rendering?
   - Same auto-save behavior (if editable)?

---

### 10. Add Cmd+K Shortcut to "How to Note" Guide 🔴
**Priority**: Low
**Type**: Enhancement

**Requirements**:
- Add information about `Cmd+K` (or `Ctrl+K` on Windows) keyboard shortcut
- Document that this opens the search widget/command palette
- Include this in the "How to Note" guide

**Concern to Address**:
- **Potential Conflict**: Does `Cmd+K` shortcut conflict with hyperlink creation in markdown editors?
- Need to verify if markdown editor uses `Cmd+K` for links
- If conflict exists, decide:
  - Change search widget shortcut to something else?
  - Disable `Cmd+K` link shortcut in markdown editor?
  - Use different key based on context (editor vs general app)?

**Files to Modify**:
- "How to Note" guide content/component
- Potentially keyboard shortcut handling logic

**Testing Required**:
- Test `Cmd+K` behavior when:
  - Not focused in any input
  - Focused in note editor
  - Focused in other inputs (notebook name, page title, etc.)

**Dependencies**:
- Related to Task #9 (moving How to Note guide)

**Questions Before Implementation**:
1. About the keyboard shortcut conflict:
   - Does your current markdown editor use Cmd+K for anything?
   - Should I check the note editor component first?
   - If there IS a conflict, which should take priority?
     - Search widget (global shortcut)
     - Link creation (when focused in editor)
2. How should the guide explain this:
   - "Press Cmd+K (Ctrl+K on Windows) to open search"?
   - Include visual keyboard icons?
   - Mention both shortcuts in different sections?
3. Should this be added to:
   - Just the "How to Note" guide?
   - Also to a keyboard shortcuts help page?
   - Command palette search terms?

---

### 11. Fix Logo Aspect Ratio Warning 🔴
**Priority**: Low
**Type**: Bug Fix

**Issue**:
- Console warning: "Image with src '/images/younote-logo-light.png' has either width or height modified, but not the other"
- Need to maintain aspect ratio when using CSS to change image size

**Requirements**:
- Add `width: "auto"` or `height: "auto"` styles to maintain aspect ratio
- Fix for both light and dark logo variants

**Files to Check**:
- `app/page.tsx` or wherever the logo is used in the authenticated layout
- Look for Image components with only one dimension specified

---

### 12. Limit Note Height with "Show More" Expansion 🔴
**Priority**: Medium
**Type**: Enhancement

**Issue**:
- Long notes take up too much vertical space in the notes list
- Makes it difficult to scan through multiple notes

**Requirements**:
- Limit note display height (e.g., 200px or 4-5 lines)
- Add "Show more" button/link at bottom of truncated notes
- Clicking "Show more" expands to reveal full content
- Optional: "Show less" to collapse back
- Should work with markdown-rendered content

**Implementation Details**:
- Apply max-height CSS with overflow hidden
- Detect if note content exceeds height limit
- Only show "Show more" button if content is actually truncated
- Smooth expand/collapse animation

**Files to Modify**:
- `components/notes/note-item.tsx`
- Potentially add new state for expanded/collapsed per note

**Questions Before Implementation**:
1. What height limit? (200px, 300px, or line-based like 5 lines?)
2. Should state persist when navigating away and back?
3. Expand/collapse animation speed?
4. Should "Show more" be text link or button?

---

### 13. Fetch YouTube Transcripts 🔴
**Priority**: High
**Type**: Feature

**Requirements**:
- Automatically fetch YouTube video transcripts when available
- Display transcript alongside or below video player
- Parse transcript with timestamps
- Make transcript timestamps clickable to seek video

**Implementation Details**:
- Use YouTube API or third-party library (e.g., `youtube-transcript-api`)
- Fetch transcript when page loads or on-demand
- Handle cases where transcript is unavailable
- Store transcript in database for caching?
- Parse timestamp format (usually `MM:SS` or `HH:MM:SS`)

**Technical Requirements**:
- Research best method to fetch transcripts:
  - YouTube Data API v3 (may not support transcripts directly)
  - Third-party libraries (youtube-transcript, etc.)
  - Server-side fetching to avoid CORS issues
- Database storage (optional):
  - Add `transcript` field to `pages` table (JSONB)
  - Or create separate `transcripts` table

**Files to Create/Modify**:
- API route: `/api/youtube/transcript`
- Transcript display component
- Update page detail view to show transcript
- Database migration if storing transcripts

**Questions Before Implementation**:
1. Where should transcript appear?
   - Below video player?
   - In a collapsible panel?
   - Side panel/drawer?
2. Should we store fetched transcripts in database or fetch on-demand?
3. What to show if transcript unavailable? (hide section, show message?)
4. Should transcript be searchable (Cmd+F within transcript)?
5. Auto-scroll transcript as video plays?

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

### 15. Add "Remember Me" Option at Login 🔴
**Priority**: Medium
**Type**: Feature

**Requirements**:
- Add checkbox for "Remember me" on login form
- If checked, extend session duration
- If unchecked, use shorter session (expires on browser close)

**Implementation Details**:
- Add checkbox UI to login form
- Configure Supabase session duration based on checkbox
- Default to unchecked (for security)
- Store preference in localStorage (optional)

**Supabase Auth Configuration**:
- Use `persistSession` option
- Adjust session expiry time based on "Remember me"
- Consider using refresh token rotation for security

**Files to Modify**:
- Login form component (`app/auth/login/page.tsx` or similar)
- Supabase client configuration for session handling

**Questions Before Implementation**:
1. Session duration when "Remember me" is checked? (7 days, 30 days, 90 days?)
2. Session duration when unchecked? (Session only, 24 hours?)
3. Should preference be remembered for next login?
4. Security considerations - max session length?

---

### 16. Add Terms of Use and Privacy Policy to Sign Up 🔴
**Priority**: High
**Type**: Feature - Compliance

**Requirements**:
- Add checkbox to sign up form: "I agree to the Terms of Use and Privacy Policy"
- Checkbox must be checked to enable sign up button
- Links to Terms of Use and Privacy Policy pages
- Create Terms of Use page
- Create Privacy Policy page

**Legal Requirements**:
- Terms of Use content (may need legal review)
- Privacy Policy content (GDPR, CCPA compliance if applicable)
- Record user consent in database

**Database Requirements**:
- Store consent timestamp in user metadata or separate table
- Track which version of terms/privacy policy user agreed to

**Files to Create/Modify**:
- Sign up form component
- `/app/legal/terms-of-use/page.tsx`
- `/app/legal/privacy-policy/page.tsx`
- Update Supabase user metadata to store consent

**Questions Before Implementation**:
1. Do you have existing Terms of Use and Privacy Policy documents?
2. Should we track which version of terms user agreed to?
3. Where should links open? (new tab, modal, dedicated page?)
4. Should existing users be prompted to accept updated terms?
5. GDPR compliance needed? (EU users)
6. Do you want to use a template or need custom legal docs?

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

None yet.

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
