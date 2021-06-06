import path from 'path';
import os from 'os';
import repo from './repo.js';
import isDev from '../utils/isDev.js';

export default {
  silent: !isDev,
  repo: path.resolve(os.homedir(), repo.folder),
};
