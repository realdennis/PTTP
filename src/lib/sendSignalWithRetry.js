import sendSignal from './sendSignal.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// This is use for retry-considered signal
const sendSignalWithRetry = (
  node,
  topic,
  payload,
  retryOptions = {
    times: 2,
    interval: 1 * 1000,
  }
) => {
  let shouldStop = false;
  const asyncTask = async () => {
    for (let i = 0; i < retryOptions.times; i++) {
      if (shouldStop) {
        break;
      }
      sendSignal(node, topic, payload);
      await wait(retryOptions.interval);
    }

    // timeout trigger
  };
  asyncTask();
  const stop = () => (shouldStop = true);
  return stop;
};

export default sendSignalWithRetry;
