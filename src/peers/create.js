import inquire from 'inquirer';
import waitSignal from '../lib/waitSignal.js';
import sendSignal from '../lib/sendSignal.js';

import ACTION from '../constants/action.js';

import logger from '../utils/logger.js';

const create = async (node, topicID, nickname) => {
  console.log(`$ ptp join ${topicID}`);
  const otherPeerPayload = await waitSignal(node, topicID, {
    type: ACTION.REQUEST_CONNECT,
  });
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
    type: ACTION.APPROVE_CONNECT,
  });

  await waitSignal(node, topicID, {
    type: ACTION.FINNAL_CONNECT,
  });
  logger('[handler] [create] done');
};

export default create;
