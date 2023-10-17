import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Roles } from '@prisma/client';
import { InjectCrypto } from '@/core/crypto/crypto.decorator';
import { CryptoService } from '@/core/crypto/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    @InjectCrypto() private cryptoService: CryptoService,
  ) {}

  async signUp(dto: SignUpDto) {
    const { email, firstName, lastName, password } = dto;

    const existingUsersQty = await this.prismaService.user.count();
    if (existingUsersQty >= 1) {
      throw new ForbiddenException('Admin user already exists');
    } else {
      const hashSalt = this.cryptoService.genSalt(6);
      const hashedPassword = this.cryptoService.hash(password, hashSalt);
      await this.prismaService.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: Roles.ADMIN,
        },
      });
    }
  }
}
