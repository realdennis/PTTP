#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import handler from './handler.js';
const main = async () => {
  yargs(hideBin(process.argv))
    .scriptName('ptp')
    .option('nickname', {
      type: 'string',
      description: 'nickname, default is anomymous',
      default: 'anomymous',
    })
    .command(
      'create',
      'create the unique room!',
      () => {},
      ({ nickname }) => handler({ mode: 'create', nickname })
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
      async ({ room, nickname }) =>
        await handler({ room, mode: 'join', nickname })
    )
    .demandCommand(1, 'You need at least one command.')
    .help().argv;
};
main();
