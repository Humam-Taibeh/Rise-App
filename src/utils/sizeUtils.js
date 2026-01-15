/**
 * UI size and scaling utilities
 * Centralized calculation for responsive sizing
 */

import { UI_SIZES } from '../constants/config.js';

/**
 * Get UI size configuration for a given scale
 * @param {string} scale - UI scale ('small', 'medium', 'large')
 * @returns {object} Size configuration
 */
export const getUISizes = (scale = 'medium') => {
  return UI_SIZES[scale] || UI_SIZES.medium;
};

/**
 * Get logo size class
 * @param {string} scale - UI scale
 * @returns {string} Tailwind size class
 */
export const getLogoSize = (scale) => {
  return getUISizes(scale).logo;
};

/**
 * Get greeting text size class
 * @param {string} scale - UI scale
 * @returns {string} Tailwind size class
 */
export const getGreetingSize = (scale) => {
  return getUISizes(scale).greeting;
};

/**
 * Get container padding/spacing classes
 * @param {string} scale - UI scale
 * @returns {string} Tailwind spacing classes
 */
export const getContainerSpacing = (scale) => {
  return getUISizes(scale).container;
};

/**
 * Get all sizes as object for easier passing to components
 * @param {string} scale - UI scale
 * @returns {object} All size classes
 */
export const getAllSizes = (scale) => {
  return {
    logo: getLogoSize(scale),
    greeting: getGreetingSize(scale),
    container: getContainerSpacing(scale)
  };
};

/**
 * Validate if scale is valid
 * @param {string} scale - UI scale
 * @returns {boolean} True if valid
 */
export const isValidScale = (scale) => {
  return ['small', 'medium', 'large'].includes(scale);
};

/**
 * Get next scale size
 * @param {string} currentScale - Current UI scale
 * @returns {string} Next scale
 */
export const getNextScale = (currentScale) => {
  const scales = ['small', 'medium', 'large'];
  const currentIndex = scales.indexOf(currentScale);
  return scales[(currentIndex + 1) % scales.length];
};

/**
 * Get previous scale size
 * @param {string} currentScale - Current UI scale
 * @returns {string} Previous scale
 */
export const getPreviousScale = (currentScale) => {
  const scales = ['small', 'medium', 'large'];
  const currentIndex = scales.indexOf(currentScale);
  return scales[(currentIndex - 1 + scales.length) % scales.length];
};
