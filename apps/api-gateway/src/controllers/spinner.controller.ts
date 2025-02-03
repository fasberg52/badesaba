import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { SPINNER_SERVICE } from '@app/shared/constants/name-microservice';
import { User } from '@app/shared/decorators/user.decorator';
import { UserEntity } from '@app/shared/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { first, firstValueFrom } from 'rxjs';
import {
  SpinnerResponse,
  UserPrizeListResponse,
} from '../responses/spinner/spinner.response';
import { GetAllPrizesByUserDto } from '@app/shared/dtos/spinner/get-all-prizes.dto';

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
      throw error;
    }
  }
  @Get('user-prizes')
  async getDetailUserPrizes(
    @User() user: UserEntity,
    @Query() dto: GetAllPrizesByUserDto,
  ): Promise<UserPrizeListResponse> {
    const userId = user.id;
    console.log(dto);
    try {
      const [result, total] = await firstValueFrom(
        this.spinnerClient.send(
          { cmd: KEYS_RQM.GET_DETAIL_PRIZES_USER },
          { userId, ...dto },
        ),
      );
      return new UserPrizeListResponse(result, total);
    } catch (error) {
      throw error;
    }
  }
}
