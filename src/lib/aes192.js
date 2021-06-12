import crypto from 'crypto';
const ALGORITHM = 'aes-192-cbc';
const getAES192 = (ENC_KEY, IV) => {
  const encrypt = (val) => {
    let cipher = crypto.createCipheriv(ALGORITHM, ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  };

  const decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv(ALGORITHM, ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
  };

  return { encrypt, decrypt };
};

export default getAES192;
