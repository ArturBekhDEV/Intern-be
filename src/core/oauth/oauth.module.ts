import { Module } from '@nestjs/common';
import { OauthService } from '@/core/oauth/oauth.service';

@Module({
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
