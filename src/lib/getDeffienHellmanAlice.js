import crypto from 'crypto';

const getDeffienHellmanPeer = (primeHex) => {
  const peer = crypto.createDiffieHellman(Buffer.from(primeHex, 'hex'));
  peer.generateKeys();
  return peer;
};
export default getDeffienHellmanPeer;
