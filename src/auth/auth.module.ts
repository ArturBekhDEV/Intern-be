import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoModule } from '@/core/crypto/crypto.module';
import { OauthModule } from '@/core/oauth/oauth.module';

@Module({
  imports: [CryptoModule.forRoot(), OauthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
