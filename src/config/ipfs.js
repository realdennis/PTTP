import path from 'path';
import os from 'os';
import repo from './repo.js';
import Bootstrap from './Bootstrap';
import Swarm from './Swarm';
import isDev from '../utils/isDev.js';

export default {
  silent: !isDev,
  repo: path.resolve(os.homedir(), repo.folder),
  config: {
    Addresses: { Bootstrap, Swarm },
  },
};
