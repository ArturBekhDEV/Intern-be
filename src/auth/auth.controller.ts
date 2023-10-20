import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { SignInWithGoogleDto } from '@/auth/dto/sign-in-with-google.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('google')
  signInWithGoogle(@Body() dto: SignInWithGoogleDto) {
    return this.authService.signInWithGoogle(dto);
  }
}
