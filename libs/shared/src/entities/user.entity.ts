import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ReferralEntity } from './referral.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';
import { ScoreEntity } from './score.entity';
import { PrizeEntity } from './prize.entity';
import { UserPrizeEntity } from './user-prize.entity';
import { PaymentEntity } from './payment.entity';

@Entity({ name: 'users', schema: 'user' })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ default: '09218913541' })
  @IsString()
  @MaxLength(11)
  @Matches(/^[0-9]{11}$/)
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 11, unique: true, nullable: false })
  phone: string;

  @ApiProperty({ default: 'Aa123456*' })
  @Expose()
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 200, nullable: false })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column({ unique: true })
  referralCode: string;

  @ApiProperty({ enum: UserRoleEnum })
  @IsEnum(UserRoleEnum)
  @Column({ type: 'enum', enum: UserRoleEnum, nullable: false })
  role: UserRoleEnum;

  @ApiProperty()
  @IsDateString()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty()
  @IsDateString()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => ReferralEntity, (referral) => referral.referrer)
  referralsMade: Relation<ReferralEntity[]>;

  @OneToMany(() => ReferralEntity, (referral) => referral.referred)
  referralsReceived: Relation<ReferralEntity[]>;

  @OneToMany(() => ScoreEntity, (score) => score.user)
  scores: Relation<ScoreEntity[]>;

  @OneToMany(() => UserPrizeEntity, (userPrize) => userPrize.user)
  userPrizes: Relation<UserPrizeEntity[]>;

  @OneToMany(() => PaymentEntity, (payment) => payment.user)
  payments: Relation<PaymentEntity[]>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  generateReferralCode() {
    this.referralCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
  }
}
