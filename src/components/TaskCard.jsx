/**
 * Task Card Component (Refactored)
 * Professional task display with modal-based editing and delete functionality
 * Beautiful animations and responsive design
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../constants/config.js';
import TaskEditModal from './TaskEditModal';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('TaskCard');

const TaskCard = ({
  task,
  onEdit,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isDark } = useTheme();

  // Status styling
  const statusConfig = {
    completed: {
      color: isDark ? 'bg-green-500/20' : 'bg-green-100',
      border: isDark ? 'border-green-500/30' : 'border-green-300',
      badge: isDark ? 'bg-green-500/30 text-green-300' : 'bg-green-200 text-green-700',
      icon: '✅',
      label: 'Completed'
    },
    processing: {
      color: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      border: isDark ? 'border-blue-500/30' : 'border-blue-300',
      badge: isDark ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-700',
      icon: '⏳',
      label: 'In Progress'
    },
    missed: {
      color: isDark ? 'bg-red-500/20' : 'bg-red-100',
      border: isDark ? 'border-red-500/30' : 'border-red-300',
      badge: isDark ? 'bg-red-500/30 text-red-300' : 'bg-red-200 text-red-700',
      icon: '❌',
      label: 'Missed'
    }
  };

  const currentStatus = statusConfig[task.status] || statusConfig.processing;

  const handleDelete = async () => {
    setIsDeleting(true);
    logger.debug('TaskCard', `Deleting task: ${task.id}`);
    try {
      await onDelete(task.id);
    } catch (error) {
      logger.error('TaskCard', 'Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveEdit = async (updates) => {
    logger.debug('TaskCard', `Updating task: ${task.id}`);
    await onEdit(task.id, updates);
  };

  // Priority color
  const priorityColor = TASK_PRIORITIES[task.priority]?.color || '#3b82f6';

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        whileHover={{ y: -3, boxShadow: isDark ? '0 20px 40px -10px rgba(37, 99, 235, 0.15)' : '0 20px 40px -10px rgba(37, 99, 235, 0.1)' }}
        className={`relative group rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-2xl ${isDark ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border-blue-500/20 hover:border-blue-400/40' : 'bg-gradient-to-br from-white/90 via-blue-50/70 to-white/90 border-blue-300/30 hover:border-blue-400/50'} shadow-xl`}
      >
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-white/3 via-transparent to-white/0' : 'bg-gradient-to-br from-white/5 via-transparent to-white/0'} pointer-events-none`} />
        
        <div className="relative p-3 h-full flex flex-col gap-2">
          {/* Header with Title and Status + Action Buttons */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <motion.span
                whileHover={{ scale: 1.1, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-2xl flex-shrink-0"
              >
                {task.emoji || '✨'}
              </motion.span>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-xs leading-snug break-words transition-colors duration-200 ${isDark ? 'text-white hover:text-blue-200' : 'text-gray-900 hover:text-blue-600'}`}>
                  {task.title}
                </h3>
              </div>
            </div>
            <div className="flex items-start gap-1">
              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.15, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEditModal(true)}
                title="Edit task"
                className={`p-1 rounded-md ${isDark ? 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 hover:text-blue-200 shadow-sm shadow-blue-500/5 hover:shadow-blue-500/10' : 'bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/30 hover:border-blue-400/50 text-blue-600 hover:text-blue-700 shadow-sm shadow-blue-400/5 hover:shadow-blue-400/10'} transition-all flex-shrink-0`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </motion.button>
              {/* Delete Button */}
              <motion.button
                whileHover={{ scale: 1.15, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete task"
                className={`p-1 rounded-md ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 shadow-sm shadow-red-500/5 hover:shadow-red-500/10' : 'bg-red-400/10 hover:bg-red-400/20 border border-red-400/30 hover:border-red-400/50 text-red-600 hover:text-red-700 shadow-sm shadow-red-400/5 hover:shadow-red-400/10'} transition-all flex-shrink-0`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                className={`px-1.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-0.5 backdrop-blur-md ${currentStatus.badge}`}
              >
                <span className="text-xs">{currentStatus.icon}</span>
              </motion.div>
            </div>
          </div>

          {/* Compact Badges - Only Emojis */}
          <div className="flex flex-wrap gap-1">
            {/* Category Emoji */}
            {task.category && TASK_CATEGORIES[task.category] && (
              <motion.div
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-2 py-1 ${isDark ? 'bg-blue-500/15 border border-blue-500/30' : 'bg-blue-100 border border-blue-300'} rounded-lg flex items-center backdrop-blur-lg hover:shadow-md ${isDark ? 'hover:shadow-blue-500/15' : 'hover:shadow-blue-300/15'} transition-all`}
                title={TASK_CATEGORIES[task.category].label}
              >
                <span className="text-sm">{TASK_CATEGORIES[task.category].emoji}</span>
              </motion.div>
            )}

            {/* Priority Emoji */}
            {task.priority && TASK_PRIORITIES[task.priority] && (
              <motion.div
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 rounded-lg flex items-center border backdrop-blur-lg transition-all hover:shadow-md"
                style={{
                  backgroundColor: isDark ? `${priorityColor}15` : `${priorityColor}10`,
                  borderColor: isDark ? `${priorityColor}30` : `${priorityColor}40`,
                  boxShadow: isDark ? `0 4px 8px -2px ${priorityColor}10` : `0 4px 8px -2px ${priorityColor}08`
                }}
                title={TASK_PRIORITIES[task.priority].label}
              >
                <span className="text-sm">{TASK_PRIORITIES[task.priority].emoji}</span>
              </motion.div>
            )}

            {/* Time Slot Emoji */}
            {task.timeslot && (
              <motion.div
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-2 py-1 ${isDark ? 'bg-purple-500/15 border border-purple-500/30' : 'bg-purple-100 border border-purple-300'} rounded-lg text-sm backdrop-blur-lg hover:shadow-md ${isDark ? 'hover:shadow-purple-500/15' : 'hover:shadow-purple-300/15'} transition-all`}
                title={task.timeslot === 'morning' ? 'Morning' : task.timeslot === 'daytime' ? 'Daytime' : task.timeslot === 'night' ? 'Night' : 'All Day'}
              >
                {task.timeslot === 'morning' && '🌅'}
                {task.timeslot === 'daytime' && '☀️'}
                {task.timeslot === 'night' && '🌙'}
                {task.timeslot === 'all' && '🔄'}
              </motion.div>
            )}
          </div>

        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/40'} backdrop-blur-sm rounded-2xl flex items-center justify-center z-50 cursor-pointer`}
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gradient-to-br from-red-950/80 to-red-900/40 border border-red-500/30' : 'bg-gradient-to-br from-red-50 to-red-100/50 border border-red-300'} rounded-xl p-4 max-w-sm cursor-default`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'} flex-shrink-0`} />
                  <div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Task?</h4>
                    <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>This action cannot be undone</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`flex-1 px-3 py-2 ${isDark ? 'bg-red-500/30 hover:bg-red-500/40 border border-red-500/50 text-red-300' : 'bg-red-400/20 hover:bg-red-400/30 border border-red-400/50 text-red-700'} rounded-lg font-semibold text-sm transition-all disabled:opacity-50`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`flex-1 px-3 py-2 ${isDark ? 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-gray-300' : 'bg-gray-300/40 hover:bg-gray-400/50 border border-gray-400/50 text-gray-700'} rounded-lg font-semibold text-sm transition-all`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit Modal */}
      <TaskEditModal
        isOpen={showEditModal}
        task={task}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default TaskCard;
