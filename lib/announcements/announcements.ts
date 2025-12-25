/**
 * Announcements Data Structure
 *
 * Static TypeScript file containing all product announcements.
 * Announcements are grouped by release date, with user-benefit focused descriptions.
 *
 * ⚠️ IMPORTANT: When shipping new features with real user value, ADD THEM HERE!
 * This is how users discover what's new in YouNote. Don't forget to update this file
 * when deploying meaningful improvements.
 *
 * Content Guidelines:
 * - Focus on what users can DO, not what we built
 * - Use active voice ("Watch videos" not "Ability to watch")
 * - Group features by release date (one announcement per day)
 * - Icons must be valid Lucide React icon names
 * - Badge "new" for single features, "major" for big releases, "improvement" for enhancements
 *
 * Examples:
 * ❌ BAD: "Added PiP mode to YouTube player"
 * ✅ GOOD: "Watch videos in Picture-in-Picture mode while taking notes"
 */

export interface Announcement {
  date: string;              // ISO date string for sorting (e.g., "2025-12-25")
  displayDate: string;       // Human-readable date (e.g., "December 25, 2025")
  title: string;             // One-line summary of the release
  features: AnnouncementFeature[];
  badge?: 'new' | 'major' | 'improvement';  // Optional badge to highlight importance
}

export interface AnnouncementFeature {
  icon: string;              // Lucide icon name (e.g., "Sparkles", "Share2")
  title: string;             // Feature name
  description: string;       // User-benefit focused description
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: "2025-12-25",
    displayDate: "December 25, 2025",
    title: "Viral Sharing",
    badge: "new",
    features: [
      {
        icon: "Share2",
        title: "Auto-Fork Shared Notes",
        description: "Copy shared notes to your account with one click. Perfect for collecting study materials from classmates or saving tutorial notes from instructors."
      }
    ]
  },
  {
    date: "2025-12-23",
    displayDate: "December 23, 2025",
    title: "Live Stream Support",
    features: [
      {
        icon: "Radio",
        title: "YouTube Live Streams",
        description: "Take timestamped notes on YouTube live streams. Timestamps work even after the stream ends."
      }
    ]
  },
  {
    date: "2025-12-22",
    displayDate: "December 22, 2025",
    title: "Major Product Update",
    badge: "major",
    features: [
      {
        icon: "PictureInPicture",
        title: "Picture-in-Picture Mode",
        description: "Keep watching videos in a floating window while scrolling through your notes. Perfect for longer videos."
      },
      {
        icon: "List",
        title: "Notes Outline",
        description: "Navigate your notes with an interactive outline. Click any heading to jump directly to that section."
      },
      {
        icon: "MapPin",
        title: "Personalized Breadcrumbs",
        description: "See your custom notebook names in breadcrumbs instead of generic IDs. Easier navigation across your content."
      },
      {
        icon: "Eye",
        title: "Show More for Long Notes",
        description: "Long notes are now collapsed by default with a 'Show more' button. Keeps your page clean and scannable."
      },
      {
        icon: "Shield",
        title: "Google Sign-In",
        description: "Sign up and log in with your Google account. Faster, more secure, and no password to remember."
      },
      {
        icon: "Search",
        title: "Command Palette",
        description: "Press Cmd+K to instantly search notebooks, pages, and notes. Navigate your entire library without touching your mouse."
      },
      {
        icon: "FileText",
        title: "YouTube Transcripts",
        description: "View official YouTube transcripts alongside your notes. Great for referencing exact quotes or filling in gaps."
      },
      {
        icon: "BookOpen",
        title: "Video Chapters",
        description: "See YouTube chapter markers in the player. Navigate long videos by topic instead of scrubbing blindly."
      },
      {
        icon: "User",
        title: "User Profiles",
        description: "Set a nickname and export all your data as JSON. Full control over your content."
      },
      {
        icon: "Palette",
        title: "Theme Switcher",
        description: "Choose light mode, dark mode, or sync with your system. Easy on the eyes, day or night."
      },
      {
        icon: "BarChart3",
        title: "Home Page Stats",
        description: "See total users, notebooks, pages, and notes on the home page. Watch the community grow!"
      },
      {
        icon: "FileCheck",
        title: "Terms & Privacy",
        description: "Clear, honest terms of use and privacy policy. Know exactly how we handle your data."
      }
    ]
  },
  {
    date: "2025-12-21",
    displayDate: "December 21, 2025",
    title: "Onboarding & Mobile",
    features: [
      {
        icon: "BookOpen",
        title: "Welcome Notebook",
        description: "New users get an interactive tutorial notebook. Learn by doing with a real example video."
      },
      {
        icon: "Smartphone",
        title: "Improved Mobile Navigation",
        description: "Redesigned mobile menu and FAB button. Taking notes on your phone is now a breeze."
      }
    ]
  },
  {
    date: "2025-12-20",
    displayDate: "December 20, 2025",
    title: "Polish & Sharing",
    features: [
      {
        icon: "Type",
        title: "Character Limits",
        description: "Reasonable limits prevent accidentally pasting huge text blocks. Keeps the app fast."
      },
      {
        icon: "Share2",
        title: "Share with Formatting",
        description: "Shared notes now preserve all your markdown formatting. What you see is what they get."
      }
    ]
  },
  {
    date: "2025-12-19",
    displayDate: "December 19, 2025",
    title: "🎉 YouNote Launch",
    badge: "major",
    features: [
      {
        icon: "Rocket",
        title: "Welcome to YouNote",
        description: "Take timestamped notes on any YouTube video. Your notes sync across devices and stay organized in notebooks and pages."
      },
      {
        icon: "Youtube",
        title: "YouTube Integration",
        description: "Embedded video player with note timestamps. Click any timestamp to jump directly to that moment in the video."
      },
      {
        icon: "FileEdit",
        title: "Markdown Support",
        description: "Write notes in markdown with live preview. Checkboxes, formatting, links, and more - all synced in real-time."
      },
      {
        icon: "FolderOpen",
        title: "Organized by Notebooks",
        description: "Create unlimited notebooks to organize your learning. Each video gets its own page with all your notes in one place."
      }
    ]
  }
];
