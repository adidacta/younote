# YouNote - Open Tasks

This file tracks open tasks, bugs, and feature requests for the YouNote project.

## Status Key
- 🔴 **Not Started** - Task has not been started
- 🟡 **In Progress** - Currently being worked on
- 🟢 **Completed** - Task is finished
- 🔵 **Needs Discussion** - Requires brainstorming or decision-making

---

## Current Tasks



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

### 19. Add Notes Outline/Navigation Sidebar 🔴
**Priority**: Medium
**Type**: Feature - Navigation Enhancement

**Description**:
Add a collapsible outline/navigation panel on page detail view that displays all notes on the current page, allowing quick navigation to specific notes.

**Requirements**:
- Display list of all notes in the current page (outline view)
- Show note titles/first line of content as links
- Position: Left of the notes list, using current padding space
- Clickable items that scroll to the corresponding note
- Collapsible functionality (show/hide the outline)
- Should not interfere with responsive layout
- Persist collapsed/expanded state (localStorage or session)

**Layout Details**:
**Current Layout:**
```
[Video Player        ] [    Notes List    ]
                       [                   ]
```

**New Layout:**
```
[Video Player        ] [Outline] [Notes  ]
                       [  Nav  ] [ List  ]
                       [       ] [       ]
```

**Implementation Details**:
- Extract note titles or first 50-80 characters as outline items
- Highlight current note in outline when scrolling
- Smooth scroll to note when clicking outline item
- Toggle button to collapse/expand outline (arrow icon)
- Width: ~200-250px when expanded, ~20-30px when collapsed
- Mobile: Auto-collapse or hide completely on small screens

**Technical Requirements**:
- Track scroll position to highlight active note in outline
- Use intersection observer for scroll-based highlighting
- Store collapsed state in localStorage: `notesOutlineCollapsed`
- Accessible keyboard navigation (tab through outline items)

**Files to Create/Modify**:
- Create: `components/notes/notes-outline.tsx` - New outline component
- Modify: `app/(authenticated)/notebooks/[id]/pages/[pageId]/page.tsx` - Add outline to layout
- Modify: `components/notes/notes-list.tsx` - May need to add IDs for scroll targets

**Questions Before Implementation**:
1. Should outline show:
   - Note titles only (if note starts with # heading)?
   - First line of each note?
   - First X characters?
   - Timestamp + first line?
2. Collapsed state:
   - Default to expanded or collapsed?
   - Icon-only when collapsed or completely hidden?
3. Mobile behavior:
   - Hide completely?
   - Move to bottom sheet/drawer?
   - Keep but auto-collapsed?
4. Should outline be sortable?
   - Match notes list order (newest/oldest)?
   - Always chronological by timestamp?
5. Visual style:
   - Indent for hierarchy (if using headings)?
   - Different icons for timestamped vs non-timestamped notes?
   - Show note count in collapsed state?

**Dependencies**:
- None (can be implemented immediately)

**Estimated Effort**: 3-4 hours
- Component creation: 1-2 hours
- Layout integration: 1 hour
- Scroll tracking + highlighting: 1 hour
- Testing + polish: 1 hour

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
