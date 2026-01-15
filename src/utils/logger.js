/**
 * Centralized logging utility
 * Provides structured logging with DEBUG flag control
 */

import { DEBUG } from '../constants/config.js';

/**
 * Log levels
 */
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @returns {string} Formatted message
 */
const formatMessage = (level, module, message) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  return `[${timestamp}] [${level}] [${module}]`;
};

/**
 * Debug logging (only if DEBUG flag is true)
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @param {*} data - Optional data to log
 */
export const logDebug = (module, message, data = null) => {
  if (!DEBUG) return;
  const prefix = formatMessage(LOG_LEVELS.DEBUG, module, message);
  if (data !== null) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
};

/**
 * Info logging (always shown in development)
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @param {*} data - Optional data to log
 */
export const logInfo = (module, message, data = null) => {
  const prefix = formatMessage(LOG_LEVELS.INFO, module, message);
  if (data !== null) {
    console.info(prefix, message, data);
  } else {
    console.info(prefix, message);
  }
};

/**
 * Warning logging
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @param {*} data - Optional data to log
 */
export const logWarn = (module, message, data = null) => {
  const prefix = formatMessage(LOG_LEVELS.WARN, module, message);
  if (data !== null) {
    console.warn(prefix, message, data);
  } else {
    console.warn(prefix, message);
  }
};

/**
 * Error logging
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @param {Error|*} error - Error object or data
 */
export const logError = (module, message, error = null) => {
  const prefix = formatMessage(LOG_LEVELS.ERROR, module, message);
  if (error instanceof Error) {
    console.error(prefix, message, error.message, error);
  } else if (error !== null) {
    console.error(prefix, message, error);
  } else {
    console.error(prefix, message);
  }
};

/**
 * Log performance timing
 * @param {string} module - Module name
 * @param {string} operation - Operation name
 * @param {number} duration - Duration in milliseconds
 */
export const logPerformance = (module, operation, duration) => {
  if (!DEBUG) return;
  const prefix = formatMessage(LOG_LEVELS.DEBUG, module, `Performance: ${operation}`);
  console.log(prefix, `${duration}ms`);
};

/**
 * Create a module-specific logger
 * @param {string} moduleName - Name of the module
 * @returns {object} Logger object with module-bound methods
 */
export const createLogger = (moduleName) => ({
  debug: (message, data) => logDebug(moduleName, message, data),
  info: (message, data) => logInfo(moduleName, message, data),
  warn: (message, data) => logWarn(moduleName, message, data),
  error: (message, error) => logError(moduleName, message, error),
  perf: (operation, duration) => logPerformance(moduleName, operation, duration)
});
