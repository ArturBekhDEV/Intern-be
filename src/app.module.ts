import { Module } from '@nestjs/common';

import { ExceptionModule } from '@core/exceptions/exception.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envOptions } from '@/core/configs/env.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from '@/core/configs/jwt.config';
import { AsyncStorageModule } from './core/async-storage/async-storage.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot(envOptions),
    ExceptionModule,
    JwtModule.registerAsync(jwtOptions),
    AsyncStorageModule,
  ],
})
export class AppModule {}
