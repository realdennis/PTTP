import React from 'react';
import App from './ui/app.js';
import { render } from 'ink';

import crypto from 'crypto';
import config from './config/index.js';
import isDev from './utils/isDev.js';
import getNode from './lib/getNode.js';
import peers from './peers/index.js';

const handler = async ({ room, mode, nickname }) => {
  const server = crypto.createDiffieHellman(64);
  let primeHex = server.getPrime('hex');

  if (mode === 'join' && !isDev) {
    primeHex = room.split('-').pop();
  }

  const node = await getNode();
  const topicID = isDev
    ? config.debug.topic
    : mode === 'create'
    ? `${crypto.randomUUID()}-${primeHex}`
    : room;

  const { sessionKey, authPeerID } = await peers[mode]({
    node,
    topicID,
    nickname,
    primeHex,
  });
  const { id: ownID } = await node.id();

  console.clear();
  render(
    <App
      sessionKey={sessionKey}
      authPeerID={authPeerID}
      ownID={ownID}
      node={node}
      nickname={nickname}
      topicID={topicID}
    />
  );
};

export default handler;
