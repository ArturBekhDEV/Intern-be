import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  async signUp(dto: SignUpDto) {
    const { email, firstName, lastName, password, role } = dto

}
}
