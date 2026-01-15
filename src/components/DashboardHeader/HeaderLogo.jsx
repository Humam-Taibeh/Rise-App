/**
 * HeaderLogo Component
 * Displays the Rise logo with accent color styling
 */

import React from 'react';

const HeaderLogo = ({ size = 'text-5xl', theme }) => {
  return (
    <div className="justify-self-start">
      <h1
        className={`${size} font-bold tracking-tight text-white cursor-pointer hover:opacity-80 transition-opacity`}
        style={{
          filter: 'drop-shadow(0 0 10px rgb(var(--accent-main) / 0.5))',
          marginTop: '-0.5rem'
        }}
        role="heading"
        aria-level="1"
      >
        Rise
        <span
          style={{
            color: 'rgb(var(--accent-main))',
            textShadow: '0 0 8px rgb(var(--accent-main) / 0.8)'
          }}
        >
          .
        </span>
      </h1>
    </div>
  );
};

export default HeaderLogo;
