import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrizeTypeEnum } from '../enums/prize.enum';
import { UserEntity } from './user.entity';

@Entity({ schema: 'spinner', name: 'prizes' })
export class PrizeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'enum', enum: PrizeTypeEnum })
  type: PrizeTypeEnum;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.prizes)
  users: UserEntity[];
}
