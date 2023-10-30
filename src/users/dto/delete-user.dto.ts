import { IsUUID } from 'class-validator';

export class DeleteUserDto {
  @IsUUID('all', { each: true })
  id: string[];
}
