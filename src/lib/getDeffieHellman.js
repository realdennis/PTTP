import crypto from 'crypto';

export const getDeffieHellmanPeer = (primeHex) => {
  const peer = crypto.createDiffieHellman(Buffer.from(primeHex, 'hex'));
  peer.generateKeys();
  return peer;
};

export const getPrimeHex = () => {
  const server = crypto.createDiffieHellman(64);
  return server.getPrime('hex');
};
