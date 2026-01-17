/**
 * Application-wide configuration and defaults
 * Centralized source of truth for all app constants
 */

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================
export const DEFAULT_SETTINGS = {
  displayName: 'User',
  uiScale: 'medium',
  language: 'en',
  themeColor: 'blue',
  customColor: '#2563eb',
  themeMode: 'dark',
  notificationsEnabled: true,
  autoSaveInterval: 30,
  privacyLevel: 'private',
  dataBackup: true
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================
export const THEME_COLORS = {
  red: { primary: '#dc2626', glow: 'rgba(220, 38, 38, 0.4)', rgb: '220 38 38' },
  purple: { primary: '#9333ea', glow: 'rgba(147, 51, 234, 0.4)', rgb: '147 51 234' },
  blue: { primary: '#2563eb', glow: 'rgba(37, 99, 235, 0.4)', rgb: '37 99 235' },
  orange: { primary: '#ea580c', glow: 'rgba(234, 88, 12, 0.4)', rgb: '234 88 12' },
  green: { primary: '#16a34a', glow: 'rgba(22, 163, 74, 0.4)', rgb: '22 163 74' },
  pink: { primary: '#db2777', glow: 'rgba(219, 39, 119, 0.4)', rgb: '219 39 119' },
  cyan: { primary: '#0891b2', glow: 'rgba(8, 145, 178, 0.4)', rgb: '8 145 178' },
  indigo: { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', rgb: '99 102 241' }
};

// ============================================================================
// THEME MODE CONFIGURATION (Light/Dark)
// ============================================================================
export const THEME_MODES = {
  dark: {
    background: 'bg-black',
    backgroundGradient: 'from-black via-slate-950 to-black',
    surface: 'bg-slate-900/50',
    surfaceHover: 'bg-slate-800/60',
    border: 'border-blue-500/20',
    borderHover: 'border-blue-500/30',
    text: 'text-white',
    textSecondary: 'text-gray-100',
    textTertiary: 'text-gray-400',
    input: 'bg-slate-900/60 hover:bg-slate-900/80 border-blue-500/30 text-white placeholder-gray-500',
    button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30',
    cardBg: 'bg-gradient-to-br from-slate-900/40 via-blue-950/20 to-black',
    accentBg: 'bg-blue-500/15',
    accentBorder: 'border-blue-500/40'
  },
  light: {
    background: 'bg-gradient-to-br from-white via-blue-50 to-slate-50',
    backgroundGradient: 'from-white via-blue-50 to-slate-50',
    surface: 'bg-white',
    surfaceHover: 'bg-blue-50/60',
    border: 'border-blue-200/60',
    borderHover: 'border-blue-300/80',
    text: 'text-slate-900',
    textSecondary: 'text-slate-800',
    textTertiary: 'text-slate-600',
    input: 'bg-white border-blue-200/60 text-slate-900 placeholder-slate-500 hover:border-blue-300',
    button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-400/30',
    cardBg: 'bg-gradient-to-br from-white via-blue-50/40 to-slate-50',
    accentBg: 'bg-blue-100/60',
    accentBorder: 'border-blue-300/60'
  }
};

// ============================================================================
// UI SCALE CONFIGURATION
// ============================================================================
export const UI_SIZES = {
  small: {
    logo: 'text-2xl',
    greeting: 'text-lg',
    container: 'pt-4 pb-4 pl-8 pr-8'
  },
  medium: {
    logo: 'text-5xl',
    greeting: 'text-2xl',
    container: 'pt-4 pb-8 pl-8 pr-8'
  },
  large: {
    logo: 'text-6xl',
    greeting: 'text-4xl',
    container: 'pt-6 pb-12 pl-12 pr-12'
  }
};

// ============================================================================
// LEVEL SYSTEM CONFIGURATION
// ============================================================================
export const LEVEL_CONFIG = [
  { minStreak: 50, level: 4, name: 'The Beast', color: 'text-red-500', icon: '💀' },
  { minStreak: 22, level: 3, name: 'The Legend', color: 'text-purple-500', icon: '👑' },
  { minStreak: 8, level: 2, name: 'The Focus', color: 'text-blue-500', icon: '🎯' },
  { minStreak: 0, level: 1, name: 'The Flame', color: 'text-orange-500', icon: '🔥' }
];

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATIONS = {
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  cardScale: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 }
  },
  greetingText: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.8, delay: 0.2 }
  }
};

// ============================================================================
// STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  displayName: 'displayName',
  uiScale: 'uiScale',
  language: 'language',
  themeColor: 'themeColor',
  customColor: 'customColor',
  themeMode: 'themeMode',
  notificationsEnabled: 'notificationsEnabled',
  autoSaveInterval: 'autoSaveInterval'
};

// ============================================================================
// DATABASE TABLE NAMES
// ============================================================================
export const DB_TABLES = {
  tasks: 'tasks',
  settings: 'user_settings',
  profiles: 'profiles'
};

// ============================================================================
// TASK CONFIGURATION
// ============================================================================
export const TASK_CONFIG = {
  defaultStatus: 'default',
  statuses: ['default', 'in-progress', 'completed'],
  defaultTimeslot: 'morning'
};

// ============================================================================
// TASK CATEGORIES
// ============================================================================
export const TASK_CATEGORIES = {
  work: { label: 'Work', emoji: '💼', color: '#3b82f6' },
  health: { label: 'Health', emoji: '💪', color: '#10b981' },
  learning: { label: 'Learning', emoji: '📚', color: '#f59e0b' },
  personal: { label: 'Personal', emoji: '🎯', color: '#8b5cf6' },
  other: { label: 'Other', emoji: '✨', color: '#6b7280' }
};

// ============================================================================
// TASK PRIORITIES
// ============================================================================
export const TASK_PRIORITIES = {
  high: { label: 'High', emoji: '🔴', value: 3, color: '#ef4444' },
  medium: { label: 'Medium', emoji: '🟡', value: 2, color: '#f59e0b' },
  low: { label: 'Low', emoji: '🟢', value: 1, color: '#10b981' }
};

// ============================================================================
// QUICK TASK TEMPLATES
// ============================================================================
export const QUICK_TASK_TEMPLATES = [
  { title: 'Review Code', emoji: '👀', category: 'work', priority: 'medium' },
  { title: 'Exercise', emoji: '🏃', category: 'health', priority: 'high' },
  { title: 'Read Article', emoji: '📖', category: 'learning', priority: 'low' },
  { title: 'Team Meeting', emoji: '👥', category: 'work', priority: 'high' },
  { title: 'Meditation', emoji: '🧘', category: 'health', priority: 'medium' },
  { title: 'Side Project', emoji: '🚀', category: 'learning', priority: 'medium' },
  { title: 'Grocery Shopping', emoji: '🛒', category: 'personal', priority: 'low' },
  { title: 'Family Time', emoji: '👨‍👩‍👧', category: 'personal', priority: 'high' }
];

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const DEBUG = false; // Set to true for development console logs

// ============================================================================
// APP METADATA
// ============================================================================
export const APP_INFO = {
  name: 'Rise',
  version: '1.0.0',
  author: 'Humam Taibeh',
  year: 2026,
  status: 'Evolutionary Mode'
};
