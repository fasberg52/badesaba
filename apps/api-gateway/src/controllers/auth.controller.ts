import { Public } from '@app/shared/decorators/public.decorator';
import { LoginDto } from '@app/shared/dtos/auth/login.dto';
import { SignupDto } from '@app/shared/dtos/auth/signup.dto';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, retry } from 'rxjs';
import { TokenResponse } from '../responses/auth/token.response';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { ClientRMQ } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/shared/constants/name-microservice';

@Controller('auth')
@ApiTags('Auth Microservice')
export class AuthContoller {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientRMQ) {}
  @ApiOkResponse(TokenResponse.getApiDoc())
  @Public()
  @Post('login')
  async login(@Body() data: LoginDto): Promise<TokenResponse> {
    console.log(`data ${JSON.stringify(data)}`);
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: KEYS_RQM.USER_LOGIN }, data)
          .pipe(retry({ count: 3, delay: 1000 })),
      );
      return new TokenResponse(result.token);
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(TokenResponse.getApiDoc())
  @Public()
  @Post('signup')
  async signup(@Body() data: SignupDto): Promise<TokenResponse> {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: KEYS_RQM.USER_SIGNUP }, data)
          .pipe(retry({ count: 3, delay: 1000 })),
      );
      return new TokenResponse(result.token);
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
