import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { REFERRAL_SERVICE } from '@app/shared/constants/name-microservice';
import { ReferralDto } from '@app/shared/dtos/referrals/referral.dto';
import { MessageResponse } from '@app/shared/response/base.response';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@Controller('referral')
@ApiTags('Referral Microservice')
@ApiBearerAuth()
export class ReferralController {
  constructor(@Inject(REFERRAL_SERVICE) private referralClient: ClientProxy) {}

  @Post('use')
  async useReferral(
    @Body() referralDto: ReferralDto,
  ): Promise<MessageResponse> {
    try {
      const result = await firstValueFrom(
        this.referralClient.send({ cmd: KEYS_RQM.USE_REFERRAL }, referralDto),
      );
      return new MessageResponse('با موفقیت انجام شد');
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
