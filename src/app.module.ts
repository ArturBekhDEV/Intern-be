import { Module } from '@nestjs/common';

import { ExceptionModule } from '@core/exceptions/exception.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envOptions } from '@/core/configs/env.config';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot(envOptions),
    ExceptionModule,
  ],
})
export class AppModule {}
