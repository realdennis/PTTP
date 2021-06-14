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
