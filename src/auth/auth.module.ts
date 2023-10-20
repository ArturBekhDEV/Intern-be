import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoModule } from '@/core/crypto/crypto.module';
import { OauthModule } from '@/core/oauth/oauth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from '@/core/configs/jwt.config';

@Module({
  imports: [
    CryptoModule.forRoot(),
    OauthModule,
    JwtModule.registerAsync(jwtOptions),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
