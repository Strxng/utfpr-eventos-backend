import { IsNotEmpty, IsString } from 'class-validator';

export class FavoriteEventDto {
  @IsNotEmpty({ message: 'Id do evento é obrigatório' })
  @IsString({ message: 'Evento inválido' })
  eventId: string;
}
