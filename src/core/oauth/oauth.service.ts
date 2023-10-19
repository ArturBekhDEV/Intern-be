import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OauthService {
  private $client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    this.$client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async getTokenPayload(token: string) {
    const veryfyingResponse = await this.$client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });
    return veryfyingResponse.getPayload();
  }

  get client() {
    return this.$client;
  }
}
