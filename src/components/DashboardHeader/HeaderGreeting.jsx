/**
 * HeaderGreeting Component
 * Displays animated greeting message
 */

import React from 'react';
import { motion } from 'framer-motion';

const HeaderGreeting = ({ phrase = '', size = 'text-2xl' }) => {
  return (
    <div key={phrase} className="justify-self-center text-center animate-rise-in">
      <motion.h2
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`${size} font-semibold text-white/90`}
        role="heading"
        aria-level="2"
      >
        {phrase}
      </motion.h2>
    </div>
  );
};

export default HeaderGreeting;
