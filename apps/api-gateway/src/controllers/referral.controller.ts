import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { REFERRAL_SERVICE } from '@app/shared/constants/name-microservice';
import { User } from '@app/shared/decorators/user.decorator';
import { ReferralDto } from '@app/shared/dtos/referrals/referral.dto';
import { UserEntity } from '@app/shared/entities/user.entity';
import { MessageResponse } from '@app/shared/response/base.response';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@Controller('referral')
@ApiTags('Referral Microservice')
@ApiBearerAuth()
export class ReferralController {
  constructor(@Inject(REFERRAL_SERVICE) private referralClient: ClientRMQ) {}

  @Post('use')
  async useReferral(
    @Body() referralDto: ReferralDto,
    @User() user: UserEntity,
  ): Promise<MessageResponse> {
    try {
      const result = await firstValueFrom(
        this.referralClient.send(
          { cmd: KEYS_RQM.USE_REFERRAL },
          { referralCode: referralDto.referralCode, referredUserId: user.id },
        ),
      );
      return new MessageResponse('با موفقیت انجام شد');
    } catch (error) {
     throw error;
    }
  }
}
