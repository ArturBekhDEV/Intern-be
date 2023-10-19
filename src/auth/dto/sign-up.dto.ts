import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
export class SignUpDto {
  @MinLength(3)
  @IsString()
  firstName: string;

  @MinLength(3)
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
