import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { Auth } from '@/core/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from '@/users/dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Post('')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('delete')
  deleteUsers(@Body() dto: DeleteUserDto) {
    return this.usersService.deleteUsers(dto);
  }
  @Patch(':id')
  updateUsers(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUsers(dto, id);
  }
}
