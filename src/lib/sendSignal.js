import logger from '../utils/logger.js';
const sendSignal = ({ node, topic }, payload) => {
  logger('[send signal] payload=', payload);
  logger('[send signal] topic=', topic);
  node.pubsub.publish(topic, JSON.stringify(payload));
};
export default sendSignal;
