import { InjectPrisma } from '@/prisma/prisma.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { AsyncStorageService } from '@core/async-storage/async-storage.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectPrisma()
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
    private readonly asyncStorage: AsyncStorageService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const authHeader = request.headers['authorization'];
    if (
      !authHeader ||
      !authHeader.trim().length ||
      !authHeader.startsWith('Bearer ')
    )
      throw new UnauthorizedException();
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(`You have not provide Bearer token`);
    }

    const isValidToken = this.jwtService.verify(token);

    if (isValidToken) {
      const user = await this.prismaService.user.findFirst({
        where: { id: isValidToken.id },
      });
      if (!user) throw new UnauthorizedException('User not found');
      this.asyncStorage.set('user', { id: user.id, role: user.role });
      return true;
    } else throw new UnauthorizedException('token expired');
  }
}
