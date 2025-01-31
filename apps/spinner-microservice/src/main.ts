import { NestFactory } from '@nestjs/core';
import { SpinnerMicroserviceModule } from './spinner-microservice.module';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { CustomRpcExceptionFilter } from '@app/shared/filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(SpinnerMicroserviceModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('SPINNER', true));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new CustomRpcExceptionFilter());

  app
    .startAllMicroservices()
    .then(() => {
      console.log('Microservices are up and running');
    })
    .catch((err) => {
      console.error('Error starting microservices', err);
    });
  await app.listen(process.env.SPINNER_SERVICE_PORT ?? 3005);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
