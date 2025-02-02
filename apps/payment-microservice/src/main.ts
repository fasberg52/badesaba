import { NestFactory } from '@nestjs/core';
import { PaymentMicroserviceModule } from './payment-microservice.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(PaymentMicroserviceModule);
   const rmqService = app.get<RmqService>(RmqService);
  
    app.connectMicroservice<RmqOptions>(rmqService.getOptions('PAYMENT', false));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new RpcToHttpExceptionFilter());
  
    app
      .startAllMicroservices()
      .then(() => {
        console.log('PaymentMicroserviceModule are up and running');
      })
      .catch((err) => {
        console.error('Error starting microservices', err);
      });
    await app.listen(process.env.PAYMENT_SERVICE_PORT ?? 3006);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
