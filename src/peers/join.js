import inquire from 'inquirer';
import ora from 'ora';
import waitSignal from '../lib/waitSignal.js';
import sendSignalWithRetry from '../lib/sendSignalWithRetry.js';

import ACTION from '../constants/action.js';

import logger from '../utils/logger.js';

const join = async (options) => {
  const { node, nickname, peerDH } = options;
  const pubKey = peerDH.getPublicKey();

  const spinner = ora('Request to join the room...');
  spinner.color = 'green';
  spinner.start();
  const stopRequestSignal = sendSignalWithRetry(
    options,
    {
      type: ACTION.REQUEST_CONNECT,
      nickname,
      key: pubKey,
    },
    {
      times: 5,
      interval: 1 * 1000,
    }
  );
  const otherPeerPayload = await waitSignal(options, {
    type: ACTION.APPROVE_CONNECT,
  });
  stopRequestSignal();
  spinner.stop();
  const bobPub = otherPeerPayload.key;
  const sessionKey = peerDH.computeSecret(bobPub);

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
    options,
    {
      type: ACTION.FINAL_CONNECT,
      nickname,
    },
    {
      times: 5,
      interval: 1 * 1000,
    }
  );
  logger('[handler] [join] done');
  return {
    sessionKey,
    authPeerID: otherPeerPayload.from,
  };
};

export default join;
