import React from 'react';
import App from './ui/app.js';
import { render } from 'ink';

import crypto from 'crypto';
import config from './config/index.js';
import isDev from './utils/isDev.js';
import getNode from './lib/getNode.js';
import peers from './peers/index.js';

const handler = async (options) => {
  const server = crypto.createDiffieHellman(64);
  let primeHex = isDev ? '0b' : server.getPrime('hex');
  const { mode } = options;

  if (mode === 'join' && !isDev) {
    primeHex = room.split('-').pop();
  }

  const node = await getNode(options);
  const topic = isDev
    ? config.debug.topic
    : mode === 'create'
    ? primeHex
    : room;

  const { id: ownPeerID } = await node.id();

  const { sessionKey, authPeerID } = await peers[mode]({
    node,
    topic,
    ownPeerID,
    primeHex,
    ...options,
  });

  const appInitialProps = {
    ...options,
    node,
    sessionKey,
    authPeerID,
    ownPeerID,
  };

  !isDev && console.clear();
  render(<App {...appInitialProps} />);
};

export default handler;
