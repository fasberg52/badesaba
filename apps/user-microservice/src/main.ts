import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import {
  MicroserviceOptions,
  RmqOptions,
  RmqStatus,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const rmqService = app.get<RmqService>(RmqService);

  const server = app.connectMicroservice<RmqOptions>(
    rmqService.getOptions('USER', true),
  );

  app
    .startAllMicroservices()
    .then(() => {
      console.log('Microservices are up and running');
    })
    .catch((err) => {
      console.error('Error starting microservices', err);
    });
}
bootstrap();
