import isDev from "./isDev.js";
const logger = isDev
  ? (message) => console.log(`[DEBUG]: ${message}`)
  : () => {};

export default logger;
