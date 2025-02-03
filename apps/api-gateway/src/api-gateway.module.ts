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
  PAYMENT_SERVICE,
  REFERRAL_SERVICE,
  SCORE_SERVICE,
  SPINNER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { ReferralController } from './controllers/referral.controller';
import { SpinnerController } from './controllers/spinner.controller';
import { ScoreController } from './controllers/score.controller';
import { RpcToHttpExceptionFilter } from '@app/shared/filters/rpc.exception';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentController } from './controllers/payment.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 150,
      },
    ]),
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
    RmqModule.register({
      name: PAYMENT_SERVICE,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 1000,
    }),
    AuthModule,
  ],
  controllers: [
    HealthController,
    PaymentController,
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
