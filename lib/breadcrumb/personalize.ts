/**
 * Creates a personalized breadcrumb label for notebooks
 * @param nickname - User's nickname
 * @returns Formatted string like "Oscar's Notebooks" or "Notebooks" if no nickname
 */
export function getNotebooksBreadcrumb(nickname?: string | null): string {
  if (!nickname) {
    return "Notebooks";
  }

  // Handle possessive apostrophe
  // Standard: "Oscar's Notebooks"
  // Names ending in 's': "James's Notebooks" (modern style)
  const possessive = nickname.endsWith('s')
    ? `${nickname}'s`
    : `${nickname}'s`;

  return `${possessive} Notebooks`;
}
