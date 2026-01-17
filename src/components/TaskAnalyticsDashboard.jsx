/**
 * Task Analytics Dashboard Component
 * Displays comprehensive task statistics and insights
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../constants/config.js';
import { useTheme } from '../contexts/ThemeContext';

const TaskAnalyticsDashboard = ({ tasks = [] }) => {
  const { isDark } = useTheme();

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'completed')?.length || 0;
    const activeTasks = tasks?.filter(t => t.status !== 'completed')?.length || 0;
    const missedTasks = tasks?.filter(t => t.status === 'missed')?.length || 0;
    
    // Count by category
    const byCategory = {};
    Object.keys(TASK_CATEGORIES).forEach(cat => {
      byCategory[cat] = tasks?.filter(t => t.category === cat)?.length || 0;
    });
    
    // Count by priority
    const byPriority = {};
    Object.keys(TASK_PRIORITIES).forEach(pri => {
      byPriority[pri] = tasks?.filter(t => t.priority === pri)?.length || 0;
    });
    
    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      activeTasks,
      missedTasks,
      completionRate,
      byCategory,
      byPriority
    };
  }, [tasks]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12 space-y-8"
    >
      {/* Main Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="app-card group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-4xl font-bold mb-2 text-blue-500">{stats.totalTasks}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</div>
            <div className="text-xs mt-2 text-slate-500 dark:text-slate-500">All tasks in your list</div>
          </div>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="app-card group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-4xl font-bold mb-2 text-green-500">{stats.completedTasks}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
            <div className="text-xs mt-2 text-slate-500 dark:text-slate-500">✅ Well done!</div>
          </div>
        </motion.div>

        {/* Active Tasks */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="app-card group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-4xl font-bold mb-2 text-amber-500">{stats.activeTasks}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active</div>
            <div className="text-xs mt-2 text-slate-500 dark:text-slate-500">⏳ In progress</div>
          </div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="app-card group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-4xl font-bold mb-2 text-purple-500">{stats.completionRate}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completion</div>
            <div className="text-xs mt-2 text-slate-500 dark:text-slate-500">Rate of success</div>
          </div>
        </motion.div>
      </div>

      {/* Categories Breakdown */}
      <motion.div
        variants={itemVariants}
        className="app-card"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">📊 Tasks by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="app-card-slim group cursor-pointer border border-slate-200/60 dark:border-slate-600/30 hover:border-slate-300 dark:hover:border-slate-500 transition-all"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.emoji}</div>
              <div className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{stats.byCategory[key] || 0}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{category.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Priority Breakdown */}
      <motion.div
        variants={itemVariants}
        className="app-card"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">⚡ Tasks by Priority</h3>
        <div className="space-y-3">
          {Object.entries(TASK_PRIORITIES).map(([key, priority]) => {
            const count = stats.byPriority[key] || 0;
            const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
            
            return (
              <motion.div
                key={key}
                whileHover={{ x: 5 }}
                className="space-y-2 p-3 rounded-xl app-card-slim border border-slate-200/60 dark:border-slate-600/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{priority.emoji}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{priority.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full rounded-full h-2 overflow-hidden bg-slate-200 dark:bg-slate-700/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: priority.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        variants={itemVariants}
        className="app-card bg-gradient-to-br from-accent-main/5 via-transparent to-accent-light/5 border-accent-subtle/30"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">💡 Quick Insights</h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {stats.completionRate === 100 && stats.totalTasks > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
            >
              <span className="text-2xl">🎉</span>
              <div>
                <div className="font-semibold text-green-600 dark:text-green-400">Perfect! All tasks completed</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">You've accomplished all your goals. Great job!</div>
              </div>
            </motion.div>
          ) : stats.completionRate >= 75 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
            >
              <span className="text-2xl">🚀</span>
              <div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">Excellent progress!</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Keep up the momentum, you're almost there!</div>
              </div>
            </motion.div>
          ) : stats.completionRate >= 50 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-semibold text-amber-600 dark:text-amber-400">Good progress</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">You're halfway there. Focus on your active tasks!</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
            >
              <span className="text-2xl">💪</span>
              <div>
                <div className="font-semibold text-orange-600 dark:text-orange-400">Keep pushing!</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Start with high priority tasks to make progress.</div>
              </div>
            </motion.div>
          )}

          {stats.byPriority.high > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 border-t-2"
            >
              <span className="text-2xl">🔴</span>
              <div>
                <div className="font-semibold text-red-600 dark:text-red-400">{stats.byPriority.high} high priority tasks</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Consider tackling these first!</div>
              </div>
            </motion.div>
          )}

          {stats.activeTasks === 0 && stats.totalTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 border-t-2"
            >
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-semibold text-purple-600 dark:text-purple-400">No active tasks</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Time to add new goals and challenges!</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalyticsDashboard;
