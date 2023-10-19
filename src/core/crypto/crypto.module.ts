import { DynamicModule, Module } from '@nestjs/common';
import { CRYPTO } from '@/core/crypto/crypto.decorator';
import { CryptoService } from '@/core/crypto/crypto.service';

@Module({})
export class CryptoModule {
  static forRoot(): DynamicModule {
    const providers = [
      {
        provide: CRYPTO,
        useValue: new CryptoService(),
      },
    ];

    return {
      module: CryptoModule,
      providers,
      exports: providers,
      global: true,
    };
  }
}
