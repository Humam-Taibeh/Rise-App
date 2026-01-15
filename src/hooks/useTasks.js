/**
 * useTasks Hook (Refactored)
 * Manages task operations with centralized logging
 */

import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { DB_TABLES, TASK_CONFIG } from '../constants/config.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('useTasks');

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);

  /**
   * Fetch all tasks for a user
   */
  const fetchTasks = useCallback(async (userId) => {
    if (!userId) {
      setTasks([]);
      return;
    }

    try {
      logger.debug('fetchTasks', `Fetching tasks for user: ${userId}`);
      const { data: tasksData, error } = await supabase
        .from(DB_TABLES.tasks)
        .select('*')
        .eq('user_id', userId);

      if (error) {
        logger.error('fetchTasks', error);
        setTasks([]);
      } else {
        logger.debug('fetchTasks', `Loaded ${tasksData?.length || 0} tasks`);
        setTasks(tasksData || []);
      }
    } catch (error) {
      logger.error('fetchTasks', error);
      setTasks([]);
    }
  }, []);

  /**
   * Add a new task
   */
  const addTask = useCallback(
    async (title, emoji, timeslot, category = 'other', priority = 'medium') => {
      if (!user || !title.trim()) return false;

      const localId = Date.now().toString();
      const newTask = {
        title,
        emoji,
        status: TASK_CONFIG.defaultStatus,
        timeslot,
        category,
        priority
      };

      // Optimistic update
      setTasks(prev => [...(prev || []), { id: localId, ...newTask }]);

      try {
        const { data, error } = await supabase
          .from(DB_TABLES.tasks)
          .insert([{ user_id: user.id, ...newTask }])
          .select('id');

        if (error) {
          logger.error('addTask', error);
          setTasks(prev => prev?.filter(t => t.id !== localId) || []);
          return false;
        }

        if (data && data[0]) {
          logger.debug('addTask', `Task created: ${data[0].id}`);
          setTasks(prev => prev.map(t => (t.id === localId ? { ...t, id: data[0].id } : t)));
          return true;
        }
      } catch (error) {
        logger.error('addTask', error);
        setTasks(prev => prev?.filter(t => t.id !== localId) || []);
        return false;
      }
    },
    [user]
  );

  /**
   * Update an existing task
   */
  const updateTask = useCallback(
    async (taskId, updates) => {
      if (!user) return false;

      // Optimistic update
      setTasks(prev => prev?.map(t => (t.id === taskId ? { ...t, ...updates } : t)) || []);

      try {
        const { error } = await supabase
          .from(DB_TABLES.tasks)
          .update(updates)
          .eq('id', taskId)
          .eq('user_id', user.id);

        if (error) {
          logger.error('updateTask', error);
          return false;
        }

        logger.debug('updateTask', `Task updated: ${taskId}`);
        return true;
      } catch (error) {
        logger.error('updateTask', error);
        return false;
      }
    },
    [user]
  );

  /**
   * Delete a task
   */
  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) return false;

      // Optimistic update
      setTasks(prev => prev?.filter(t => t.id !== taskId) || []);

      try {
        const { error } = await supabase
          .from(DB_TABLES.tasks)
          .delete()
          .eq('id', taskId)
          .eq('user_id', user.id);

        if (error) {
          logger.error('deleteTask', error);
          return false;
        }

        logger.debug('deleteTask', `Task deleted: ${taskId}`);
        return true;
      } catch (error) {
        logger.error('deleteTask', error);
        return false;
      }
    },
    [user]
  );

  return {
    tasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    setTasks
  };
};
