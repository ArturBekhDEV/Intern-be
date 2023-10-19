import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OauthService {
  private $client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
<<<<<<< HEAD
    this.client = new OAuth2Client(
=======
    this.$client = new OAuth2Client(
>>>>>>> 66a5049 (feature: add oauth module and basic endpoint)
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async getTokenPayload(token: string) {
<<<<<<< HEAD
    const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
    const verifyingResponse = await this.$client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    return verifyingResponse.getPayload();
=======
    const veryfyingResponse = await this.$client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });
    return veryfyingResponse.getPayload();
>>>>>>> 66a5049 (feature: add oauth module and basic endpoint)
  }

  get client() {
    return this.$client;
  }
<<<<<<< HEAD

  set client(value: OAuth2Client) {
    this.$client = value;
  }
=======
>>>>>>> 66a5049 (feature: add oauth module and basic endpoint)
}
