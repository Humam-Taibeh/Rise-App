/**
 * HeaderLogo Component
 * Displays the Rise logo with accent color styling
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const HeaderLogo = ({ size = 'text-5xl', theme }) => {
  const { isDark } = useTheme();

  return (
    <div className="justify-self-start">
      <div
        className={`${size} font-bold tracking-tight cursor-pointer transition-all hover:scale-105 app-card-slim px-4 py-2 inline-block`}
        style={{
          filter: 'drop-shadow(0 0 10px rgb(var(--accent-main) / 0.5))',
          marginTop: '-0.5rem'
        }}
        role="heading"
        aria-level="1"
      >
        <span className="text-slate-900 dark:text-white">Rise</span>
        <span
          className="font-black"
          style={{
            color: 'rgb(var(--accent-main))',
            textShadow: '0 0 8px rgb(var(--accent-main) / 0.8)'
          }}
        >
          .
        </span>
      </div>
    </div>
  );
};

export default HeaderLogo;
