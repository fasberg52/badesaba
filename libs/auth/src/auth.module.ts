import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.gaurd';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [AuthService, JwtService, JwtGuard, ConfigService],
  exports: [AuthService, JwtGuard, JwtService],
})
export class AuthModule {}
