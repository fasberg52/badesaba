import { Module } from '@nestjs/common';
import { SpinnerMicroserviceController } from './controllers/spinner-microservice.controller';
import { SpinnerMicroserviceService } from './services/spinner-microservice.service';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { PrizeRepository } from './repositories/prize.repository';

const repository = [PrizeRepository];

@Module({
  imports: [
    RmqModule,
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
  providers: [SpinnerMicroserviceService],
})
export class SpinnerMicroserviceModule {}
