import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PrizeEntity } from './prize.entity';

@Entity({ schema: 'spinner', name: 'user_prizes' })
export class UserPrizeEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  prizeId: number;

  @ManyToOne(() => UserEntity, (user) => user.userPrizes)
  user: UserEntity;

  @ManyToOne(() => PrizeEntity, (prize) => prize.userPrizes)
  prize: PrizeEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  wonAt: Date;
}
