/**
 * DashboardHeader Component (Refactored)
 * Orchestrates header sub-components: Logo, Greeting, Stats
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import HeaderLogo from './HeaderLogo';
import HeaderGreeting from './HeaderGreeting';
import HeaderStats from './HeaderStats';

const DashboardHeader = ({
  currentSize,
  currentPhrase,
  progress,
  streak,
  currentLevel,
  onSettingsClick,
  onStreakClick,
  onPerformanceClick,
  currentTheme
}) => {
  const { isDark } = useTheme();

  return (
    <header className={`w-full grid grid-cols-3 items-center ${currentSize.container} bg-transparent backdrop-blur-2xl ${isDark ? 'border-b border-blue-500/20' : 'border-b border-blue-400/30'}`}>
      {/* Left: Logo */}
      <HeaderLogo size={currentSize.logo} theme={currentTheme} />

      {/* Center: Greeting */}
      <HeaderGreeting phrase={currentPhrase} size={currentSize.greeting} />

      {/* Right: Stats */}
      <HeaderStats
        progress={progress}
        streak={streak}
        currentLevel={currentLevel}
        onSettingsClick={onSettingsClick}
        onStreakClick={onStreakClick}
        onPerformanceClick={onPerformanceClick}
      />
    </header>
  );
};

export default DashboardHeader;
