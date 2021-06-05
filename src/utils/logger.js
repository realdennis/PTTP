import isDev from './isDev.js';
const logger = isDev
  ? (...message) => console.info('[DEBUG] ', ...message)
  : () => {};

export default logger;
