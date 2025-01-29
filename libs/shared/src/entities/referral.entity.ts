import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  Relation,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'referrals', schema: 'referral' })
@Unique(['referrer', 'referred'])
export class ReferralEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  referrerId: number;

  @Column({ type: 'int' })
  referredId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  referralDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.referralsMade)
  @JoinColumn({ name: 'referrerId', referencedColumnName: 'id' })
  referrer: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.referralsReceived)
  @JoinColumn({ name: 'referredId', referencedColumnName: 'id' })
  referred: Relation<UserEntity>;
}
