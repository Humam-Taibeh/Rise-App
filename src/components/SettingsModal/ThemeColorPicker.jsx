/**
 * ThemeColorPicker Component
 * Displays preset color palette for theme selection
 */

import React from 'react';
import { motion } from 'framer-motion';
import { THEME_COLORS } from '../../constants/config.js';

const ThemeColorPicker = ({ selectedColor, onColorSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(THEME_COLORS).map(([key, colorData]) => {
        // Skip custom color, it will be handled separately
        if (key === 'custom') return null;

        return (
          <motion.button
            key={key}
            onClick={() => onColorSelect(key)}
            className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
              selectedColor === key ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/50'
            }`}
            style={{
              backgroundColor: colorData.primary,
              boxShadow: selectedColor === key ? `0 0 20px ${colorData.primary}80` : 'none'
            }}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Select ${key} theme color`}
          >
            {selectedColor === key && (
              <div className="w-3 h-3 bg-white rounded-full mx-auto mt-3 animate-pulse" aria-hidden="true"></div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeColorPicker;
