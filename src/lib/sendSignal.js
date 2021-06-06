import logger from '../utils/logger.js';
const sendSignal = ({ node, topic }, payload) => {
  logger('[send signal]', payload);
  node.pubsub.publish(topic, JSON.stringify(payload));
};
export default sendSignal;
