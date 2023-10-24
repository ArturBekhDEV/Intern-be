import { ClsService } from 'nestjs-cls';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AsyncStorageService {
  constructor(private readonly clsService: ClsService) {}

  getUser() {
    const user = this.clsService.get<Omit<User, 'password'>>('user');

    if (!user) throw new UnauthorizedException();

    return user;
  }

  set<V>(key: string, value: V) {
    this.clsService.set(key, value);
  }
}
