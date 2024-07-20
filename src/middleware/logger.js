// utils/logger.js

// Store original console methods
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      originalLog(...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      originalWarn(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      originalError(...args);
    }
  }
};

module.exports = logger;
