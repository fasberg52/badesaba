import { Module } from '@nestjs/common';
import { ReferralController } from './controllers/referral.controller';
import { ReferralService } from './services/referral.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { ReferralRepository } from './repository/referral.repository';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import {
  REFERRAL_SERVICE,
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { APP_FILTER } from '@nestjs/core';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

const repository = [ReferralRepository];
@Module({
  imports: [
    RmqModule.register({
      name: USER_SERVICE,
    }),
    RmqModule.register({
      name: SCORE_SERVICE,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasource.options,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([...repository]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ReferralController],
  providers: [
    ...repository,
    ReferralService,
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
  ],
  exports: [...repository, ReferralService],
})
export class ReferralServiceModule {}
