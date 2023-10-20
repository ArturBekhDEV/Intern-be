import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Roles, User } from '@prisma/client';
import { InjectCrypto } from '@/core/crypto/crypto.decorator';
import { CryptoService } from '@/core/crypto/crypto.service';
import { InjectPrisma } from '@/prisma/prisma.decorator';
import { SignInWithGoogleDto } from '@/auth/dto/sign-in-with-google.dto';
import { OauthService } from '@/core/oauth/oauth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectPrisma() private prismaService: PrismaService,
    @InjectCrypto() private cryptoService: CryptoService,

    private oauthService: OauthService,
    private jwtService: JwtService,
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

  async signInWithGoogle(dto: SignInWithGoogleDto) {
    const { token } = dto;
    const payload = await this.oauthService.getTokenPayload(token);

    const isExistingUser = await this.prismaService.user.findFirst({
      where: { email: payload.email },
    });

    if (isExistingUser) {
      const { id, role } = isExistingUser;
      return { token: this.jwtService.sign({ id, role }) };
    }

    const existingUsersQty = await this.prismaService.user.count();

    if (existingUsersQty >= 1)
      throw new ForbiddenException('Admin user already exists');
    else {
      const user = await this.prismaService.user.create({
        data: {
          email: payload.email,
          firstName: payload.given_name,
          ...(payload.family_name && { lastName: payload.family_name }),
          role: Roles.ADMIN,
        },
      });
      const token = this.jwtService.sign({ id: user.id, role: user.role });

      return { token };
    }
  }
}
