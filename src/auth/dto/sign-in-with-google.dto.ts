import { IsString } from 'class-validator';

export class SignInWithGoogleDto {
  @IsString()
  token: string;
}
