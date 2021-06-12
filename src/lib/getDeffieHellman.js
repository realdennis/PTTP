import crypto from 'crypto';

export const getDeffieHellmanPeer = (primeB64) => {
  const peer = crypto.createDiffieHellman(Buffer.from(primeB64, 'base64'));
  peer.generateKeys();
  return peer;
};

export const getPrimeB64 = () => {
  const server = crypto.createDiffieHellman(192);
  return server.getPrime('base64');
};
