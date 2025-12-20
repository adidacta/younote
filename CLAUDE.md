# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouNote is a Next.js application for taking timestamped notes while watching YouTube videos. Users create notebooks containing pages (one per video), with each page displaying an embedded YouTube player and markdown notes with timestamps.

## Development Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Tech Stack
- **Framework:** Next.js 16+ (App Router) with React 19
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **Auth:** Supabase Auth (email/password + magic links)
- **UI:** Radix UI primitives with Tailwind CSS
- **Animations:** Framer Motion
- **Markdown:** react-markdown with remark-gfm

### Data Model Hierarchy

```
User → Notebooks → Pages → Notes
```

**Database Tables:**
- `notebooks`: User's notebook collections
- `pages`: YouTube video pages within notebooks (contains video metadata)
- `notes`: Timestamped markdown notes on pages
- `shared_pages`: Public sharing tokens for pages

All user-scoped tables include `user_id` for RLS filtering.

### Route Organization

**Public Routes:**
- `/` - Landing page (redirects authenticated users)
- `/auth/*` - Authentication pages
- `/share/[token]` - Public shared pages (no auth required)

**Protected Routes:**
- `/(authenticated)/*` - All logged-in pages
  - `/notebooks` - List all notebooks
  - `/notebooks/[id]` - View pages in notebook
  - `/notebooks/[id]/pages/[pageId]` - Video player + notes editor

**API Routes:**
```
/api/notebooks          POST, GET
/api/notebooks/[id]     PATCH, DELETE
/api/pages              POST
/api/pages/[id]         PATCH, DELETE
/api/notes              POST
/api/notes/[id]         PATCH, DELETE
/api/share              POST (generate share link)
/api/youtube/metadata   GET (fetch video data)
```

### Supabase Client Patterns

**CRITICAL:** Always use the correct client for the context:

```typescript
// Server Components & API Routes
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()  // Creates fresh client per request

// Client Components
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()  // Browser-side client
```

**Never** reuse server clients across requests. Always create a new one.

### Database Layer

All database operations are abstracted in `/lib/database/`:
- `notebooks.ts` - CRUD for notebooks
- `pages.ts` - CRUD for pages with YouTube metadata
- `notes.ts` - CRUD for notes
- `shared-pages.ts` - Share link management

These functions use the server client and should only be called from:
- Server Components
- API Route Handlers
- Server Actions

### Component Patterns

**Server Components** (default):
- Layout files
- Page components that fetch data
- Use `await createClient()` for database access

**Client Components** (`"use client"`):
- Interactive forms and editors
- Components using hooks (useState, useEffect, etc.)
- Anything with event handlers or animations
- Examples: `NoteItem`, `NotebooksView`, `CommandPalette`

### Key Features Implementation

**Auto-Save Pattern:**
```typescript
// Notes auto-save with 800ms debounce
const debouncedContent = useDebounce(content, 800)
useEffect(() => {
  if (debouncedContent !== originalContent) {
    handleAutoSave()
  }
}, [debouncedContent])
```

**YouTube Integration:**
1. User pastes YouTube URL
2. Extract video ID via regex
3. Call `/api/youtube/metadata` (uses YOUTUBE_API_KEY server-side)
4. Store: title, thumbnail, channel, duration
5. Auto-create markdown guide on first page

**Sharing Flow:**
1. User clicks share on a page
2. POST to `/api/share` with page_id
3. Reuses existing token or creates new UUID
4. Returns shareable URL: `/share/[token]`
5. Public view bypasses RLS using share token lookup

**Breadcrumb Animation:**
- Uses Framer Motion for letter-by-letter bold transitions
- Detects navigation direction via sessionStorage
- Forward nav: faster animation, left-to-right
- Backward nav: slower animation, right-to-left (currently buggy - see known issues)

### Important Patterns

**Dynamic Route Parameters (Next.js 15+):**
```typescript
// API routes and pages must await params
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ... use id
}
```

**Authentication Check:**
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return redirect('/') // or return 401 for API
}
```

**Markdown Rendering:**
- Uses `react-markdown` with `remark-gfm` for GitHub Flavored Markdown
- Custom components for checkboxes (editable with auto-save)
- Timestamp links clickable to seek video

### Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx...
YOUTUBE_API_KEY=AIzxxx...  # Server-side only (NOT prefixed with NEXT_PUBLIC_)
```

**IMPORTANT:** `YOUTUBE_API_KEY` must never be exposed to client. Only use in API routes.

### Styling Conventions

- Tailwind utility classes for all styling
- Dark mode via `next-themes` with class strategy
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Component variants via `class-variance-authority` (see `Button` component)
- Prose styling for markdown: `prose prose-sm dark:prose-invert`

### Known Issues

1. **Breadcrumb backward animation** - Bold effect doesn't flow right-to-left when navigating back to Notebooks (sessionStorage detection needs refinement)

### Next.js Specifics

**Build Configuration:**
- `cacheComponents: false` in `next.config.ts` for dynamic routes
- Remote images allowed from `i.ytimg.com` (YouTube thumbnails)
- `export const dynamic = 'force-dynamic'` on pages needing real-time data

**Type Safety:**
- All database types in `/types/database.ts`
- Includes Insert and Update types for each model
- API responses typed with proper error handling

### Common Patterns to Follow

**Creating a new feature:**
1. Add database function in `/lib/database/`
2. Create API route in `/app/api/`
3. Build client component if interactive
4. Use server component for page-level data fetching
5. Add types to `/types/database.ts` if new model

**Adding a new API endpoint:**
```typescript
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  // ... handle request

  return Response.json({ data: result })
}
```

**Working with forms:**
- Use client components with `useState` for controlled inputs
- Show loading states during submission
- Display errors with toast notifications (via `sonner`)
- Auto-redirect on success with `router.push()`

### Deployment

- Deployed on Vercel
- Environment variables set in Vercel dashboard
- Automatic deployments on push to main
- Build runs TypeScript checks - fix all type errors before pushing
