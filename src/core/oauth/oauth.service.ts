import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OauthService {
  private $client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
<<<<<<< HEAD
<<<<<<< HEAD
    this.client = new OAuth2Client(
=======
    this.$client = new OAuth2Client(
>>>>>>> 66a5049 (feature: add oauth module and basic endpoint)
=======
    this.client = new OAuth2Client(
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async getTokenPayload(token: string) {
<<<<<<< HEAD
<<<<<<< HEAD
    const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
    const verifyingResponse = await this.$client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    return verifyingResponse.getPayload();
=======
    const veryfyingResponse = await this.$client.verifyIdToken({
=======
    const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
    const verifyingResponse = await this.$client.verifyIdToken({
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)
      idToken: token,
      audience: googleClientId,
    });
<<<<<<< HEAD
    return veryfyingResponse.getPayload();
>>>>>>> 66a5049 (feature: add oauth module and basic endpoint)
=======

    return verifyingResponse.getPayload();
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)
  }

  get client() {
    return this.$client;
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)

  set client(value: OAuth2Client) {
    this.$client = value;
  }
<<<<<<< HEAD
=======
>>>>>>> 66a5049 (feature: add oauth module and basic endpoint)
=======
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)
}
