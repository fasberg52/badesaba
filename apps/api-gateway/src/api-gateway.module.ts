import { Module } from '@nestjs/common';
import { AuthContoller } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '@app/auth/guards/role.guard';
import { JwtGuard } from '@app/auth/guards/jwt.gaurd';
import { AuthModule } from '@app/auth';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import {
  AUTH_SERVICE,
  REFERRAL_SERVICE,
  SPINNER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { ReferralController } from './controllers/referral.controller';
import { SpinnerController } from './controllers/spinner.controller';

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
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AuthContoller, ReferralController, SpinnerController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class ApiGatewayModule {}
