import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatusEnum } from '../enums/payment.enum';
import { IsDateString, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Entity({ schema: 'payment', name: 'payments' })
export class PaymentEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ enum: PaymentStatusEnum })
  @IsEnum(PaymentStatusEnum)
  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Column({ type: 'int', nullable: false })
  amount: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  transactionId: string;

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

  @ManyToOne(() => UserEntity, (user) => user.payments)
  user: Relation<UserEntity>;
}
