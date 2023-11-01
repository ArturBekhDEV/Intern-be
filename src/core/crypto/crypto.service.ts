import { randomBytes, createHmac } from 'crypto';

class CryptoService {
  hash(value: string, salt: string) {
    const generatedHash = createHmac('sha512', salt);
    generatedHash.update(value);
    return generatedHash.digest('hex') + `:${salt}`;
  }

  compare(value: string, hash: string) {
    const oldHash = hash.split(':');
    const salt = oldHash[1];
    const hashedNewValue = this.hash(value, salt);
    return hashedNewValue == hash;
  }

  genSalt(rounds: number) {
    return randomBytes(Math.ceil(rounds / 2))
      .toString('hex')
      .slice(0, rounds);
  }
}

export { CryptoService };
