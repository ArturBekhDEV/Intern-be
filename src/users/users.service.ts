import { InjectPrisma } from '@/prisma/prisma.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectCrypto } from '@/core/crypto/crypto.decorator';
import { CryptoService } from '@/core/crypto/crypto.service';
import { AsyncStorageService } from '@/core/async-storage/async-storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectPrisma() private readonly prismaService: PrismaService,
    @InjectCrypto() private readonly cryptoService: CryptoService,
    private readonly asyncStorage: AsyncStorageService,
  ) {}
  async getAll(page: number, countPerPage: number) {
    const user = this.asyncStorage.getUser();
    const query = {
      take: countPerPage,
      skip: page * countPerPage,
      where: { id: { notIn: [user.id] } },
    };

    const items = await this.prismaService.user.findMany({
      ...query,
      orderBy: { createdAt: 'desc' },
    });
    const counts = await this.prismaService.user.count({
      ...query,
      orderBy: { createdAt: 'desc' },
    });

    return {
      items,
      counts,
    };
  }

  async create(dto: CreateUserDto) {
    const user = this.asyncStorage.getUser();

    if (user.role !== 'ADMIN')
      throw new ForbiddenException(
        "You don't have permissions to perform this action",
      );

    const { email, firstName, password, role } = dto;

    const isExistingUser = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (isExistingUser)
      throw new BadRequestException('User with this email already exists');

    const hashSalt = this.cryptoService.genSalt(6);
    const hashedPassword = this.cryptoService.hash(password, hashSalt);

    return this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        role,
        ...(dto.lastName && { lastName: dto.lastName }),
      },
    });
  }
}
