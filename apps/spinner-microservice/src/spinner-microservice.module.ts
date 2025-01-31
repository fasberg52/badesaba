import { Module } from '@nestjs/common';
import { SpinnerMicroserviceController } from './controllers/spinner-microservice.controller';
import { SpinnerMicroserviceService } from './services/spinner-microservice.service';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { PrizeRepository } from './repositories/prize.repository';
import {
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { UserPrizeRepository } from './repositories/user-prize.repository';

const repository = [PrizeRepository, UserPrizeRepository];

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
  controllers: [SpinnerMicroserviceController],
  providers: [...repository, SpinnerMicroserviceService],
  exports: [...repository],
})
export class SpinnerMicroserviceModule {}
