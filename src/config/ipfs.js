import path from 'path';
import os from 'os';
import repo from './repo.js';
import Swarm from './Swarm';
import isDev from '../utils/isDev.js';
import wrtc from 'wrtc';
import WebRTCStar from 'libp2p-webrtc-star';

export default {
  silent: !isDev,
  repo: path.resolve(os.homedir(), repo.folder),
  config: {
    Addresses: {
      Swarm,
    },
  },
  libp2p: {
    modules: {
      transport: [WebRTCStar],
    },
    config: {
      peerDiscovery: {
        webRTCStar: {
          // <- note the lower-case w - see https://github.com/libp2p/js-libp2p/issues/576
          enabled: true,
        },
      },
      transport: {
        WebRTCStar: {
          // <- note the upper-case w- see https://github.com/libp2p/js-libp2p/issues/576
          wrtc,
        },
      },
    },
  },
};
