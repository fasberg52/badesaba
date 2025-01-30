import { Module } from '@nestjs/common';
import { AuthContoller } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '@app/auth/guards/role.guard';
import { JwtGuard } from '@app/auth/guards/jwt.gaurd';
import { AuthModule } from '@app/auth';
import { RmqModule } from '@app/shared/rmq/rmq.module';
import { AUTH_SERVICE, REFERRAL_SERVICE } from '@app/shared/constants/name-microservice';
import { ReferralController } from './controllers/referral.controller';

@Module({
  imports: [
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    RmqModule.register({
      name: REFERRAL_SERVICE,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AuthContoller, ReferralController],
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
