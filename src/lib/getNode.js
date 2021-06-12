import path from 'path';
import crypto from 'crypto';
import Ipfs from 'ipfs-core';
import config from '../config/index.js';

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
    config: {
      Addresses: {
        Swarm: ['/ip4/0.0.0.0/tcp/0', '/ip4/127.0.0.1/tcp/0/ws'],
      },
    },
  });
  const node = await Ipfs.create(ipfsConfig);
  return node;
};

export default getNode;
