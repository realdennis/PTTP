import path from 'path';
import os from 'os';
import repo from './repo.js';
import Swarm from './Swarm';
import isDev from '../utils/isDev.js';

export default {
  silent: !isDev,
  config: {
    Addresses: {
      Swarm,
    },
  },
};
