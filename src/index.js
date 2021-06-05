#!/usr/bin/env node
import React from 'react';
import App from './app.js';
import { render } from 'ink';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import getNode from './lib/getNode.js';
import crypto from 'crypto';

import config from './config/index.js';

import logger from './utils/logger.js';
import isDev from './utils/isDev.js';

const main = async () => {
  const node = await getNode();

  const { nickname } = yargs(hideBin(process.argv)).option('nickname', {
    type: 'string',
    description: 'nickname, default is anomymous',
    default: 'anomymous',
  }).argv;

  const handler = ({ room }) => {
    const topicID = isDev
      ? config.debug.topic
      : room
      ? room
      : crypto.randomUUID();
    render(<App nickname={nickname} ipfsNode={node} topicID={topicID} />);
  };

  yargs(hideBin(process.argv))
    .scriptName('ptp')
    .command('create', 'create the unique room!', () => {}, handler)
    .command(
      'join [room]',
      'join the unique room!',
      (yargs) => {
        yargs.positional('room', {
          type: 'string',
          default: '',
          describe: 'join [uuid]',
        });
      },
      handler
    )
    .demandCommand(1, 'You need at least one command.')
    .help().argv;
};
main();
