import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { UserEntity } from './entities/user.entity';
import { ReferralEntity } from './entities/referral.entity';
import { ScoreEntity } from './entities/score.entity';
import { PrizeEntity } from './entities/prize.entity';
import { UserPrizeEntity } from './entities/user-prize.entity';
import { PaymentEntity } from './entities/payment.entity';

dotenvConfig({ path: '.env' });

export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: `${process.env.DATABASE_PASSWORD}`,
  entities: [
    UserEntity,
    ReferralEntity,
    ScoreEntity,
    PrizeEntity,
    UserPrizeEntity,
    PaymentEntity,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
