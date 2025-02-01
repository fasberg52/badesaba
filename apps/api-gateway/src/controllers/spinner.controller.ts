import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { SPINNER_SERVICE } from '@app/shared/constants/name-microservice';
import { User } from '@app/shared/decorators/user.decorator';
import { UserEntity } from '@app/shared/entities/user.entity';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { SpinnerResponse } from '../responses/spinner/spinner.response';

@Controller('spinner')
@ApiTags('Spinner - Microservice')
@ApiBearerAuth()
export class SpinnerController {
  constructor(@Inject(SPINNER_SERVICE) private spinnerClient: ClientRMQ) {}

  @ApiOkResponse(SpinnerResponse.getApiDoc())
  @Post('run')
  async runSpinner(@User() user: UserEntity): Promise<SpinnerResponse> {
    const userId = user.id;
    try {
      const result = await firstValueFrom(
        this.spinnerClient.send({ cmd: KEYS_RQM.RUN_SPINNER }, userId),
      );
      return new SpinnerResponse(result);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
