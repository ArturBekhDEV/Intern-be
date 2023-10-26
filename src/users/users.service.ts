import { AsyncStorageService } from '@/core/async-storage/async-storage.service';
import { InjectPrisma } from '@/prisma/prisma.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectPrisma() private readonly prismaService: PrismaService,
    private readonly asyncStorage: AsyncStorageService,
  ) {}
  async getAll(page: number, countPerPage: number) {
    const user = this.asyncStorage.getUser();
    const query = {
      take: countPerPage,
      skip: page * countPerPage,
      where: { id: { notIn: [user.id] } },
    };
    const items = await this.prismaService.user.findMany(query);
    const counts = await this.prismaService.user.count(query);

    return {
      items,
      counts,
    };
  }
}
