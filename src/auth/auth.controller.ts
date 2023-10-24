import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { SignInWithGoogleDto } from '@/auth/dto/sign-in-with-google.dto';
import { AuthGuard } from '@/core/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('current-user')
  currentUser() {
    return this.authService.currentUser();
  }

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
