/**
 * Onboarding content templates for new users
 *
 * Auto-creates "Welcome to YouNote" notebook with tutorial notes
 */

export const ONBOARDING_VIDEO_URL = "https://youtu.be/9EKi2E9dVY8";
export const ONBOARDING_VIDEO_ID = "9EKi2E9dVY8";

export const ONBOARDING_NOTEBOOK_TITLE = "Welcome to YouNote";
export const ONBOARDING_PAGE_TITLE = "Quick Start Guide";

export interface OnboardingNote {
  content: string;
  timestamp: number; // in seconds
}

export const ONBOARDING_NOTES: OnboardingNote[] = [
  {
    timestamp: 0,
    content: `# Welcome to YouNote! 🎉

YouNote helps you take **timestamped notes** while watching YouTube videos.

This tutorial notebook will show you the basics. Feel free to:
- Edit these notes
- Delete this notebook when ready
- Or keep it as a reference!

Click on the timestamps in these notes to jump to that moment in the video. Let's get started! 👇`
  },
  {
    timestamp: 21,
    content: `# 00:21 - "Friends Don't Let Friends Get Friends Haircuts"

Notice the sticker on Jerry Cantrell's guitar? This became iconic from Alice in Chains' legendary MTV Unplugged performance in 1996.

**The Story Behind It:**
The sticker reads "Friends Don't Let Friends Get Friends Haircuts" - a humorous play on the anti-drunk driving slogan "Friends Don't Let Friends Drive Drunk."

During the grunge era of the early '90s, it was common for friend groups to get matching haircuts (think matching bowl cuts or long hair). Jerry's sticker was a tongue-in-cheek commentary on this trend.

**Why This Matters for YouNote:**
This note demonstrates YouNote's core feature - **timestamped notes!** Click on \`00:21\` above to jump directly to this moment in the video. Perfect for capturing interesting details, references, or moments you want to remember.

You can add as many timestamped notes as you like. Just type the time in \`MM:SS\` or \`HH:MM:SS\` format, and it becomes clickable!`
  },
  {
    timestamp: 60,
    content: `# 01:00 - How YouNote is Organized

YouNote has three levels:

1. **📓 Notebooks** - Organize by topic or category
   - Examples: "Guitar Lessons", "Cooking Recipes", "Business Ideas"

2. **📄 Pages** - One page per YouTube video
   - Each page embeds the video player

3. **📝 Notes** - Timestamped notes for each video
   - Click timestamps to seek the video

**Example Structure:**
\`\`\`
📓 Music Theory Lessons
  ├── 📄 "Understanding Chord Progressions"
  │   ├── 02:15 - What is a chord progression?
  │   ├── 05:30 - Common progressions (I-IV-V)
  │   └── 08:45 - Practice examples
  └── 📄 "Scales Explained"
      ├── 01:20 - Major scale formula
      └── 04:50 - Minor scale variations
\`\`\`

**Pro Tip:** Create notebooks for different topics. Add pages for each video. Add notes as you watch!`
  },
  {
    timestamp: 120,
    content: `# 02:00 - Taking Notes in YouNote

**Creating a Note:**
- Click the "+" button (or FAB on mobile) below the video
- Or use the **New Note** card at the top of the notes section
- Notes **auto-save** as you type! ✨ (no need to manually save)

**Editing Notes:**
- Click any note to edit it
- Changes save automatically after you stop typing
- Click outside to finish editing

**Deleting Notes:**
- Hover over a note and click the trash icon
- Confirm deletion (can't be undone)

**Best Practice:**
- Add timestamps to your notes: \`12:34 - Your note here\`
- Be concise - capture key points, not transcripts
- Use markdown formatting (see next note!)`
  },
  {
    timestamp: 180,
    content: `# 03:00 - Format Notes with Markdown

YouNote supports **GitHub Flavored Markdown** for rich text formatting:

## Text Formatting
- **Bold text** → \`**bold**\`
- *Italic text* → \`*italic*\`
- ~~Strikethrough~~ → \`~~text~~\`
- \`Inline code\` → \`\`code\`\`

## Lists
**Bullet List:**
- Item 1
- Item 2
  - Nested item

**Numbered List:**
1. First item
2. Second item
3. Third item

## Links & Code Blocks
- [Link text](https://example.com)
- \`\`\`javascript
  // Code block
  const greeting = "Hello!";
  \`\`\`

## Checkboxes
- [ ] Unchecked task
- [x] Completed task

**Try it yourself!** Edit this note and experiment with markdown formatting.`
  },
  {
    timestamp: 240,
    content: `# 04:00 - ⌨️ Keyboard Shortcuts

Speed up your workflow with these shortcuts:

**Essential Shortcuts:**
- **Cmd/Ctrl + K** - Quick search
  - Find any notebook, page, or note instantly
  - Works from anywhere in the app

- **Cmd/Ctrl + Enter** - Save current note
  - Forces immediate save (though auto-save is on)
  - Useful when you want to ensure note is saved

**Coming Soon:**
- Cmd/Ctrl + / - Toggle markdown toolbar
- Cmd/Ctrl + B - Bold selected text
- Cmd/Ctrl + I - Italic selected text

**Pro Tip:** Press \`Cmd/Ctrl + K\` right now to try the search! Type "Welcome" to find this notebook.`
  },
  {
    timestamp: 300,
    content: `# 05:00 - 🔗 Share Your Notes

Share pages with friends, classmates, or teammates:

**How to Share:**
1. Click the **"Share"** button at the top of any page
2. Copy the generated link
3. Send to anyone!

**Privacy:**
- Shared links are **view-only** (others can't edit)
- Only the specific page is shared (not your entire notebook)
- Revoke access anytime by regenerating the link

**Great for:**
- 📚 Study groups - share lecture notes
- 👥 Team knowledge - share tutorial notes
- 🎓 Teaching - share curated resources
- 💡 Reference materials - bookmark and share

**Try it:** Share this onboarding page with a friend to show them YouNote!`
  }
];
