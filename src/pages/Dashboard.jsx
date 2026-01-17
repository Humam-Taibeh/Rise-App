/**
 * Dashboard Page (Refactored)
 * Main application interface with tasks, settings, and streak management
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ParticlesBackground from '../components/ParticlesBackground';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import TaskGrid from '../components/TaskGrid';
import StreakModal from '../components/StreakModal';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import AddTaskModal from '../components/AddTaskModal';
import TaskAnalyticsDashboard from '../components/TaskAnalyticsDashboard';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../hooks/useTasks';
import { useSettings } from '../hooks/useSettings';
import { useStreak } from '../hooks/useStreak';
import { DEFAULT_SETTINGS, THEME_COLORS, THEME_MODES, ANIMATIONS, APP_INFO } from '../constants/config.js';
import { getGreetingPhrase } from '../constants/translations.js';
import { getLevelByStreak } from '../utils/levelUtils.js';
import { getAllSizes } from '../utils/sizeUtils.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Dashboard');

const Dashboard = ({ user }) => {
  logger.debug('Dashboard', 'Rendering with user:', user?.id);

  // Theme hook
  const { isDark, setThemeMode: setAppThemeMode, syncAccent, theme } = useTheme();

  // Import hooks
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTasks(user);
  const {
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
    saveAllSettings
  } = useSettings(user);
  const { streak, streakRecoveryAvailable } = useStreak(user);

  // Modal states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load user data on mount
  useEffect(() => {
    if (user) {
      logger.debug('Dashboard', 'User changed, loading data');
      fetchTasks(user.id);
      fetchSettings(user.id);
    }
  }, [user, fetchTasks, fetchSettings]);

  // Event Handlers
  const handleLogout = async () => {
    logger.debug('Dashboard', 'Logging out user');
    localStorage.clear();
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleAddTask = async (title, emoji, timeslot, category, priority) => {
    await addTask(title, emoji, timeslot, category, priority);
  };

  const handleUpdateTask = async (taskId, updates) => {
    await updateTask(taskId, updates);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleSaveSettings = async () => {
    await saveAllSettings();
    setSettingsOpen(false);
  };

  // Safe defaults for undefined values during loading
  const safeThemeColor = themeColor || DEFAULT_SETTINGS.themeColor;
  const safeLanguage = language || DEFAULT_SETTINGS.language;
  const safeUiScale = uiScale || DEFAULT_SETTINGS.uiScale;
  const safeDisplayName = displayName || DEFAULT_SETTINGS.displayName;
  const safeStreak = streak || 0;
  const safeCustomColor = customColor || DEFAULT_SETTINGS.customColor;
  const safeThemeMode = themeMode || DEFAULT_SETTINGS.themeMode;
  const safeNotificationsEnabled = notificationsEnabled !== undefined ? notificationsEnabled : DEFAULT_SETTINGS.notificationsEnabled;
  const safeAutoSaveInterval = autoSaveInterval || DEFAULT_SETTINGS.autoSaveInterval;

  useEffect(() => {
    setAppThemeMode(safeThemeMode);
  }, [safeThemeMode, setAppThemeMode]);

  useEffect(() => {
    syncAccent();
  }, [safeThemeColor, safeCustomColor, syncAccent]);

  // Filter tasks based on active filters
  const getFilteredTasks = () => {
    let filtered = tasks || [];

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      filtered = filtered.filter(t => (t.title || '').toLowerCase().includes(normalizedQuery));
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Time slot filter
    if (timeFilter !== 'all') {
      filtered = filtered.filter(t => t.timeslot === timeFilter);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Calculate progress percentage
  const progress =
    tasks?.length > 0
      ? Math.round(((tasks?.filter(t => t.status === 'completed') || []).length / tasks?.length) * 100)
      : 0;

  // Get level and theme data
  const currentLevel = getLevelByStreak(safeStreak);
  const currentPhrase = getGreetingPhrase(safeLanguage, safeDisplayName);
  const currentTheme = THEME_COLORS[safeThemeColor] || THEME_COLORS.red;
  const currentSize = getAllSizes(safeUiScale);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please log in to continue.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{
          '--accent-color': currentTheme.primary,
          '--accent-glow': currentTheme.glow,
          backgroundColor: theme.background,
          color: theme.text,
          background: isDark
            ? 'radial-gradient(circle at bottom right, rgb(var(--accent-main) / 0.10) 0%, #000000 75%)'
            : 'radial-gradient(circle at top left, rgb(var(--accent-main) / 0.10) 0%, transparent 55%), radial-gradient(circle at bottom right, rgb(var(--accent-main) / 0.08) 0%, transparent 45%), linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 45%, var(--bg-tertiary) 100%)'
        }}
      >
        <ParticlesBackground dimRed={true} themeColor={safeThemeColor} intense={true} />

        {/* Header */}
        <DashboardHeader
          currentSize={currentSize}
          currentPhrase={currentPhrase}
          progress={progress}
          streak={safeStreak}
          currentLevel={currentLevel}
          onSettingsClick={() => setSettingsOpen(true)}
          onStreakClick={() => setStreakModalOpen(true)}
          onPerformanceClick={() => {}}
          currentTheme={currentTheme}
        />

        {/* Main Content */}
        <div className="flex-grow px-6 py-8" dir={safeLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {/* Top Control Bar */}
          <div className="flex items-center justify-between mb-8 gap-4">
            {/* Add Task Button - Primary Action */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddTaskModalOpen(true)}
              className="app-card-accent px-6 py-3 bg-gradient-to-r from-accent-main to-accent-dark hover:from-accent-light hover:to-accent-main text-white font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:shadow-accent-main/25 border border-accent-subtle/30"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </motion.button>

            {/* Control Buttons - Compact */}
            <div className="flex items-center gap-3">
              {/* Analytics Toggle */}
              <motion.button
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`app-card-slim px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${
                  showAnalytics
                    ? 'bg-accent-main/10 border-accent-main/40 text-accent-main shadow-lg shadow-accent-main/20'
                    : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                Analytics
              </motion.button>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`app-card-slim px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/20'
                    : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">🔍</span>
                Filters
              </motion.button>
            </div>
          </div>

          {/* Filters Section - Glass Premium */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="mb-8 p-6 app-card bg-gradient-to-br from-accent-main/5 via-transparent to-accent-light/5 border-accent-subtle/30"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">🔎</span>
                    <h4 className="text-sm font-bold text-accent-main">Search</h4>
                  </div>
                  <div className="app-card-slim flex items-center gap-3 px-4 py-3 border-accent-subtle/30">
                    <Search className="w-4 h-4 text-accent-main" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={safeLanguage === 'ar' ? 'ابحث عن مهمة...' : 'Search tasks...'}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">🎯</span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Task Status</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { value: 'all', label: 'All Status', emoji: '📋' },
                      { value: 'completed', label: 'Completed', emoji: '✅' },
                      { value: 'processing', label: 'In Progress', emoji: '⏳' },
                      { value: 'missed', label: 'Missed', emoji: '❌' }
                    ].map((item) => (
                      <motion.button
                        key={item.value}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStatusFilter(item.value)}
                        className={`app-card-slim px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          statusFilter === item.value
                            ? 'bg-purple-500/15 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-lg shadow-purple-500/20'
                            : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/40'
                        }`}
                      >
                        <span className="group-hover:scale-110 transition-transform">{item.emoji}</span>
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">🏷️</span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Categories</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { value: 'all', label: 'All Categories', emoji: '📦' },
                      { value: 'work', label: 'Work', emoji: '💼' },
                      { value: 'personal', label: 'Personal', emoji: '🎯' },
                      { value: 'health', label: 'Health', emoji: '🏃' },
                      { value: 'learning', label: 'Learning', emoji: '📚' },
                      { value: 'social', label: 'Social', emoji: '👥' },
                      { value: 'finance', label: 'Finance', emoji: '💰' },
                      { value: 'other', label: 'Other', emoji: '✨' }
                    ].map((item) => (
                      <motion.button
                        key={item.value}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategoryFilter(item.value)}
                        className={`app-card-slim px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          categoryFilter === item.value
                            ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/20'
                            : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/40'
                        }`}
                      >
                        <span className="group-hover:scale-110 transition-transform">{item.emoji}</span>
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Filter */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">⏰</span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Time Slot</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    {[
                      { value: 'all', label: 'All Times', emoji: '🔄' },
                      { value: 'morning', label: 'Morning', emoji: '🌅' },
                      { value: 'daytime', label: 'Daytime', emoji: '☀️' },
                      { value: 'night', label: 'Night', emoji: '🌙' },
                      { value: 'all', label: 'All Day', emoji: '📅' }
                    ].map((item) => (
                      <motion.button
                        key={`${item.value}-${item.emoji}`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimeFilter(item.value)}
                        className={`app-card-slim px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          timeFilter === item.value
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-lg shadow-amber-500/20'
                            : 'border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/40'
                        }`}
                      >
                        <span className="group-hover:scale-110 transition-transform">{item.emoji}</span>
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setTimeFilter('all');
                    setSearchQuery('');
                  }}
                  className="app-card-slim mt-5 w-full px-4 py-2 text-xs font-bold transition-all border-slate-200/60 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-500"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task Analytics Dashboard - Only show when explicitly toggled */}
          <AnimatePresence>
            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <TaskAnalyticsDashboard tasks={tasks} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tasks Section with Better Spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filter Info */}
            {(statusFilter !== 'all' || categoryFilter !== 'all' || timeFilter !== 'all' || searchQuery.trim()) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 app-card-slim bg-accent-main/5 border-accent-subtle/30 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-accent-main">
                  Showing {filteredTasks.length} of {tasks?.length || 0} tasks
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setTimeFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-accent-main hover:text-accent-dark underline"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
            <TaskGrid
              tasks={filteredTasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              language={safeLanguage}
              currentSize={currentSize}
            />
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-[2200px] mx-auto px-6 pb-6 mt-auto flex justify-between items-center" style={{ color: theme.textSecondary }}>
          <span className={`opacity-40 text-[10px]`}>Status: {APP_INFO.status}</span>
          <span className={`opacity-40 text-[10px]`}>Designed by {APP_INFO.author}</span>
          <span className={`opacity-40 text-[10px]`}>© {APP_INFO.year} {APP_INFO.name} | Built for Greatness</span>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userName={safeDisplayName}
        setUserName={setDisplayName}
        uiScale={safeUiScale}
        setUiScale={setUiScale}
        themeColor={safeThemeColor}
        setThemeColor={setThemeColor}
        language={safeLanguage}
        setLanguage={setLanguage}
        onSave={handleSaveSettings}
        onLogout={handleLogout}
        customColor={safeCustomColor}
        setCustomColor={setCustomColor}
        themeMode={safeThemeMode}
        setThemeMode={setThemeMode}
        notificationsEnabled={safeNotificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        autoSaveInterval={safeAutoSaveInterval}
        setAutoSaveInterval={setAutoSaveInterval}
      />

      {/* Streak Modal */}
      <StreakModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        streak={safeStreak}
        displayName={safeDisplayName}
        streakRecoveryAvailable={streakRecoveryAvailable || false}
        language={safeLanguage}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        language={safeLanguage}
      />
    </>
  );
};

export default Dashboard;
