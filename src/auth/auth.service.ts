import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Roles } from '@prisma/client';
import { InjectCrypto } from '@/core/crypto/crypto.decorator';
import { CryptoService } from '@/core/crypto/crypto.service';
import { InjectPrisma } from '@/prisma/prisma.decorator';
import { SignInWithGoogleDto } from '@/auth/dto/sign-in-with-google.dto';
import { OauthService } from '@/core/oauth/oauth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AsyncStorageService } from '@/core/async-storage/async-storage.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectPrisma() private prismaService: PrismaService,
    @InjectCrypto() private cryptoService: CryptoService,

    private configService: ConfigService,
    private oauthService: OauthService,

    private jwtService: JwtService,
    private asyncStorage: AsyncStorageService,
  ) {}

  async signUp(dto: SignUpDto) {
    const { email, firstName, lastName, password } = dto;

    const existingUsersQty = await this.prismaService.user.count();
    if (existingUsersQty >= 1) {
      throw new ForbiddenException('Admin user already exists');
    } else {
      const hashSalt = this.cryptoService.genSalt(6);
      const hashedPassword = this.cryptoService.hash(password, hashSalt);
      const user = await this.prismaService.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: Roles.ADMIN,
        },
      });

      const token = this.jwtService.sign(
        { id: user.id, role: user.role },
        { expiresIn: this.configService.get('JWT_EXPIRES_IN') },
      );

      return {
        token,
        role: user.role,
        firstName: user.firstName,
      };
    }
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;
    const isExistingUser = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (!isExistingUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!isExistingUser.password)
      throw new ForbiddenException('Please authorize with google account');

    const isPasswordMatched = this.cryptoService.compare(
      password,
      isExistingUser.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({
      id: isExistingUser.id,
      role: isExistingUser.role,
    });

    return {
      token,
    };
  }

  async signInWithGoogle(dto: SignInWithGoogleDto) {
    const { token } = dto;
    const payload = await this.oauthService.getTokenPayload(token);

    const isExistingUser = await this.prismaService.user.findFirst({
      where: { email: payload.email },
    });

    if (isExistingUser) {
      const { id, role, firstName } = isExistingUser;
      return {
        token: this.jwtService.sign(
          { id, role },
          { expiresIn: this.configService.get('JWT_EXPIRES_IN') },
        ),
        role,
        firstName,
      };
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
      const token = this.jwtService.sign(
        { id: user.id, role: user.role },
        { expiresIn: this.configService.get('JWT_EXPIRES_IN') },
      );

      return { token, role: user.role, firstName: user.firstName };
    }
  }

  async currentUser() {
    const authUser = this.asyncStorage.getUser();
    const user = await this.prismaService.user.findFirst({
      where: { id: authUser.id },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      role: user.role,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
    };
  }
}
