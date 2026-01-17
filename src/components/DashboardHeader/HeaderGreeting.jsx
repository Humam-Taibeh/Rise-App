/**
 * HeaderGreeting Component
 * Displays animated greeting message
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const HeaderGreeting = ({ phrase = '', size = 'text-2xl' }) => {
  const { isDark } = useTheme();

  return (
    <div key={phrase} className="justify-self-center text-center animate-rise-in">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`${size} font-semibold app-card-slim px-6 py-3 inline-block`}
        role="heading"
        aria-level="2"
      >
        <span className="text-slate-900 dark:text-white">{phrase}</span>
      </motion.div>
    </div>
  );
};

export default HeaderGreeting;
