/**
 * LocalStorage utilities for announcements feature
 *
 * Tracks the last seen announcement date to calculate unread count.
 * SSR-safe with window checks.
 */

import type { Announcement } from './announcements';

const LAST_SEEN_KEY = 'younote-announcements-last-seen';

/**
 * Get the ISO date string of the last viewed announcement
 * Returns null if never viewed or localStorage unavailable
 */
export function getLastSeenDate(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Store the ISO date string of the last viewed announcement
 */
export function setLastSeenDate(date: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAST_SEEN_KEY, date);
  } catch {
    // Silently fail if localStorage is blocked
  }
}

/**
 * Calculate the number of unread announcements
 * Announcements with dates newer than last seen are considered unread
 */
export function getUnreadCount(announcements: Announcement[]): number {
  const lastSeen = getLastSeenDate();

  // If never viewed, all announcements are unread
  if (!lastSeen) return announcements.length;

  // Count announcements with dates newer than last seen
  return announcements.filter(a => a.date > lastSeen).length;
}

/**
 * Mark all announcements as read by setting last seen to the most recent date
 * Call this when user opens the announcements dropdown or page
 */
export function markAllAsRead(announcements: Announcement[]): void {
  if (announcements.length === 0) return;

  // Set last seen to the most recent announcement (first in array since sorted newest first)
  setLastSeenDate(announcements[0].date);
}
