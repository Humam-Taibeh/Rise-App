/**
 * CustomColorPicker Component
 * Allows users to select and apply a custom color
 */

import React from 'react';
import { motion } from 'framer-motion';

const CustomColorPicker = ({ customColor, onColorChange, selectedColor, onSelectCustom }) => {
  return (
    <div className="col-span-4 mt-4 p-3 bg-black/30 rounded-xl border border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-sm text-zinc-300">Custom Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
            aria-label="Choose custom color"
            title="Choose a custom color"
          />
          <motion.button
            onClick={() => onSelectCustom(customColor)}
            className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
              selectedColor === 'custom' ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/50'
            }`}
            style={{
              backgroundColor: customColor,
              boxShadow: selectedColor === 'custom' ? `0 0 20px ${customColor}80` : 'none'
            }}
            title="Apply custom color as theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Apply custom color"
          >
            {selectedColor === 'custom' && (
              <div className="w-3 h-3 bg-white rounded-full mx-auto mt-3 animate-pulse" aria-hidden="true"></div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CustomColorPicker;
