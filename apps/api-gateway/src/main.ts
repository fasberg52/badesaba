import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { SwaggerHelper } from '@app/shared/swagger/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from '@app/shared/interseptor/timeout.interseptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TimeoutInterceptor());

  new SwaggerHelper().setup(app);
  await app.listen(process.env.port ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
