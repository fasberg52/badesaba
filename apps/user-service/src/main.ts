import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/shared/rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('USER', true));
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app
    .startAllMicroservices()
    .then(() => {
      console.log('Microservices are up and running');
    })
    .catch((err) => {
      console.error('Error starting microservices', err);
    });
  await app.listen(process.env.port ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
