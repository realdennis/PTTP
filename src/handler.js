import React from 'react';
import App from './ui/app.js';
import { render } from 'ink';

import config from './config/index.js';
import isDev from './utils/isDev.js';
import getNode from './lib/getNode.js';
import peers from './peers/index.js';
import { getDeffieHellmanPeer, getPrimeHex } from './lib/getDeffieHellman';
import logger from './utils/logger.js';
const handler = async (options) => {
  const { room, mode } = options;

  const primeHex = isDev
    ? '0b'
    : mode === 'join'
    ? room.split('-').pop()
    : getPrimeHex();

  logger('[handler] primeHex', primeHex);
  const peerDH = getDeffieHellmanPeer(primeHex);

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
    peerDH,
    ...options,
  });

  logger('[handler] [session key]', sessionKey);
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
