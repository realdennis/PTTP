import logger from '../utils/logger.js';
import sendSignal from './sendSignal.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// This is use for retry-considered signal
const sendSignalWithRetry = (
  options,
  payload,
  retryOptions = {
    times: 10,
    interval: 1 * 1000,
  }
) => {
  let shouldStop = false;
  const asyncTask = async () => {
    for (let i = 0; i < retryOptions.times; i++) {
      if (shouldStop) {
        break;
      }
      sendSignal(options, payload);
      await wait(retryOptions.interval);
    }

    // timeout trigger
  };
  asyncTask();
  const stop = () => (shouldStop = true);
  return stop;
};

export default sendSignalWithRetry;
