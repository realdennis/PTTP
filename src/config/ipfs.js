import path from 'path';
import os from 'os';
import crypto from 'crypto';
import repo from './repo.js';
const isDev = process.env.NODE_ENV === 'dev';
// always generate dynamic repo for debug
const repoName = `${repo.folder}/repo-${crypto.randomUUID()}`;

export default {
  silent: !isDev,
  repo: path.resolve(os.homedir(), repoName),
};
