import inquire from 'inquirer';
import ora from 'ora';
import waitSignal from '../lib/waitSignal.js';
import sendSignal from '../lib/sendSignal.js';
import getDeffienHellmanAlice from '../lib/getDeffienHellmanAlice.js';

import ACTION from '../constants/action.js';

import logger from '../utils/logger.js';

const create = async ({node, topicID, nickname,primeHex}) => {
  const alice = getDeffienHellmanAlice(primeHex);
  const alicePub = alice.getPublicKey();

  console.log(`Run the above command in other machine:
    $ ptp join ${topicID}`);
  const otherPeerPayload = await waitSignal(node, topicID, {
    type: ACTION.REQUEST_CONNECT,
  });
  const bobPub = otherPeerPayload.key;
  const aliceBobSecret = alice.computeSecret(bobPub);

  logger('[create] [other peer payload]', otherPeerPayload);

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
    key: alicePub, // send the exchange key back
    type: ACTION.APPROVE_CONNECT,
  });

  const spinner = ora("Wait for peer's approval...");
  spinner.color = 'yellow';

  spinner.start();
  await waitSignal(node, topicID, {
    type: ACTION.FINNAL_CONNECT,
    from: otherPeerPayload.from,
  });
  spinner.stop();
  logger('[handler] [create] done');
  return {
    sessionKey: aliceBobSecret,
    authPeerID: otherPeerPayload.from,
  };
};

export default create;
