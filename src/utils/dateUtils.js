/**
 * Date utility functions for timezone-aware operations
 */

/**
 * Get current date in Jordan timezone (Asia/Amman)
 * @returns {Date} Current date in Jordan timezone
 */
export const getJordanDate = () => {
  const now = new Date();
  const jordanTime = now.toLocaleString('en-US', { timeZone: 'Asia/Amman' });
  return new Date(jordanTime);
};

/**
 * Get today's date string in Jordan timezone
 * @returns {string} Date string (e.g., "Sun Jan 12 2026")
 */
export const getTodayJordanString = () => {
  return getJordanDate().toDateString();
};

/**
 * Get week number for a given date (ISO 8601)
 * @param {Date} date - The date to get week number for
 * @returns {number} Week number (1-53)
 */
export const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Check if date is yesterday in Jordan timezone
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (dateString) => {
  const lastDate = new Date(dateString);
  const yesterday = new Date(getTodayJordanString());
  yesterday.setDate(yesterday.getDate() - 1);
  return lastDate.toDateString() === yesterday.toDateString();
};

/**
 * Get days difference between two date strings
 * @param {string} oldDateString - Older date
 * @param {string} newDateString - Newer date
 * @returns {number} Number of days difference
 */
export const getDaysDifference = (oldDateString, newDateString) => {
  const oldDate = new Date(oldDateString);
  const newDate = new Date(newDateString);
  return Math.floor((newDate - oldDate) / (1000 * 60 * 60 * 24));
};
