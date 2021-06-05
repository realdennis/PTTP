// import React from 'react';
// import App from './app.js';
// import { render } from 'ink';

import crypto from 'crypto';
import config from './config/index.js';
import isDev from './utils/isDev.js';
import getNode from './lib/getNode.js';
import peers from './peers/index.js';

const handler = async ({ room, mode, nickname }) => {
  const node = await getNode();
  const topicID = isDev
    ? config.debug.topic
    : mode === 'create'
    ? crypto.randomUUID()
    : room || fallbackTopicID;

  peers[mode](node, topicID, nickname);
};

export default handler;
