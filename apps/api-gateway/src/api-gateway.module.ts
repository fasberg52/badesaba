import { Module } from '@nestjs/common';
import { AuthContoller } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '@app/auth/guards/role.guard';
import { JwtGuard } from '@app/auth/guards/jwt.gaurd';
import { AuthModule } from '@app/auth';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import {
  AUTH_SERVICE,
  REFERRAL_SERVICE,
  SCORE_SERVICE,
  SPINNER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { ReferralController } from './controllers/referral.controller';
import { SpinnerController } from './controllers/spinner.controller';
import { ScoreController } from './controllers/score.controller';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';

@Module({
  imports: [
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    RmqModule.register({
      name: REFERRAL_SERVICE,
    }),
    RmqModule.register({
      name: SPINNER_SERVICE,
    }),
    RmqModule.register({
      name: SCORE_SERVICE,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [
    AuthContoller,
    ReferralController,
    SpinnerController,
    ScoreController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    { provide: APP_FILTER, useClass: RpcToHttpExceptionFilter },
  ],
})
export class ApiGatewayModule {}
