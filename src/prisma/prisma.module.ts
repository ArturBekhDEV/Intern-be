import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { PRISMA } from '@/prisma/prisma.decorator';

@Module({})
export class PrismaModule {
  static forRoot(options?: PrismaClientOptions): DynamicModule {
    const providers = [
      {
        provide: PRISMA,
        useValue: new PrismaService(options),
      },
    ];
    return {
      module: PrismaModule,
      providers,
      exports: providers,
      global: true,
    };
  }
}
