import { NestFactory } from '@nestjs/core';
import { SocreMicroserviceModule } from './socre-microservice.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions } from '@nestjs/microservices';
import { RmqService } from '@app/shared/rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(SocreMicroserviceModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('Score', true));

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
  await app.listen(process.env.SCORE_SERVICE_PORT ?? 3004);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
