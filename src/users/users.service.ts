import { InjectPrisma } from '@/prisma/prisma.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectPrisma() private readonly prismaService: PrismaService) {}
  async getAll(page: number, countPerPage: number) {
    const query = {
      take: countPerPage,
      skip: page * countPerPage,
    };
    const items = await this.prismaService.user.findMany(query);
    const counts = await this.prismaService.user.count(query);

    return {
      items,
      counts,
    };
  }
}
