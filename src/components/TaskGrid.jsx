/**
 * Task Grid Component (Refactored)
 * Displays tasks in a beautiful grid with full CRUD operations
 * Professional UI with modal-based editing and delete functionality
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import TaskCard from './TaskCard';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('TaskGrid');

const TaskGrid = ({ 
  tasks = [], 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  language = 'en',
  currentSize = {}
}) => {
  const { isDark } = useTheme();

  const handleEditTask = async (taskId, updates) => {
    logger.debug('TaskGrid', 'Updating task:', taskId);
    await onUpdateTask(taskId, updates);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  // Organize tasks by status for better UX
  const tasksByStatus = {
    completed: tasks.filter(t => t.status === 'completed'),
    processing: tasks.filter(t => t.status === 'processing'),
    missed: tasks.filter(t => t.status === 'missed')
  };

  logger.debug('TaskGrid', `Rendering ${tasks.length} tasks`);

  if (!tasks || tasks.length === 0) {
    return (
      <motion.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 ${isDark ? 'bg-blue-500/30' : 'bg-blue-400/20'} blur-3xl rounded-full opacity-50`}
          ></motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative text-8xl drop-shadow-2xl"
          >
            📭
          </motion.div>
        </div>
        <div className="max-w-lg">
          <h3 className={`text-4xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>No Tasks Yet</h3>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Start your journey to greatness! Click the "Add Task" button to create your first amazing task.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-3 items-center">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className={`text-sm px-6 py-3 rounded-2xl font-medium shadow-lg backdrop-blur-xl ${isDark ? 'text-blue-200 bg-gradient-to-r from-blue-500/25 to-blue-600/15 border border-blue-500/40 hover:shadow-blue-500/30' : 'text-blue-700 bg-gradient-to-r from-blue-400/30 to-blue-500/20 border border-blue-400/40 hover:shadow-blue-400/30'}`}
          >
            💡 Tip: Use Quick Templates for faster task creation
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Tasks Grid - Clean */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TaskGrid;
