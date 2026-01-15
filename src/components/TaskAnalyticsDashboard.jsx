/**
 * Task Analytics Dashboard Component
 * Displays comprehensive task statistics and insights
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../constants/config.js';

const TaskAnalyticsDashboard = ({ tasks = [] }) => {
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
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="text-4xl font-bold text-blue-400 mb-2">{stats.totalTasks}</div>
          <div className="text-sm text-gray-400">Total Tasks</div>
          <div className="text-xs text-blue-300 mt-2">All tasks in your list</div>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="text-4xl font-bold text-green-400 mb-2">{stats.completedTasks}</div>
          <div className="text-sm text-gray-400">Completed</div>
          <div className="text-xs text-green-300 mt-2">✅ Well done!</div>
        </motion.div>

        {/* Active Tasks */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.activeTasks}</div>
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-xs text-yellow-300 mt-2">⏳ In progress</div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="text-4xl font-bold text-purple-400 mb-2">{stats.completionRate}%</div>
          <div className="text-sm text-gray-400">Completion</div>
          <div className="text-xs text-purple-300 mt-2">Rate of success</div>
        </motion.div>
      </div>

      {/* Categories Breakdown */}
      <motion.div
        variants={itemVariants}
        className="bg-black/20 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-white mb-4">📊 Tasks by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 text-center hover:border-gray-500/50 transition-all"
            >
              <div className="text-3xl mb-2">{category.emoji}</div>
              <div className="text-2xl font-bold text-white mb-1">{stats.byCategory[key] || 0}</div>
              <div className="text-xs text-gray-400">{category.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Priority Breakdown */}
      <motion.div
        variants={itemVariants}
        className="bg-black/20 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-white mb-4">⚡ Tasks by Priority</h3>
        <div className="space-y-3">
          {Object.entries(TASK_PRIORITIES).map(([key, priority]) => {
            const count = stats.byPriority[key] || 0;
            const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
            
            return (
              <motion.div
                key={key}
                whileHover={{ x: 5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{priority.emoji}</span>
                    <span className="text-gray-300 font-medium">{priority.label}</span>
                  </div>
                  <span className="text-white font-bold">{count}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
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
        className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-white mb-4">💡 Quick Insights</h3>
        <div className="space-y-3 text-sm text-gray-300">
          {stats.completionRate === 100 && stats.totalTasks > 0 ? (
            <div className="flex items-start gap-2">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="font-semibold text-green-400">Perfect! All tasks completed</div>
                <div className="text-xs text-gray-400">You've accomplished all your goals. Great job!</div>
              </div>
            </div>
          ) : stats.completionRate >= 75 ? (
            <div className="flex items-start gap-2">
              <span className="text-2xl">🚀</span>
              <div>
                <div className="font-semibold text-blue-400">Excellent progress!</div>
                <div className="text-xs text-gray-400">Keep up the momentum, you're almost there!</div>
              </div>
            </div>
          ) : stats.completionRate >= 50 ? (
            <div className="flex items-start gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-semibold text-yellow-400">Good progress</div>
                <div className="text-xs text-gray-400">You're halfway there. Focus on your active tasks!</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-2xl">💪</span>
              <div>
                <div className="font-semibold text-orange-400">Keep pushing!</div>
                <div className="text-xs text-gray-400">Start with high priority tasks to make progress.</div>
              </div>
            </div>
          )}

          {stats.byPriority.high > 0 && (
            <div className="flex items-start gap-2 pt-2 border-t border-gray-600/30">
              <span className="text-2xl">🔴</span>
              <div>
                <div className="font-semibold text-red-400">{stats.byPriority.high} high priority tasks</div>
                <div className="text-xs text-gray-400">Consider tackling these first!</div>
              </div>
            </div>
          )}

          {stats.activeTasks === 0 && stats.totalTasks > 0 && (
            <div className="flex items-start gap-2 pt-2 border-t border-gray-600/30">
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-semibold text-purple-400">No active tasks</div>
                <div className="text-xs text-gray-400">Time to add new goals and challenges!</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalyticsDashboard;
