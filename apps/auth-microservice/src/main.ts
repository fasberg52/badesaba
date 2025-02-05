import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { RmqService } from '@app/shared/rmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';
import { TimeoutInterceptor } from '@app/shared/interseptor/timeout.interseptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(process.env.AUTH_SERVICE_PORT ?? 3002);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
