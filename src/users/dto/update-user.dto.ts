import { Roles } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsEnum([Roles.ADMIN, Roles.USER])
  @IsOptional()
  role: Roles;
}
