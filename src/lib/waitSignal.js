import logger from '../utils/logger.js';
const waitSignal = ({ node, topic, ownPeerID }, conditionPayload, timeout) =>
  new Promise((resolve, reject) => {
    logger(`[wait signal] wait for ${conditionPayload.type}`);
    const callback = async (msg) => {
      const { from, data } = msg;

      const decoder = new TextDecoder();
      const dataString = decoder.decode(data);
      try {
        // since the data could be other people in the same topic(room)
        const otherPeerPayload = { ...JSON.parse(dataString || ''), from };
        const isFulfilledPayload = Object.keys(conditionPayload).every(
          (key) => conditionPayload[key] === otherPeerPayload[key]
        );

        if (isFulfilledPayload && from !== ownPeerID) {
          const { key } = otherPeerPayload;
          const _key = (key && key.data && Buffer.from(key.data)) || undefined;
          // cleanup
          node.pubsub.unsubscribe(topic, callback);
          resolve(
            Object.assign({}, otherPeerPayload, {
              key: _key,
            })
          );
        }
      } catch (e) {
        logger('[wait signal]', e);
        // do nothing
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
