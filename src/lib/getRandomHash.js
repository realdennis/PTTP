import crypto from 'crypto';
const getRandomHash = () => {
    return crypto.randomUUID()
}

export default getRandomHash;