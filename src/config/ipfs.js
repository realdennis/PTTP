import path from 'path';
import os from 'os';
import crypto from 'crypto';
import repo from './repo.js';
const isDev = process.env.NODE_ENV === 'dev';
// generate independent repo for debug
const repoName = `${repo.folder}/${
  isDev ? `repo-${crypto.randomUUID()}` : 'repo'
}`;

export default {
  silent: !isDev,
  repo: path.resolve(os.homedir(), repoName),
};
