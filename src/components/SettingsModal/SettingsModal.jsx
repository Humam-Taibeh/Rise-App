/**
 * SettingsModal Component (Enhanced v9)
 * Unified theme design matching the entire application
 * Premium design with consistent blue theme throughout
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { useTheme } from '../../contexts/ThemeContext';
import { TRANSLATIONS } from '../../constants/translations.js';
import { DEFAULT_SETTINGS, DB_TABLES, THEME_MODES } from '../../constants/config.js';
import { createLogger } from '../../utils/logger.js';
import { saveAllSettings as saveToStorage, resetToDefaults } from '../../utils/storageManager.js';

const logger = createLogger('SettingsModal');

const SettingsModal = ({
  isOpen,
  onClose,
  userName,
  setUserName,
  uiScale,
  setUiScale,
  themeColor,
  setThemeColor,
  language,
  setLanguage,
  onLogout,
  customColor = DEFAULT_SETTINGS.customColor,
  setCustomColor,
  themeMode = 'dark',
  setThemeMode,
  notificationsEnabled = true,
  setNotificationsEnabled,
  autoSaveInterval = 30,
  setAutoSaveInterval
}) => {
  const translations = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('profile');
  const [hoveredTab, setHoveredTab] = useState(null);
  const { isDark, toggleTheme, setThemeMode: setAppThemeMode, syncAccent, theme: contextTheme } = useTheme();
  
  // Create unified theme object matching application theme
  const theme = {
    text: contextTheme.text,
    textSecondary: contextTheme.textSecondary,
    textTertiary: contextTheme.textSecondary,
    input: isDark ? 'bg-gray-800/60 border border-gray-600/40' : 'bg-white border border-gray-300',
    border: isDark ? 'border-blue-500/20' : 'border-blue-400/20',
    // Unified color palette based on application primary blue
    primary: isDark ? 'from-blue-600 to-blue-700' : 'from-blue-500 to-blue-600',
    primaryAccent: isDark ? 'bg-blue-500/25 border border-blue-500/60 text-blue-200 shadow-lg shadow-blue-500/20' : 'bg-blue-100 border border-blue-300 text-blue-700 shadow-lg shadow-blue-300/30',
    primaryInactive: isDark ? 'bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:border-slate-600' : 'bg-slate-100/80 border border-slate-300 text-slate-700 hover:bg-slate-200/60 hover:border-slate-400'
  };

  const handleSave = async () => {
    const settingsData = {
      displayName: userName,
      uiScale,
      themeColor,
      language,
      customColor,
      themeMode,
      notificationsEnabled,
      autoSaveInterval
    };

    saveToStorage(settingsData);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from(DB_TABLES.settings).upsert({
        user_id: user.id,
        ...settingsData,
        updated_at: new Date()
      }, { onConflict: 'user_id' });
    }
    onClose();
  };

  const handleReset = async () => {
    setUserName(DEFAULT_SETTINGS.displayName);
    setUiScale(DEFAULT_SETTINGS.uiScale);
    setThemeColor(DEFAULT_SETTINGS.themeColor);
    setLanguage(DEFAULT_SETTINGS.language);
    setCustomColor(DEFAULT_SETTINGS.customColor);
    setThemeMode(DEFAULT_SETTINGS.themeMode);
    setNotificationsEnabled(DEFAULT_SETTINGS.notificationsEnabled);
    setAutoSaveInterval(DEFAULT_SETTINGS.autoSaveInterval);
    resetToDefaults();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from(DB_TABLES.settings).update({
        ...DEFAULT_SETTINGS,
        updated_at: new Date()
      }).eq('user_id', user.id);
    }
    onClose();
    setTimeout(() => window.location.reload(), 100);
  };

  const updateSetting = async (column, value) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from(DB_TABLES.settings).update({ [column]: value }).eq('user_id', user.id);
    }

    saveToStorage({ [column]: value });

    if (column === 'themeColor' || column === 'customColor') {
      syncAccent();
    }
  };

  const handleThemeModeChange = async (mode) => { setThemeMode(mode); setAppThemeMode(mode); await updateSetting('themeMode', mode); };
  const handleNotificationsChange = async (enabled) => { setNotificationsEnabled(enabled); await updateSetting('notificationsEnabled', enabled); };
  const handleAutoSaveChange = async (interval) => { setAutoSaveInterval(interval); await updateSetting('autoSaveInterval', interval); };
  const handleLanguageChange = async (lang) => { setLanguage(lang); await updateSetting('language', lang); };
  const handleThemeColorSelect = async (color) => { setThemeColor(color); await updateSetting('themeColor', color); };
  const handleCustomColorApply = async (color) => { setThemeColor('custom'); setCustomColor(color); await updateSetting('themeColor', 'custom'); await updateSetting('customColor', color); };
  const handleUiScaleChange = async (scale) => { setUiScale(scale); await updateSetting('uiScale', scale); };

  const handleDataExport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const exportData = {
          exportDate: new Date().toISOString(),
          userId: user.id,
          userEmail: user.email,
          displayName: userName,
          settings: { themeMode, language, uiScale, notificationsEnabled, autoSaveInterval, themeColor }
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `glowup-backup-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      logger.error('handleDataExport', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤', color: 'from-blue-500 to-blue-600' },
    { id: 'appearance', label: 'Theme', icon: '✨', color: 'from-blue-500 to-blue-600' },
    { id: 'performance', label: 'Performance', icon: '⚡', color: 'from-blue-500 to-blue-600' },
    { id: 'backup', label: 'Backup', icon: '💾', color: 'from-blue-500 to-blue-600' }
  ];

  const tabVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-md"
          onClick={onClose}
          style={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.25)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="app-card-accent w-full max-w-2xl max-h-[84vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header with Background Animation */}
            <motion.div
              className="relative px-6 py-6 flex justify-between items-center border-b border-accent-subtle/30 overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <motion.div className="absolute inset-0 opacity-10" animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }} transition={{ duration: 10, repeat: Infinity }} style={{ backgroundSize: '200% 200%', backgroundImage: 'linear-gradient(135deg, rgb(var(--accent-main)), rgb(var(--accent-light)), rgb(var(--accent-main)))' }} />
              
              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 0.95, 1], y: [0, -6, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl filter drop-shadow-xl"
                >
                  ✨
                </motion.div>
                <div>
                  <motion.h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>Settings</motion.h2>
                  <motion.p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-widest" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>Personalize Your Experience</motion.p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                {/* Theme Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                  className="app-card-slim text-lg p-2 rounded-lg transition-all hover:bg-accent-main/10 border border-transparent hover:border-accent-subtle/30 text-yellow-400 dark:text-yellow-400"
                >
                  {isDark ? '☀️' : '🌙'}
                </motion.button>
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="app-card-slim text-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-lg transition-all flex-shrink-0 border border-transparent hover:border-accent-subtle/30"
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Tab Navigation */}
            <motion.div
              className="flex border-b border-accent-subtle/30 gap-1.5 px-3 py-3 app-card-slim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {tabs.map((tab, idx) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onHoverStart={() => setHoveredTab(tab.id)}
                  onHoverEnd={() => setHoveredTab(null)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.06 }}
                  className={`flex-1 relative px-2 py-3 rounded-xl font-bold transition-all group overflow-hidden border-2 ${
                    activeTab === tab.id
                      ? 'border-accent-main/50 bg-accent-main/10'
                      : 'border-slate-200/60 dark:border-slate-600/30 hover:border-accent-subtle/40 hover:bg-accent-main/5'
                  }`}
                >
                  {/* Background shimmer effect */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-5`}
                      transition={{ type: "spring", damping: 20 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <motion.div
                      animate={activeTab === tab.id ? { scale: 1.25, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="text-xl"
                    >
                      {tab.icon}
                    </motion.div>
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      activeTab === tab.id
                        ? 'text-accent-main'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {tab.label}
                    </span>
                  </div>
                  
                  {/* Glow effect for active tab */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="indicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-main/20 to-accent-light/20 blur-md"
                      animate={{ opacity: [0.1, 0.15, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Content Area with Scroll Indicator */}
            <div className="flex-1 overflow-y-auto relative group" style={{ height: '380px' }}>
              {/* Animated Scroll Indicator */}
              <motion.div
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full bg-accent-main/60`}
                    animate={{ y: [0, 4, 0], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 1.8, delay: i * 0.25, repeat: Infinity }}
                  />
                ))}
              </motion.div>

              <div className="px-7 py-7 space-y-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div key="profile" variants={tabVariants} initial="enter" animate="center" exit="exit" className="space-y-3.5">
                      {/* Profile Status Badge */}
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="app-card p-4 bg-accent-main/5 border-accent-subtle/30">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }} className="text-sm flex-shrink-0">✓</motion.div>
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Account Status</p>
                              <p className="text-xs text-slate-900 dark:text-white font-bold">Active & Synced</p>
                            </div>
                          </div>
                          <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 bg-accent-main/20 text-accent-main">
                            Live
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="app-card p-4 border-accent-subtle/30">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">👤 Display Name</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className={`w-full ${theme.input} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${themeMode === 'dark' ? 'focus:ring-blue-500/50 border-blue-500/40 shadow-lg shadow-blue-500/10' : 'focus:ring-blue-400/50 border-blue-300/60 shadow-md shadow-blue-200/20'} transition-all text-sm font-semibold border`}
                          placeholder="Enter your name"
                        />
                        <p className={`text-xs ${theme.textTertiary} mt-2 font-medium opacity-75`}>Used in daily greetings & progress tracking</p>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="app-card p-4 border-accent-subtle/30">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-2">🌐 Language</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[{ code: 'en', label: 'English', icon: '🇬🇧' }, { code: 'ar', label: 'العربية', icon: '🇸🇦' }].map((lang) => (
                            <motion.button key={lang.code} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleLanguageChange(lang.code)} className={`app-card-slim px-3 py-2.5 rounded-lg font-bold text-xs border-2 transition-all flex items-center justify-center gap-2 ${language === lang.code ? 'border-accent-main/50 bg-accent-main/10 text-accent-main' : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-accent-main/5 hover:border-accent-subtle/40'}`}>
                              <span className="text-base">{lang.icon}</span>
                              <span className="hidden sm:inline">{lang.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === 'appearance' && (
                    <motion.div key="appearance" variants={tabVariants} initial="enter" animate="center" exit="exit" className="space-y-3.5">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="app-card p-4 border-accent-subtle/30">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-2">🌓 Theme Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[{ mode: 'dark', label: 'Dark', icon: '🌙' }, { mode: 'light', label: 'Light', icon: '☀️' }].map((item) => (
                            <motion.button key={item.mode} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleThemeModeChange(item.mode)} className={`app-card-slim px-3 py-3 rounded-lg border-2 text-center transition-all ${themeMode === item.mode ? 'border-accent-main/50 bg-accent-main/10 text-accent-main' : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-accent-main/5 hover:border-accent-subtle/40'}`}>
                              <div className="text-lg">{item.icon}</div>
                              <div className="font-bold text-xs mt-0.5">{item.label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === 'performance' && (
                    <motion.div key="performance" variants={tabVariants} initial="enter" animate="center" exit="exit" className="space-y-3.5">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="app-card p-4 border-accent-subtle/30">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">📏 Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ scale: 'small', label: 'Compact', icon: '📱' }, { scale: 'medium', label: 'Default', icon: '💻' }, { scale: 'large', label: 'Spacious', icon: '🖥️' }].map((item) => (
                            <motion.button key={item.scale} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleUiScaleChange(item.scale)} className={`app-card-slim px-2 py-2.5 rounded-lg font-bold text-xs border-2 transition-all text-center ${uiScale === item.scale ? 'border-accent-main/50 bg-accent-main/10 text-accent-main' : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-accent-main/5 hover:border-accent-subtle/40'}`}>
                              <div className="text-sm">{item.icon}</div>
                              <div className="text-xs mt-0.5 font-black">{item.label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="app-card p-4 border-accent-subtle/30">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">🔔 Notifications</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[{ enabled: true, label: 'Enabled', icon: '✓' }, { enabled: false, label: 'Disabled', icon: '✕' }].map((item) => (
                            <motion.button key={item.enabled ? 'on' : 'off'} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleNotificationsChange(item.enabled)} className={`app-card-slim px-2 py-2.5 rounded-lg font-bold text-xs border-2 transition-all text-center ${notificationsEnabled === item.enabled ? 'border-accent-main/50 bg-accent-main/10 text-accent-main' : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-accent-main/5 hover:border-accent-subtle/40'}`}>
                              <div className="text-sm">{item.icon}</div>
                              <div className="font-bold text-xs mt-0.5">{item.label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="app-card p-4 border-accent-subtle/30">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">⏱️ Auto-Save</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ interval: 15, label: 'Fast', icon: '⚡', time: '15s' }, { interval: 30, label: 'Normal', icon: '✓', time: '30s' }, { interval: 60, label: 'Eco', icon: '🔋', time: '60s' }].map((item) => (
                            <motion.button key={item.interval} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleAutoSaveChange(item.interval)} className={`app-card-slim px-2 py-2.5 rounded-lg font-bold text-xs border-2 transition-all text-center ${autoSaveInterval === item.interval ? 'border-accent-main/50 bg-accent-main/10 text-accent-main' : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-accent-main/5 hover:border-accent-subtle/40'}`}>
                              <div className="text-sm">{item.icon}</div>
                              <div className="font-bold text-xs mt-0.5">{item.label}</div>
                              <div className="text-xs mt-0.5 opacity-70">{item.time}</div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === 'backup' && (
                    <motion.div key="backup" variants={tabVariants} initial="enter" animate="center" exit="exit" className="space-y-3.5">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="app-card p-4 bg-accent-main/5 border-accent-subtle/30">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">📥 Export Data</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium opacity-75">Download settings backup</p>
                        <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={handleDataExport} className="app-card-accent w-full px-3 py-2.5 rounded-lg font-bold text-xs transition-all">
                          ⬇️ Download
                        </motion.button>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="app-card p-4 border-slate-200/60 dark:border-slate-600/30">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">☁️ Cloud Sync</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium opacity-75">Auto-synced across devices</p>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="app-card p-4 bg-accent-main/5 border-accent-subtle/30">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">🔐 Security</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium opacity-75">End-to-end encrypted</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Settings Preview Card */}
            <motion.div
              className="border-t border-accent-subtle/30 px-6 py-3 grid grid-cols-3 gap-2 text-center app-card-slim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -2 }}
                className="p-3 rounded-lg transition-all border border-transparent hover:border-accent-subtle/40 bg-accent-main/5"
              >
                <div className="text-lg">🌓</div>
                <p className="text-xs font-bold mt-1 text-slate-500 dark:text-slate-400">{themeMode === 'dark' ? 'Dark' : 'Light'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                whileHover={{ y: -2 }}
                className="p-3 rounded-lg transition-all border border-transparent hover:border-accent-subtle/40 bg-accent-main/5"
              >
                <div className="text-lg">🔔</div>
                <p className="text-xs font-bold mt-1 text-slate-500 dark:text-slate-400">{notificationsEnabled ? 'On' : 'Off'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -2 }}
                className="p-3 rounded-lg transition-all border border-transparent hover:border-accent-subtle/40 bg-accent-main/5"
              >
                <div className="text-lg">🌐</div>
                <p className="text-xs font-bold mt-1 text-slate-500 dark:text-slate-400">{language === 'en' ? 'English' : 'العربية'}</p>
              </motion.div>
            </motion.div>

            {/* Premium Footer */}
            <motion.div
              className="border-t border-accent-subtle/30 px-6 py-4 flex gap-2 app-card-slim"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -3, boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="app-card-accent flex-1 px-3 py-2.5 rounded-lg font-bold text-xs transition-all shadow-lg border-2 border-transparent"
              >
                ✓ Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="app-card-slim px-3 py-2.5 rounded-lg font-bold text-xs transition-all border-2 shadow-lg border-accent-subtle/30 text-accent-main hover:bg-accent-main/5"
              >
                ↺ Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="app-card-slim px-3 py-2.5 rounded-lg font-bold text-xs transition-all border-2 shadow-lg border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                🚪 Logout
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
