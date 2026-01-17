/**
 * Add Task Modal Component
 * Elegant and professional task creation interface
 * Supports categories, priorities, and quick templates
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { TASK_CATEGORIES, TASK_PRIORITIES, QUICK_TASK_TEMPLATES } from '../constants/config.js';
import { createLogger } from '../utils/logger.js';
import { useTheme } from '../contexts/ThemeContext';

const logger = createLogger('AddTaskModal');

const AddTaskModal = ({ isOpen, onClose, onAddTask, language }) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState('method'); // method, template, custom
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedTimeslot, setSelectedTimeslot] = useState('morning');

  const handleQuickTemplate = (template) => {
    setTaskTitle(template.title);
    setSelectedEmoji(template.emoji);
    setSelectedCategory(template.category);
    setSelectedPriority(template.priority);
    setStep('custom');
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      logger.warn('AddTaskModal', 'Task title is empty');
      return;
    }

    const newTask = {
      title: taskTitle,
      emoji: selectedEmoji,
      category: selectedCategory,
      priority: selectedPriority,
      timeslot: selectedTimeslot
    };

    logger.debug('AddTaskModal', 'Creating task:', newTask);
    await onAddTask(newTask.title, newTask.emoji, newTask.timeslot, newTask.category, newTask.priority);

    // Reset form
    setTaskTitle('');
    setSelectedEmoji('✨');
    setSelectedCategory('work');
    setSelectedPriority('medium');
    setSelectedTimeslot('morning');
    setStep('method');
    onClose();
  };

  const handleClose = () => {
    setStep('method');
    setTaskTitle('');
    setSelectedEmoji('✨');
    setSelectedCategory('work');
    setSelectedPriority('medium');
    setSelectedTimeslot('morning');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className={`fixed inset-0 backdrop-blur-sm z-40 ${isDark ? 'bg-black/60' : 'bg-black/30'}`}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className={`backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${
              isDark
                ? 'bg-gradient-to-br from-black/95 via-slate-900/90 to-black/95 border-blue-500/30'
                : 'bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 border-slate-200/80'
            }`}>
              <div className={`absolute inset-0 rounded-3xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-white/5 via-transparent to-white/0' : 'bg-gradient-to-br from-black/5 via-transparent to-black/0'}`} />
              
              {/* Header */}
              <div className={`sticky top-0 flex items-center justify-between p-8 border-b backdrop-blur-xl z-10 ${
                isDark
                  ? 'border-blue-500/20 bg-black/70'
                  : 'border-slate-200 bg-white/70'
              }`}>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  {step === 'method' && '✨ Create Task'}
                  {step === 'template' && '⚡ Quick Templates'}
                  {step === 'custom' && '🎨 Customize Task'}
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className={`p-3 rounded-full transition-all duration-200 border shadow-lg ${
                    isDark
                      ? 'hover:bg-blue-500/25 border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/20'
                      : 'hover:bg-slate-200/70 border-slate-300 hover:border-slate-400 hover:shadow-black/10'
                  }`}
                >
                  <X className={`w-6 h-6 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-slate-700 hover:text-slate-900'}`} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-8 relative">
                <AnimatePresence mode="wait">
                  {/* Step 1: Choose Method */}
                  {step === 'method' && (
                    <motion.div
                      key="method"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <p className={`mb-8 text-lg font-medium tracking-wide ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>How would you like to create your task?</p>

                      <motion.button
                        whileHover={{ scale: 1.03, x: 8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('template')}
                        className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all shadow-lg border ${
                          isDark
                            ? 'bg-gradient-to-br from-blue-500/25 to-blue-600/25 hover:from-blue-500/35 hover:to-blue-600/35 border-blue-500/50 hover:border-blue-400/80 hover:shadow-blue-500/25'
                            : 'bg-gradient-to-br from-white to-blue-50/60 hover:from-blue-50 hover:to-blue-100/60 border-slate-200 hover:border-blue-200 hover:shadow-black/10'
                        }`}
                      >
                        <div className="text-left">
                          <p className={`font-bold text-lg tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>⚡ Quick Templates</p>
                          <p className={`text-sm mt-1 ${isDark ? 'text-blue-200/80' : 'text-slate-600'}`}>Choose from pre-made, optimized tasks</p>
                        </div>
                        <ChevronRight className={`w-6 h-6 ${isDark ? 'text-blue-300' : 'text-slate-700'}`} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03, x: 8, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.15)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('custom')}
                        className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all shadow-lg border ${
                          isDark
                            ? 'bg-gradient-to-br from-purple-500/25 to-purple-600/25 hover:from-purple-500/35 hover:to-purple-600/35 border-purple-500/50 hover:border-purple-400/80 hover:shadow-purple-500/25'
                            : 'bg-gradient-to-br from-white to-purple-50/60 hover:from-purple-50 hover:to-purple-100/60 border-slate-200 hover:border-purple-200 hover:shadow-black/10'
                        }`}
                      >
                        <div className="text-left">
                          <p className={`font-bold text-lg tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>🎨 Custom Task</p>
                          <p className={`text-sm mt-1 ${isDark ? 'text-purple-200/80' : 'text-slate-600'}`}>Create and customize from scratch</p>
                        </div>
                        <ChevronRight className={`w-6 h-6 ${isDark ? 'text-purple-300' : 'text-slate-700'}`} />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 2: Quick Templates */}
                  {step === 'template' && (
                    <motion.div
                      key="template"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <motion.button
                        whileHover={{ x: -4 }}
                        onClick={() => setStep('method')}
                        className={`text-sm transition-colors font-medium flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-blue-300' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        ← Back
                      </motion.button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {QUICK_TASK_TEMPLATES.map((template, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.08, y: -4, boxShadow: '0 16px 32px rgba(0, 0, 0, 0.4)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleQuickTemplate(template)}
                            className={`p-5 rounded-2xl transition-all text-left shadow-lg border ${
                              isDark
                                ? 'bg-gradient-to-br from-gray-800/60 via-gray-900/50 to-gray-900/60 hover:from-gray-700/80 hover:to-gray-800/70 border-gray-600/40 hover:border-gray-500/70 hover:shadow-gray-900/50'
                                : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200 hover:border-slate-300 hover:shadow-black/10'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <motion.span
                                whileHover={{ scale: 1.2, rotate: 8 }}
                                className="text-3xl flex-shrink-0"
                              >
                                {template.emoji}
                              </motion.span>
                              <div className="flex-1 min-w-0">
                                <p className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{template.title}</p>
                                <p className={`text-xs mt-1.5 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                                  {TASK_CATEGORIES[template.category].emoji} {TASK_CATEGORIES[template.category].label}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Customize Task */}
                  {step === 'custom' && (
                    <motion.div
                      key="custom"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-7"
                    >
                      {step === 'custom' && step !== 'template' && (
                        <motion.button
                          whileHover={{ x: -4 }}
                          onClick={() => setStep('method')}
                          className={`text-sm transition-colors font-medium flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-blue-300' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          ← Back
                        </motion.button>
                      )}

                      {/* Task Title */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <label className={`block text-sm font-bold mb-3 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>📝 Task Title</label>
                        <input
                          type="text"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="What do you want to accomplish?"
                          className={`w-full px-5 py-3.5 rounded-3xl text-base focus:outline-none focus:ring-2 transition-all shadow-lg font-medium ${
                            isDark
                              ? 'bg-gray-800/60 border border-gray-600/40 hover:border-gray-500/60 text-white placeholder-gray-500/80 focus:ring-blue-500/30 focus:shadow-blue-500/20'
                              : 'bg-white/80 border border-slate-300 hover:border-slate-400 text-slate-900 placeholder-slate-500 focus:ring-black/10 focus:shadow-black/10'
                          }`}
                          autoFocus
                        />
                      </motion.div>

                      {/* Emoji Picker */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <label className={`block text-sm font-bold mb-3 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>✨ Emoji</label>
                        <input
                          type="text"
                          value={selectedEmoji}
                          onChange={(e) => setSelectedEmoji(e.target.value.slice(0, 2))}
                          maxLength="2"
                          className={`w-full px-5 py-3.5 rounded-3xl text-3xl text-center focus:outline-none focus:ring-2 transition-all shadow-lg ${
                            isDark
                              ? 'bg-gray-800/60 border border-gray-600/40 hover:border-gray-500/60 text-white placeholder-gray-500/80 focus:ring-blue-500/30 focus:shadow-blue-500/20'
                              : 'bg-white/80 border border-slate-300 hover:border-slate-400 text-slate-900 placeholder-slate-500 focus:ring-black/10 focus:shadow-black/10'
                          }`}
                        />
                      </motion.div>

                      {/* Category Selection */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <label className={`block text-sm font-bold mb-4 tracking-wide ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>📂 Category</label>
                        <div className="grid grid-cols-5 gap-2.5">
                          {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
                            <motion.button
                              key={key}
                              whileHover={{ scale: 1.1, y: -3 }}
                              whileTap={{ scale: 0.93 }}
                              transition={{ duration: 0.1 }}
                              onClick={() => setSelectedCategory(key)}
                              className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2 font-bold ${
                                selectedCategory === key
                                  ? isDark
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-300 shadow-lg shadow-blue-500/40 text-white'
                                    : 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 shadow-lg shadow-black/10 text-white'
                                  : isDark
                                    ? 'bg-gray-800/50 border border-gray-600/40 hover:border-gray-500/60 text-gray-300 hover:bg-gray-750/60'
                                    : 'bg-white/80 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-white'
                              }`}
                            >
                              <span className="text-2xl">{category.emoji}</span>
                              <span className="text-xs text-center leading-tight">{category.label}</span>
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
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(TASK_PRIORITIES).map(([key, priority]) => (
                            <motion.button
                              key={key}
                              whileHover={{ scale: 1.1, y: -3 }}
                              whileTap={{ scale: 0.93 }}
                              transition={{ duration: 0.1 }}
                              onClick={() => setSelectedPriority(key)}
                              className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2.5 font-bold border-2 ${
                                selectedPriority === key
                                  ? `shadow-lg`
                                  : isDark
                                    ? 'bg-gray-800/50 border-gray-600/40 hover:border-gray-500/60 text-gray-300 hover:bg-gray-750/60'
                                    : 'bg-white/80 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-white'
                              }`}
                              style={{
                                backgroundColor: selectedPriority === key ? `${priority.color}40` : undefined,
                                borderColor: selectedPriority === key ? priority.color : undefined,
                                boxShadow: selectedPriority === key ? `0 8px 16px ${priority.color}30` : undefined,
                                color: selectedPriority === key ? priority.color : undefined
                              }}
                            >
                              <span className="text-2xl">{priority.emoji}</span>
                              <span className="text-xs text-center leading-tight">{priority.label}</span>
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
                            { value: 'all', label: 'All', emoji: '🔄' },
                            { value: 'morning', label: 'Morning', emoji: '🌅' },
                            { value: 'daytime', label: 'Daytime', emoji: '☀️' },
                            { value: 'night', label: 'Night', emoji: '🌙' }
                          ].map((slot) => (
                            <motion.button
                              key={slot.value}
                              whileHover={{ scale: 1.1, y: -3 }}
                              whileTap={{ scale: 0.93 }}
                              transition={{ duration: 0.1 }}
                              onClick={() => setSelectedTimeslot(slot.value)}
                              className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2 font-bold ${
                                selectedTimeslot === slot.value
                                  ? isDark
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-300 shadow-lg shadow-blue-500/40 text-white'
                                    : 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 shadow-lg shadow-black/10 text-white'
                                  : isDark
                                    ? 'bg-gray-800/50 border border-gray-600/40 hover:border-gray-500/60 text-gray-300 hover:bg-gray-750/60'
                                    : 'bg-white/80 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-white'
                              }`}
                            >
                              <span className="text-2xl">{slot.emoji}</span>
                              <span className="text-xs text-center leading-tight font-bold">{slot.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex gap-4 pt-6"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleClose}
                          className={`flex-1 px-6 py-4 rounded-3xl font-bold text-base transition-all shadow-lg tracking-wide border ${
                            isDark
                              ? 'bg-gray-700/40 hover:bg-gray-600/50 border-gray-600/40 hover:border-gray-500/60 text-white hover:shadow-gray-900/30'
                              : 'bg-white/80 hover:bg-white border-slate-300 hover:border-slate-400 text-slate-900 hover:shadow-black/10'
                          }`}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          onClick={handleCreateTask}
                          disabled={!taskTitle.trim()}
                          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-3xl text-white font-bold text-base transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 tracking-wide"
                        >
                          ✨ Create Task
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;
