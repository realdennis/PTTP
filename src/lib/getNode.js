import path from 'path';
import crypto from 'crypto';
import Ipfs from 'ipfs-core';
import config from '../config/index.js';
import logger from '../utils/logger';

const getNode = async ({ mode = '', dynamic }) => {
  /**
   * Dynamic override the ipfs config of the repo name
   * to the folder/create and folder/join.
   */
  const { repo: _repo = '' } = config.ipfs;

  const dynamicName = dynamic ? crypto.randomUUID() : 'static';
  const repo = path.resolve(_repo, mode, dynamicName);
  const ipfsConfig = Object.assign({}, config.ipfs, {
    repo,
  });
  logger('[getNode] final ipfs config', ipfsConfig)
  const node = await Ipfs.create(ipfsConfig);
  return node;
};

export default getNode;
