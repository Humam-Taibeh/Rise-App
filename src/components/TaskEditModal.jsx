/**
 * Task Edit Modal Component
 * Professional modal for editing task details
 * Optimized layout and sizing
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../constants/config.js';
import { createLogger } from '../utils/logger.js';
import { useTheme } from '../contexts/ThemeContext';

const logger = createLogger('TaskEditModal');

const TaskEditModal = ({
  isOpen,
  task,
  onClose,
  onSave
}) => {
  const { isDark } = useTheme();
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editEmoji, setEditEmoji] = useState(task?.emoji || '✨');
  const [editCategory, setEditCategory] = useState(task?.category || 'work');
  const [editPriority, setEditPriority] = useState(task?.priority || 'medium');
  const [editTimeslot, setEditTimeslot] = useState(task?.timeslot || 'morning');
  const [editStatus, setEditStatus] = useState(task?.status || 'processing');
  const [isSaving, setIsSaving] = useState(false);

  const statusConfig = {
    completed: {
      color: isDark ? 'bg-green-500/20' : 'bg-green-100',
      border: isDark ? 'border-green-500/30' : 'border-green-300',
      badge: isDark ? 'bg-green-500/30 text-green-300' : 'bg-green-200 text-green-800',
      icon: '✅',
      label: 'Completed'
    },
    processing: {
      color: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      border: isDark ? 'border-blue-500/30' : 'border-blue-300',
      badge: isDark ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-800',
      icon: '⏳',
      label: 'In Progress'
    },
    missed: {
      color: isDark ? 'bg-red-500/20' : 'bg-red-100',
      border: isDark ? 'border-red-500/30' : 'border-red-300',
      badge: isDark ? 'bg-red-500/30 text-red-300' : 'bg-red-200 text-red-800',
      icon: '❌',
      label: 'Missed'
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      logger.warn('TaskEditModal', 'Task title cannot be empty');
      return;
    }

    setIsSaving(true);
    logger.debug('TaskEditModal', 'Saving task changes');

    try {
      await onSave({
        title: editTitle,
        emoji: editEmoji,
        category: editCategory,
        priority: editPriority,
        timeslot: editTimeslot,
        status: editStatus
      });
      onClose();
    } catch (error) {
      logger.error('TaskEditModal', 'Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setEditTitle(task?.title || '');
    setEditEmoji(task?.emoji || '✨');
    setEditCategory(task?.category || 'work');
    setEditPriority(task?.priority || 'medium');
    setEditTimeslot(task?.timeslot || 'morning');
    setEditStatus(task?.status || 'processing');
    onClose();
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className={`fixed inset-0 backdrop-blur-md z-40 ${isDark ? 'bg-black/70' : 'bg-black/30'}`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className={`backdrop-blur-2xl rounded-3xl shadow-2xl w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto border ${
              isDark
                ? 'bg-gradient-to-br from-black/97 via-slate-900/95 to-black/97 border-blue-500/30'
                : 'bg-gradient-to-br from-white/97 via-slate-50/95 to-white/97 border-slate-200/80'
            }`}>
              <div className={`absolute inset-0 rounded-3xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-white/3 via-transparent to-white/0' : 'bg-gradient-to-br from-black/4 via-transparent to-black/0'}`} />
              
              {/* Header */}
              <div className={`sticky top-0 flex items-center justify-between px-8 py-6 border-b backdrop-blur-xl z-10 ${
                isDark
                  ? 'border-blue-500/20 bg-black/80'
                  : 'border-slate-200 bg-white/80'
              }`}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    className="text-3xl"
                  >
                    {editEmoji}
                  </motion.span>
                  <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Task</h2>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className={`p-3 rounded-3xl transition-all duration-200 border shadow-lg ${
                    isDark
                      ? 'hover:bg-blue-500/25 border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/20'
                      : 'hover:bg-slate-200/70 border-slate-300 hover:border-slate-400 hover:shadow-black/10'
                  }`}
                >
                  <X className={`w-6 h-6 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-slate-700 hover:text-slate-900'}`} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 relative z-10">
                {/* Title & Emoji Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-5 gap-4"
                >
                  <div className="col-span-4">
                    <label className={`block text-sm font-bold mb-3 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>📝 Task Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title..."
                      className={`w-full px-5 py-3.5 rounded-3xl text-base focus:outline-none focus:ring-2 transition-all shadow-lg font-medium ${
                        isDark
                          ? 'bg-gray-800/60 border border-gray-600/40 hover:border-gray-500/60 text-white placeholder-gray-500/80 focus:ring-blue-500/30 focus:shadow-blue-500/20'
                          : 'bg-white/80 border border-slate-300 hover:border-slate-400 text-slate-900 placeholder-slate-500 focus:ring-black/10 focus:shadow-black/10'
                      }`}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-bold mb-3 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>✨ Emoji</label>
                    <input
                      type="text"
                      value={editEmoji}
                      onChange={(e) => setEditEmoji(e.target.value.slice(0, 2))}
                      maxLength="2"
                      className={`w-full px-5 py-3.5 rounded-3xl text-3xl text-center focus:outline-none focus:ring-2 transition-all shadow-lg ${
                        isDark
                          ? 'bg-gray-800/60 border border-gray-600/40 hover:border-gray-500/60 text-white placeholder-gray-500/80 focus:ring-blue-500/30 focus:shadow-blue-500/20'
                          : 'bg-white/80 border border-slate-300 hover:border-slate-400 text-slate-900 placeholder-slate-500 focus:ring-black/10 focus:shadow-black/10'
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Status Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className={`block text-sm font-bold mb-4 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>📊 Status</label>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => setEditStatus(key)}
                        className={`px-4 py-3.5 rounded-3xl text-xs font-bold transition-all border-2 flex flex-col items-center gap-2 ${
                          editStatus === key
                            ? `${config.badge} border-current shadow-lg`
                            : isDark
                              ? 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600/70'
                              : 'bg-white/80 border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="text-2xl">{config.icon}</div>
                        <div className="text-xs leading-tight">{config.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Category Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className={`block text-sm font-bold mb-4 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>📂 Category</label>
                  <div className="grid grid-cols-6 gap-3">
                    {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => setEditCategory(key)}
                        className={`px-4 py-3.5 rounded-3xl text-xs font-bold transition-all border-2 flex flex-col items-center gap-2 ${
                          editCategory === key
                            ? isDark
                              ? 'bg-blue-500/30 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/20'
                              : 'bg-slate-900 border-slate-700 text-white shadow-lg shadow-black/10'
                            : isDark
                              ? 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600/70'
                              : 'bg-white/80 border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="text-xl">{category.emoji}</div>
                        <div className="text-xs leading-tight">{category.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Priority Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className={`block text-sm font-bold mb-4 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>⚡ Priority</label>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(TASK_PRIORITIES).map(([key, priority]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => setEditPriority(key)}
                        className="px-4 py-3.5 rounded-3xl text-xs font-bold transition-all border-2 flex flex-col items-center gap-2"
                        style={{
                          backgroundColor: editPriority === key ? `${priority.color}40` : (isDark ? 'rgba(107, 114, 128, 0.1)' : 'rgba(255, 255, 255, 0.85)'),
                          borderColor: editPriority === key ? priority.color : (isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(203, 213, 225, 1)'),
                          color: editPriority === key ? priority.color : (isDark ? 'rgb(156, 163, 175)' : 'rgb(51, 65, 85)'),
                          boxShadow: editPriority === key ? `0 8px 16px ${priority.color}30` : 'none'
                        }}
                      >
                        <div className="text-xl">{priority.emoji}</div>
                        <div className="text-xs leading-tight">{priority.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Time Slot Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className={`block text-sm font-bold mb-4 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>🕐 Time Slot</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: 'morning', label: 'Morning', emoji: '🌅' },
                      { value: 'daytime', label: 'Daytime', emoji: '☀️' },
                      { value: 'night', label: 'Night', emoji: '🌙' },
                      { value: 'all', label: 'All Day', emoji: '🔄' }
                    ].map(slot => (
                      <motion.button
                        key={slot.value}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => setEditTimeslot(slot.value)}
                        className={`px-4 py-3.5 rounded-3xl text-xs font-bold transition-all border-2 flex flex-col items-center gap-2 ${
                          editTimeslot === slot.value
                            ? isDark
                              ? 'bg-purple-500/30 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/20'
                              : 'bg-slate-900 border-slate-700 text-white shadow-lg shadow-black/10'
                            : isDark
                              ? 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600/70'
                              : 'bg-white/80 border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="text-xl">{slot.emoji}</div>
                        <div className="text-xs leading-tight">{slot.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-4 pt-6 border-t ${isDark ? 'border-blue-500/20' : 'border-slate-200'}`}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={handleClose}
                    disabled={isSaving}
                    className={`flex-1 px-6 py-4 rounded-3xl font-bold text-base transition-all disabled:opacity-50 shadow-lg tracking-wide border ${
                      isDark
                        ? 'bg-gray-700/40 hover:bg-gray-600/50 border-gray-600/40 hover:border-gray-500/60 text-white hover:shadow-gray-900/30'
                        : 'bg-white/80 hover:bg-white border-slate-300 hover:border-slate-400 text-slate-900 hover:shadow-black/10'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={handleSave}
                    disabled={isSaving || !editTitle.trim()}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-3xl text-white font-bold text-base transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center gap-2.5 tracking-wide"
                  >
                    <Check className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskEditModal;
