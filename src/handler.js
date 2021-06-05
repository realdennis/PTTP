import React from 'react';
import App from './app.js';
import { render } from 'ink';

import logger from './utils/logger.js';
import crypto from 'crypto';

import config from './config/index.js';

import isDev from './utils/isDev.js';

import getNode from './lib/getNode.js';

const handler = async ({ room, mode, nickname }) => {
  const node = await getNode();

  let topicID;
  if (mode === 'create') {
    topicID = crypto.randomUUID();
  }
  if (mode === 'join') {
    topicID = room;
  }
  if (isDev) {
    // override if dev mode
    topicID = config.debug.topic;
  }

  logger('done');
};

export default handler;
