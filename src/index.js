#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import handler from './handler.js';
const main = async () => {
  yargs(hideBin(process.argv))
    .scriptName('pttp')
    .option('relayCircuit', {
      type: 'boolean',
      description: 'wait for relay node attached',
      default: false,
    })
    .option('nickname', {
      type: 'string',
      description: 'your nickname',
      default: 'anomymous',
    })
    .option('dynamic', {
      /**
       * We could not attach the exist repo lock file in the same time.
       * In default case (dynamic===false), we create the two independent repo `create` and `join`
       * if you want create more seesion, you need to use different repo, enable this.
       *
       * Note: This is a known isssue, since we don't have a better way to do the repo gc.
       * You can remove the unused repo using $ npm run clean
       */
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
