/**
 * Color utility functions for theme management
 */

/**
 * Convert hex color to RGB array
 * @param {string} hex - Hex color code (e.g., "#dc2626")
 * @returns {number[]} Array of [r, g, b] values
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [220, 38, 38]; // Default red
};

/**
 * Darken a hex color by a factor
 * @param {string} hex - Hex color code
 * @param {number} factor - Darken factor (0-1, default 0.7)
 * @returns {number[]} Array of darkened [r, g, b] values
 */
export const darkenColor = (hex, factor = 0.7) => {
  const rgb = hexToRgb(hex);
  return rgb.map(c => Math.floor(c * factor));
};

/**
 * Convert RGB array to CSS string
 * @param {number[]} rgb - Array of [r, g, b] values
 * @returns {string} CSS rgb format (e.g., "220 38 38")
 */
export const rgbToString = (rgb) => {
  return rgb.join(' ');
};

/**
 * Get complete theme colors for a given theme
 * @param {string} themeColor - Theme name (red, purple, blue, etc.)
 * @param {string} customColor - Custom hex color if theme is 'custom'
 * @returns {object} Theme object with primary and secondary colors
 */
export const getThemeColors = (themeColor, customColor = '#dc2626') => {
  const themes = {
    red: { primary: '220 38 38', secondary: '153 27 27' },
    purple: { primary: '147 51 234', secondary: '107 33 168' },
    blue: { primary: '37 99 235', secondary: '30 64 175' },
    orange: { primary: '234 88 12', secondary: '154 52 18' },
    green: { primary: '22 163 74', secondary: '20 83 45' },
    pink: { primary: '219 39 119', secondary: '136 19 55' },
    cyan: { primary: '8 145 178', secondary: '21 94 117' },
    indigo: { primary: '99 102 241', secondary: '67 56 202' },
    custom: { 
      primary: rgbToString(hexToRgb(customColor)), 
      secondary: rgbToString(darkenColor(customColor))
    }
  };
  
  return themes[themeColor] || themes.red;
};

/**
 * Apply theme colors to document root
 * @param {string} themeColor - Theme name
 * @param {string} customColor - Custom hex color if needed
 */
export const applyTheme = (themeColor, customColor = '#dc2626') => {
  const colors = getThemeColors(themeColor, customColor);
  document.documentElement.style.setProperty('--accent-main', colors.primary);
  document.documentElement.style.setProperty('--accent-dark', colors.secondary);
};
