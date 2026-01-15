/**
 * Level system utilities
 * Manages user levels based on streak count
 */

import { LEVEL_CONFIG } from '../constants/config.js';

/**
 * Get current level based on streak count
 * @param {number} streak - Current streak count
 * @returns {object} Level information
 */
export const getLevelByStreak = (streak) => {
  const level = LEVEL_CONFIG.find(l => streak >= l.minStreak);
  return level || LEVEL_CONFIG[LEVEL_CONFIG.length - 1]; // Return The Flame as default
};

/**
 * Get progress to next level
 * @param {number} streak - Current streak count
 * @returns {object} Progress information
 */
export const getNextLevelProgress = (streak) => {
  const currentLevel = getLevelByStreak(streak);
  const nextLevel = LEVEL_CONFIG.find(l => l.level > currentLevel.level);

  if (!nextLevel) {
    return {
      current: currentLevel,
      next: null,
      progress: 100,
      streaksNeeded: 0,
      isMaxLevel: true
    };
  }

  const streaksNeeded = nextLevel.minStreak - streak;
  const totalNeeded = nextLevel.minStreak - currentLevel.minStreak;
  const progress = Math.round(((streak - currentLevel.minStreak) / totalNeeded) * 100);

  return {
    current: currentLevel,
    next: nextLevel,
    progress: Math.min(progress, 100),
    streaksNeeded: Math.max(0, streaksNeeded),
    isMaxLevel: false
  };
};

/**
 * Get level color for progress circle
 * @param {string} colorClass - Tailwind color class
 * @returns {string} RGB color value
 */
export const getLevelColorRGB = (colorClass) => {
  const colorMap = {
    'text-red-500': 'rgb(239 68 68)',
    'text-purple-500': 'rgb(147 51 234)',
    'text-blue-500': 'rgb(59 130 246)',
    'text-orange-500': 'rgb(249 115 22)'
  };
  return colorMap[colorClass] || 'rgb(239 68 68)';
};

/**
 * Get all levels
 * @returns {array} Array of all levels
 */
export const getAllLevels = () => {
  return LEVEL_CONFIG;
};

/**
 * Check if user has reached specific level
 * @param {number} streak - Current streak count
 * @param {number} level - Level number
 * @returns {boolean} True if user has reached level
 */
export const hasReachedLevel = (streak, level) => {
  const targetLevel = LEVEL_CONFIG.find(l => l.level === level);
  return streak >= targetLevel.minStreak;
};

/**
 * Get level milestone information
 * @returns {array} Array of milestones
 */
export const getLevelMilestones = () => {
  return LEVEL_CONFIG.map(level => ({
    ...level,
    milestone: level.minStreak
  }));
};
