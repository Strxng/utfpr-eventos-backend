import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_event' })
export class UserEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity, (event) => event.userEvents)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.userEvents)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
