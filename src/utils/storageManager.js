/**
 * Centralized localStorage management
 * Provides consistent interface for all storage operations
 */

import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants/config.js';
import { createLogger } from './logger.js';

const logger = createLogger('StorageManager');

/**
 * Get value from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Stored value or default
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    logger.error('getFromStorage', error);
    return defaultValue;
  }
};

/**
 * Set value in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    logger.debug('setToStorage', `${key} set to`, value);
    return true;
  } catch (error) {
    logger.error('setToStorage', error);
    return false;
  }
};

/**
 * Remove value from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    logger.debug('removeFromStorage', `${key} removed`);
    return true;
  } catch (error) {
    logger.error('removeFromStorage', error);
    return false;
  }
};

/**
 * Clear all app settings from localStorage
 * @returns {boolean} Success status
 */
export const clearAllSettings = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    logger.info('clearAllSettings', 'All settings cleared');
    return true;
  } catch (error) {
    logger.error('clearAllSettings', error);
    return false;
  }
};

/**
 * Get all settings as object
 * @returns {object} All settings
 */
export const getAllSettings = () => {
  return {
    displayName: getFromStorage(STORAGE_KEYS.displayName, DEFAULT_SETTINGS.displayName),
    uiScale: getFromStorage(STORAGE_KEYS.uiScale, DEFAULT_SETTINGS.uiScale),
    language: getFromStorage(STORAGE_KEYS.language, DEFAULT_SETTINGS.language),
    themeColor: getFromStorage(STORAGE_KEYS.themeColor, DEFAULT_SETTINGS.themeColor),
    customColor: getFromStorage(STORAGE_KEYS.customColor, DEFAULT_SETTINGS.customColor),
    themeMode: getFromStorage(STORAGE_KEYS.themeMode, DEFAULT_SETTINGS.themeMode),
    notificationsEnabled: getFromStorage(STORAGE_KEYS.notificationsEnabled, DEFAULT_SETTINGS.notificationsEnabled),
    autoSaveInterval: getFromStorage(STORAGE_KEYS.autoSaveInterval, DEFAULT_SETTINGS.autoSaveInterval)
  };
};

/**
 * Save all settings at once
 * @param {object} settings - Settings object
 * @returns {boolean} Success status
 */
export const saveAllSettings = (settings) => {
  try {
    Object.entries(settings).forEach(([key, value]) => {
      const storageKey = STORAGE_KEYS[key];
      if (storageKey) {
        setToStorage(storageKey, value);
      }
    });
    logger.debug('saveAllSettings', 'All settings saved');
    return true;
  } catch (error) {
    logger.error('saveAllSettings', error);
    return false;
  }
};

/**
 * Reset all settings to defaults
 * @returns {boolean} Success status
 */
export const resetToDefaults = () => {
  try {
    saveAllSettings(DEFAULT_SETTINGS);
    logger.info('resetToDefaults', 'Settings reset to defaults');
    return true;
  } catch (error) {
    logger.error('resetToDefaults', error);
    return false;
  }
};

/**
 * Get a single setting with fallback
 * @param {string} key - Setting key
 * @returns {*} Setting value
 */
export const getSetting = (key) => {
  const storageKey = STORAGE_KEYS[key];
  if (!storageKey) {
    logger.warn('getSetting', `Unknown key: ${key}`);
    return DEFAULT_SETTINGS[key];
  }
  return getFromStorage(storageKey, DEFAULT_SETTINGS[key]);
};

/**
 * Set a single setting
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {boolean} Success status
 */
export const setSetting = (key, value) => {
  const storageKey = STORAGE_KEYS[key];
  if (!storageKey) {
    logger.warn('setSetting', `Unknown key: ${key}`);
    return false;
  }
  return setToStorage(storageKey, value);
};
