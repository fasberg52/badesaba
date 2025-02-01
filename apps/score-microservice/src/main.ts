import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions } from '@nestjs/microservices';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { ScoreMicroserviceModule } from './score-microservice.module';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(ScoreMicroserviceModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('SCORE', false));

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
  await app.listen(process.env.SCORE_SERVICE_PORT ?? 3004);
  console.log(
    `Application Score - Microservice is running on: ${await app.getUrl()}`,
  );
}
bootstrap();
