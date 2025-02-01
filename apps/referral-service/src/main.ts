import { NestFactory } from '@nestjs/core';
import { ReferralServiceModule } from './referral-service.module';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(ReferralServiceModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('REFERRAL', true));
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
      console.log('Microservices are up and running');
    })
    .catch((err) => {
      console.error('Error starting microservices', err);
    });
  await app.listen(process.env.REFERRAL_SERVICE_PORT ?? 3003);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
