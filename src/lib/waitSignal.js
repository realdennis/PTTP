import logger from '../utils/logger.js';
const waitSignal = (node, topic, payload, timeout) =>
  new Promise((resolve, reject) => {
    logger(`[wait signal] wait for ${payload.type}`);
    const callback = async (msg) => {
      const { id } = await node.id();
      const { from, data } = msg;

      const decoder = new TextDecoder();
      const dataString = decoder.decode(data);
      const otherPeerPayload = JSON.parse(dataString);

      if (otherPeerPayload.type === payload.type && from !== id) {
        logger('[wait signal] action type=', otherPeerPayload.type);
        // cleanup
        node.pubsub.unsubscribe(topic, callback);
        resolve({ ...otherPeerPayload, from });
      }
    };
    node.pubsub.subscribe(topic, callback);
    // do timeout reject if
    timeout !== undefined &&
      timeout > 0 &&
      setTimeout(() => {
        // timeout & cleanup
        node.pubsub.unsubscribe(topic, callback);
        reject();
      }, timeout);
  });

export default waitSignal;
