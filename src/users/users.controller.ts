import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { Auth } from '@/core/decorators/auth.decorator';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('countPerPage', ParseIntPipe) countPerPage: number,
  ) {
    return this.usersService.getAll(page, countPerPage);
  }
}
