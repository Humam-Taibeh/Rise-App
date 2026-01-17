/**
 * useSettings Hook (Refactored)
 * Manages user settings with centralized storage operations
 */

import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { DEFAULT_SETTINGS, DB_TABLES } from '../constants/config.js';
import { getSetting, setSetting, getAllSettings, saveAllSettings as saveToStorage } from '../utils/storageManager.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('useSettings');

export const useSettings = (user) => {
  const [displayName, setDisplayName] = useState(() => getSetting('displayName'));
  const [uiScale, setUiScale] = useState(() => getSetting('uiScale'));
  const [language, setLanguage] = useState(() => getSetting('language'));
  const [themeColor, setThemeColor] = useState(() => getSetting('themeColor'));
  const [customColor, setCustomColor] = useState(() => getSetting('customColor'));
  const [themeMode, setThemeMode] = useState(() => getSetting('themeMode') || 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => getSetting('notificationsEnabled') !== false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(() => getSetting('autoSaveInterval') || 30);

  /**
   * Fetch settings from database and sync to localStorage
   */
  const fetchSettings = useCallback(
    async (userId) => {
      if (!userId) return;

      try {
        logger.debug('fetchSettings', `Fetching for user: ${userId}`);
        const { data: settings, error } = await supabase
          .from(DB_TABLES.settings)
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          logger.error('fetchSettings', error);
          return;
        }

        if (settings) {
          logger.debug('fetchSettings', 'Settings loaded from database');
          const settingsData = {
            displayName: settings.displayName || DEFAULT_SETTINGS.displayName,
            uiScale: settings.uiScale || DEFAULT_SETTINGS.uiScale,
            language: settings.language || DEFAULT_SETTINGS.language,
            themeColor: settings.themeColor || DEFAULT_SETTINGS.themeColor,
            customColor: settings.customColor || DEFAULT_SETTINGS.customColor,
            themeMode: settings.themeMode || DEFAULT_SETTINGS.themeMode,
            notificationsEnabled:
              settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : DEFAULT_SETTINGS.notificationsEnabled,
            autoSaveInterval: settings.autoSaveInterval || DEFAULT_SETTINGS.autoSaveInterval
          };

          // Update state
          setDisplayName(settingsData.displayName);
          setUiScale(settingsData.uiScale);
          setLanguage(settingsData.language);
          setThemeColor(settingsData.themeColor);
          setCustomColor(settingsData.customColor);
          setThemeMode(settingsData.themeMode);
          setNotificationsEnabled(settingsData.notificationsEnabled);
          setAutoSaveInterval(settingsData.autoSaveInterval);

          // Sync to localStorage
          saveToStorage(settingsData);
        }
      } catch (error) {
        logger.error('fetchSettings', error);
      }
    },
    []
  );

  /**
   * Update a single setting in database and localStorage
   */
  const updateSetting = useCallback(
    async (column, value) => {
      if (!user) return false;

      try {
        logger.debug('updateSetting', `Updating ${column} to ${value}`);

        const { error } = await supabase
          .from(DB_TABLES.settings)
          .update({ [column]: value, updated_at: new Date() })
          .eq('user_id', user.id);

        if (error) {
          logger.error('updateSetting', error);
          return false;
        }

        // Update localStorage
        setSetting(column, value);
        return true;
      } catch (error) {
        logger.error('updateSetting', error);
        return false;
      }
    },
    [user]
  );

  /**
   * Save all settings to database and localStorage
   */
  const saveAllSettings = useCallback(async () => {
    if (!user) return false;

    try {
      const settingsData = {
        displayName,
        uiScale,
        language,
        themeColor,
        customColor,
        themeMode,
        notificationsEnabled,
        autoSaveInterval
      };

      logger.debug('saveAllSettings', 'Saving all settings');

      // Save to localStorage
      saveToStorage(settingsData);

      // Save to Supabase
      const { error } = await supabase.from(DB_TABLES.settings).upsert(
        {
          user_id: user.id,
          ...settingsData,
          updated_at: new Date()
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        logger.error('saveAllSettings', error);
        return false;
      }

      logger.debug('saveAllSettings', 'All settings saved successfully');
      return true;
    } catch (error) {
      logger.error('saveAllSettings', error);
      return false;
    }
  }, [user, displayName, uiScale, language, themeColor, customColor, themeMode, notificationsEnabled, autoSaveInterval]);

  return {
    displayName,
    setDisplayName,
    uiScale,
    setUiScale,
    language,
    setLanguage,
    themeColor,
    setThemeColor,
    customColor,
    setCustomColor,
    themeMode,
    setThemeMode,
    notificationsEnabled,
    setNotificationsEnabled,
    autoSaveInterval,
    setAutoSaveInterval,
    fetchSettings,
    updateSetting,
    saveAllSettings
  };
};
