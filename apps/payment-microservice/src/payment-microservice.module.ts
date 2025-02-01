import { Module } from '@nestjs/common';
import { PaymentMicroserviceController } from './controllers/payment-microservice.controller';
import { PaymentMicroserviceService } from './services/payment-microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
const repository = [];
@Module({
  imports: [
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
  providers: [PaymentMicroserviceService],
})
export class PaymentMicroserviceModule {}
