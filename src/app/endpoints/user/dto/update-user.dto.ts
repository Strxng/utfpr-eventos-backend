import { IsOptional, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  @IsUUID(4, { message: 'Curso inválido' })
  courseCampusId: string;
}
