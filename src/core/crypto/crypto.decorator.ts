import { Inject } from '@nestjs/common';

export const CRYPTO = Symbol('CRYPTO');
export const InjectCrypto = () => Inject(CRYPTO);
