import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genres' })
export class GenreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
