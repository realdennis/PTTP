import logger from '../utils/logger.js';
const waitSignal = ({ node, topic, ownPeerID }, conditionPayload, timeout) =>
  new Promise((resolve, reject) => {
    logger('[wait signal] topic=', topic);
    logger('[wait signal] conditionPayload=', conditionPayload);
    const callback = async (msg) => {
      logger('[wait signal] triggered');
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
          logger('[fulfilled payload]', otherPeerPayload);
          const { pubKey } = otherPeerPayload;
          const _key =
            (pubKey && pubKey.data && Buffer.from(pubKey.data)) || undefined;
          // cleanup
          node.pubsub.unsubscribe(topic, callback);
          resolve(
            Object.assign({}, otherPeerPayload, {
              pubKey: _key,
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
