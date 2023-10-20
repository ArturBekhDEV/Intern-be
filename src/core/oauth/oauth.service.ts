import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OauthService {
  private $client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async getTokenPayload(token: string) {
    const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
    const verifyingResponse = await this.$client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    return verifyingResponse.getPayload();
  }

  get client() {
    return this.$client;
  }

  set client(value: OAuth2Client) {
    this.$client = value;
  }
}
