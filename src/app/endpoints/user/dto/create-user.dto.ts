import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { regexHelper } from 'src/app/utils/regex.helper';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNotEmpty({ message: 'Registro acadêmico é obrigatório' })
  @IsString({ message: 'Registro acadêmico inválido' })
  academicRegistry: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Numero de telefone inválido' })
  phone: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsDateString({ message: 'Data de nascimento inválida' })
  birthdate: Date;

  @IsNotEmpty({ message: 'Gênero é obrigatório' })
  @IsUUID(4, { message: 'Gênero inválido' })
  genreId: string;

  @IsNotEmpty({ message: 'Campus é obrigatório' })
  @IsUUID(4, { message: 'Campus inválido' })
  campusId: string;

  @IsNotEmpty({ message: 'Curso é obrigatório' })
  @IsUUID(4, { message: 'Curso inválido' })
  courseId: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Matches(regexHelper.password, {
    message:
      'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirmação da senha é obrigatória' })
  @Matches(regexHelper.password, {
    message:
      'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  confirmPassword: string;
}
