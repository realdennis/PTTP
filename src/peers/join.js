import inquire from 'inquirer';
import ora from 'ora';
import waitSignal from '../lib/waitSignal.js';
import sendSignal from '../lib/sendSignal.js';

import ACTION from '../constants/action.js';

import logger from '../utils/logger.js';

const pollingSendSignal = (node, topic, payload) => {
  const timer = setInterval(() => sendSignal(node, topic, payload), 1000);
  const cleanup = () => clearInterval(timer);
  return cleanup;
};

const join = async (node, topicID, nickname) => {
  const spinner = ora('Request to join the room...');
  spinner.color = 'green';
  spinner.start();
  const cleanup = pollingSendSignal(node, topicID, {
    type: ACTION.REQUEST_CONNECT,
    nickname,
    key: '<THIS IS SUPPOSED TO BE KEY FOR EXCHANGE>',
  });

  const otherPeerPayload = await waitSignal(node, topicID, {
    type: ACTION.APPROVE_CONNECT,
  });
  cleanup && cleanup();
  spinner.stop();
  const answer = await inquire.prompt({
    name: ACTION.APPROVE_CONNECT,
    type: 'confirm',
    message: `Do you want to connect with ${otherPeerPayload.nickname}?`,
  });
  if (!answer[ACTION.APPROVE_CONNECT]) {
    console.log('You choose no, code exit');
    node.repo.gc();
    process.exit();
  }
  sendSignal(node, topicID, {
    nickname,
    key: '<KEY_FOR_EXCHANGE>', // send the exchange key back
    type: ACTION.FINNAL_CONNECT,
  });
  logger('[handler] [join] done');
};

export default join;
