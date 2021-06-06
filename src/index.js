#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import handler from './handler.js';
const main = async () => {
  yargs(hideBin(process.argv))
    .scriptName('ptp')
    .option('nickname', {
      type: 'string',
      description: 'your nickname',
      default: 'anomymous',
    })
    .option('dynamic', {
      type: 'boolean',
      description: 'dynamic repo, enable if you up multiple session',
      default: false,
    })
    .command(
      'create',
      'create the unique room!',
      () => {},
      (options) => handler({ mode: 'create', ...options })
    )
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
      (options) => handler({ mode: 'join', ...options })
    )
    .demandCommand(1, 'You need at least one command.')
    .help().argv;
};
main();
