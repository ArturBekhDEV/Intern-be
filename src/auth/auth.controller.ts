import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
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
  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
