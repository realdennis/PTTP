import React from 'react';
import App from './app';
import { render } from 'ink';

import config from './config/index.js';
import isDev from './utils/isDev.js';
import getNode from './lib/getNode.js';
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
  const pubKey = peerDH.getPublicKey();
  const node = await getNode(options);
  const topic = isDev
    ? config.debug.topic
    : mode === 'create'
    ? primeHex
    : room;

  const { id: ownPeerID } = await node.id();

  const initialProps = {
    node,
    mode,
    topic,
    ownPeerID,
    peerDH,
    pubKey,
    ...options,
  };
  render(<App {...initialProps} />);
};

export default handler;
