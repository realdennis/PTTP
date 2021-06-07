import inquire from 'inquirer';
import ora from 'ora';
import waitSignal from '../lib/waitSignal.js';
import sendSignalWithRetry from '../lib/sendSignalWithRetry.js';

import ACTION from '../constants/action.js';

import logger from '../utils/logger.js';

const create = async (options) => {
  const { node, topic, nickname, peerDH, mode } = options;
  const pubKey = peerDH.getPublicKey();
  if (mode === 'create') {
    console.log(`Run the above command in other machine:
    $ ptp join ${topic}`);
  }

  let spinner;
  let sendSignalCleanup;
  if (mode === 'join') {
    spinner = ora('Request to join the room...');
    spinner.color = 'green';
    spinner.start();
    sendSignalCleanup = sendSignalWithRetry(
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
  }
  const otherPeerPayload = await waitSignal(options, {
    type: mode === 'create' ? ACTION.REQUEST_CONNECT : ACTION.APPROVE_CONNECT,
  });
  spinner && spinner.stop && spinner.stop();
  sendSignalCleanup && sendSignalCleanup();
  const bobPub = otherPeerPayload.key;
  const sessionKey = peerDH.computeSecret(bobPub);

  console.log(1);
  const answer = await inquire.prompt({
    name: ACTION.APPROVE_CONNECT,
    type: 'confirm',
    message: `Do you want to connect with ${otherPeerPayload.nickname}?`,
  });
  console.log(2);
  if (!answer[ACTION.APPROVE_CONNECT]) {
    console.log('You choose no, code exit');
    node.repo.gc();
    process.exit();
  }

  sendSignalCleanup = sendSignalWithRetry(
    options,
    {
      nickname,
      key: pubKey, // send the exchange key back
      type: mode === 'create' ? ACTION.APPROVE_CONNECT : ACTION.FINAL_CONNECT,
    },
    {
      times: 5,
      interval: 1 * 1000,
    }
  );

  if (mode === 'create') {
    spinner = ora("Wait for peer's approval...");
    spinner.color = 'yellow';
    spinner.start();
    await waitSignal(options, {
      type: ACTION.FINAL_CONNECT,
      from: otherPeerPayload.from,
    });
    spinner && spinner.stop && spinner.stop();
    sendSignalCleanup && sendSignalCleanup();
  }
  logger('[handler] [create] done');
  return {
    sessionKey,
    authPeerID: otherPeerPayload.from,
  };
};

export default create;
