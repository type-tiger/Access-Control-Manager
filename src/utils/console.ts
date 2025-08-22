// Console override utility for development/production environment control
const isDevelopment = process.env.NODE_ENV === "development";

// Store original console methods before overriding
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
  trace: console.trace,
  group: console.group,
  groupEnd: console.groupEnd,
  time: console.time,
  timeEnd: console.timeEnd,
  count: console.count,
  clear: console.clear,
};

// Production mode: completely silent
const silentConsole = {
  log: () => {},
  warn: () => {},
  error: () => {},
  info: () => {},
  debug: () => {},
  trace: () => {},
  group: () => {},
  groupEnd: () => {},
  time: () => {},
  timeEnd: () => {},
  count: () => {},
  clear: () => {},
};

// Development mode: use original console methods
const devConsole = {
  log: originalConsole.log,
  warn: originalConsole.warn,
  error: originalConsole.error,
  info: originalConsole.info,
  debug: originalConsole.debug,
  trace: originalConsole.trace,
  group: originalConsole.group,
  groupEnd: originalConsole.groupEnd,
  time: originalConsole.time,
  timeEnd: originalConsole.timeEnd,
  count: originalConsole.count,
  clear: originalConsole.clear,
};

// Export the appropriate console based on environment
export default isDevelopment ? devConsole : silentConsole;

// Alternative: always silent (for production builds)
export const silent = silentConsole;

// Alternative: always verbose (for debugging)
export const verbose = devConsole;
