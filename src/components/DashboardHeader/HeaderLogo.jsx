/**
 * HeaderLogo Component
 * Displays the Rise logo as an image with fallback text
 */

import React from 'react';

const HeaderLogo = ({ size = 'text-5xl', theme }) => {
  return (
    <div className="justify-self-start">
      <img
        src="/logo.png"
        alt="Rise Logo"
        className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          filter: 'drop-shadow(0 0 10px rgb(var(--accent-main) / 0.3))',
        }}
      />
    </div>
  );
};

export default HeaderLogo;
