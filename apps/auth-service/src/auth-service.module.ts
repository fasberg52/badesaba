import { Module } from '@nestjs/common';
import { AuthController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { AuthModule } from '@app/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'apps/user-service/src/services/user-service.service';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import {
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule.register({
      name: USER_SERVICE,
    }),
    RmqModule.register({
      name: SCORE_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
  ],
})
export class AuthServiceModule {}
