import crypto from 'crypto';
export default () => crypto.randomBytes(8).toString('hex');
