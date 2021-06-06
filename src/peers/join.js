import inquire from 'inquirer';
import ora from 'ora';
import waitSignal from '../lib/waitSignal.js';
import sendSignalWithRetry from '../lib/sendSignalWithRetry.js';
import getDeffienHellmanAlice from '../lib/getDeffienHellmanAlice.js';

import ACTION from '../constants/action.js';

import logger from '../utils/logger.js';

const join = async ({ node, topicID, nickname, primeHex }) => {
  const alice = getDeffienHellmanAlice(primeHex);
  const alicePub = alice.getPublicKey();

  const spinner = ora('Request to join the room...');
  spinner.color = 'green';
  spinner.start();
  const stopRequestSignal = sendSignalWithRetry(
    node,
    topicID,
    {
      type: ACTION.REQUEST_CONNECT,
      nickname,
      key: alicePub,
    },
    {
      times: 5,
      interval: 1 * 1000,
    }
  );
  const otherPeerPayload = await waitSignal(node, topicID, {
    type: ACTION.APPROVE_CONNECT,
  });
  stopRequestSignal();
  spinner.stop();
  const bobPub = otherPeerPayload.key;
  const aliceBobSecret = alice.computeSecret(bobPub);

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

  // automated cleanup
  sendSignalWithRetry(
    node,
    topicID,
    {
      nickname,
      type: ACTION.FINAL_CONNECT,
    },
    {
      times: 5,
      interval: 1 * 1000,
    }
  );
  logger('[handler] [join] done');
  return {
    sessionKey: aliceBobSecret,
    authPeerID: otherPeerPayload.from,
  };
};

export default join;
