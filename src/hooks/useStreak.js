import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { getTodayJordanString, isYesterday, getWeekNumber } from '../utils/dateUtils';

/**
 * Custom hook for managing streak logic
 * @param {object} initialState - Initial streak, lastActivityDate, and recovery state
 * @returns {object} Streak state and management functions
 */
export const useStreak = (initialState = {}) => {
  const {
    streak: initialStreak = 0,
    lastActivityDate: initialLastActivityDate = '',
    streakRecoveryAvailable: initialRecovery = false
  } = initialState;

  const [streak, setStreak] = useState(initialStreak);
  const [lastActivityDate, setLastActivityDate] = useState(initialLastActivityDate);
  const [streakRecoveryAvailable, setStreakRecoveryAvailable] = useState(initialRecovery);

  /**
   * Get current level based on streak count
   * @returns {object} Level info with name, color, and icon
   */
  const getCurrentLevel = useCallback(() => {
    if (streak >= 50) return { level: 4, name: 'The Beast', color: 'text-red-500', icon: '💀' };
    if (streak >= 22) return { level: 3, name: 'The Legend', color: 'text-purple-500', icon: '👑' };
    if (streak >= 8) return { level: 2, name: 'The Focus', color: 'text-blue-500', icon: '🎯' };
    return { level: 1, name: 'The Flame', color: 'text-orange-500', icon: '🔥' };
  }, [streak]);

  /**
   * Update streak based on Jordan time
   * @param {object} user - Supabase user object
   * @returns {object} Updated streak info
   */
  const updateStreak = useCallback(async (user) => {
    const today = getTodayJordanString();
    
    if (lastActivityDate === today) {
      return { streak, updated: false };
    }

    let newStreak = streak;

    if (lastActivityDate) {
      if (isYesterday(lastActivityDate)) {
        // Consecutive day - increment streak
        newStreak = streak + 1;
      } else {
        // Gap detected - check for weekly recovery
        const currentWeek = getWeekNumber(new Date(today));
        const lastWeek = getWeekNumber(new Date(lastActivityDate));
        
        if (currentWeek !== lastWeek) {
          setStreakRecoveryAvailable(true);
        }
        newStreak = 0;
      }
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastActivityDate(today);

    // Sync to localStorage
    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('lastActivityDate', today);

    // Sync to Supabase if user exists
    if (user) {
      await supabase.from('user_profile').update({
        streak: newStreak,
        lastActivityDate: today,
        updated_at: new Date()
      }).eq('user_id', user.id);
    }

    return { streak: newStreak, updated: true };
  }, [streak, lastActivityDate]);

  /**
   * Recover streak using weekly recovery
   * @param {object} user - Supabase user object
   * @returns {boolean} Success status
   */
  const recoverStreak = useCallback(async (user) => {
    if (!streakRecoveryAvailable) return false;

    const today = getTodayJordanString();
    
    setStreakRecoveryAvailable(false);
    setStreak(1);
    setLastActivityDate(today);

    // Sync to localStorage
    localStorage.setItem('streakRecoveryAvailable', 'false');
    localStorage.setItem('streak', '1');
    localStorage.setItem('lastActivityDate', today);

    // Sync to Supabase if user exists
    if (user) {
      await supabase.from('user_profile').update({
        streak: 1,
        lastActivityDate: today,
        streakRecoveryAvailable: false,
        updated_at: new Date()
      }).eq('user_id', user.id);
    }

    return true;
  }, [streakRecoveryAvailable]);

  return {
    streak,
    setStreak,
    lastActivityDate,
    setLastActivityDate,
    streakRecoveryAvailable,
    setStreakRecoveryAvailable,
    getCurrentLevel,
    updateStreak,
    recoverStreak
  };
};
