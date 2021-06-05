// import React from 'react';
// import App from './app.js';
// import { render } from 'ink';

import crypto from 'crypto';
import inquire from 'inquirer';
import ora from 'ora';
import config from './config/index.js';
import isDev from './utils/isDev.js';
import logger from './utils/logger.js';
import getNode from './lib/getNode.js';

import ACTION from './constants/action.js';

const waitSignal = (node, topic, payload, timeout) =>
  new Promise((resolve, reject) => {
    logger(`[wait signal] wait for ${payload.type}`);
    const callback = async (msg) => {
      const { id } = await node.id();
      const { from, data } = msg;

      const decoder = new TextDecoder();
      const dataString = decoder.decode(data);
      const otherPeerPayload = JSON.parse(dataString);

      if (otherPeerPayload.type === payload.type && from !== id) {
        logger('[wait signal] action type = ', otherPeerPayload.type);
        // cleanup
        node.pubsub.unsubscribe(topic, callback);
        resolve({ ...otherPeerPayload, from });
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
const sendSignal = (node, topic, payload) => {
  logger('[send signal]', payload);
  node.pubsub.publish(topic, JSON.stringify(payload));
};
const pollingSendSignal = (node, topic, payload) => {
  const timer = setInterval(() => sendSignal(node, topic, payload), 1000);
  const cleanup = () => clearInterval(timer);
  return cleanup;
};

const handler = async ({ room, mode, nickname }) => {
  const node = await getNode();
  const topicID = isDev
    ? config.debug.topic
    : mode === 'create'
    ? crypto.randomUUID()
    : room || fallbackTopicID;
  console.log(`$ ptp join ${topicID}`);

  let cleanup = null;

  if (mode === 'create') {
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
  }

  if (mode === 'join') {
    cleanup = pollingSendSignal(node, topicID, {
      type: ACTION.REQUEST_CONNECT,
      nickname,
      key: '<THIS IS SUPPOSED TO BE KEY FOR EXCHANGE>',
    });

    const otherPeerPayload = await waitSignal(node, topicID, {
      type: ACTION.APPROVE_CONNECT,
    });
    cleanup && cleanup();
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
  }
};

export default handler;
