import React from 'react';
import App from './app';
import { render } from 'ink';

import config from './config/index.js';
import isDev from './utils/isDev.js';
import getNode from './lib/getNode.js';
import { getDeffieHellmanPeer, getPrimeB64 } from './lib/getDeffieHellman';
import logger from './utils/logger.js';

// constant value which generate from getPrimeB64
const devPrimeB64 = '9ZsJ8UcVVQK8eZw/zUwCTL0xEyU50ReL';

const handler = async (options) => {
  const { room, mode } = options;

  const primeB64 = isDev ? devPrimeB64 : mode === 'join' ? room : getPrimeB64();

  logger('[handler] primeB64', primeB64);
  const peerDH = getDeffieHellmanPeer(primeB64);
  const pubKey = peerDH.getPublicKey();
  const node = await getNode(options);
  const topic = isDev
    ? config.debug.topic
    : mode === 'create'
    ? primeB64
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
