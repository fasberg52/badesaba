import { AuthContoller } from './../../api-gateway/src/controllers/auth.controller';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { LoginDto } from '@app/shared/dtos/auth/login.dto';
import { SignupDto } from '@app/shared/dtos/auth/signup.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth-service.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: KEYS_RQM.USER_LOGIN })
  async login(@Payload() data: LoginDto) {
    console.log('Received login data:', data);
    try {
      return await this.authService.login(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: KEYS_RQM.USER_SIGNUP })
  async signup(@Payload() data: SignupDto) {
    console.log('Received signup data:', data);
    try {
      return await this.authService.signup(data);
    } catch (error) {
      console.error('Error during signup:', error.message);
      throw new RpcException(error.message);
    }
  }
}
