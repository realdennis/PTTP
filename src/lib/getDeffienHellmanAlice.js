import crypto from 'crypto';

const getDeffienHellmanPeer = (prime) => {
  const peer = crypto.createDiffieHellman(prime);
  peer.generateKeys();
  return peer;
};
export default getDeffienHellmanPeer;
