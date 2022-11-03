import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  @IsString({ message: 'Senha atual é inválida' })
  currentPassword: string;

  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @IsString({ message: 'Nova senha é inválida' })
  newPassword: string;

  @IsNotEmpty({ message: 'Confirmação da nova senha é obrigatória' })
  @IsString({ message: 'Confirmação da nova senha é inválida' })
  confirmNewPassword: string;
}
