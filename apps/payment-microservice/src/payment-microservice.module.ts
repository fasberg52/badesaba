import { RedisService } from './../../../libs/shared/src/redis/redis.service';
import { Module } from '@nestjs/common';
import { PaymentMicroserviceController } from './controllers/payment-microservice.controller';
import { PaymentMicroserviceService } from './services/payment-microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { PaymentRepository } from './repository/payment.repository';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { SCORE_SERVICE } from '@app/shared/constants/name-microservice';
const repository = [PaymentRepository];
@Module({
  imports: [
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
  controllers: [PaymentMicroserviceController],
  providers: [RedisService, PaymentMicroserviceService, ...repository],
})
export class PaymentMicroserviceModule {}
