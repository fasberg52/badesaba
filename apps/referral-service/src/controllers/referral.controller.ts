import { Controller } from '@nestjs/common';
import { ReferralService } from '../services/referral.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ReferralDto } from '@app/shared/dtos/referrals/referral.dto';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';

@Controller()
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @MessagePattern({ cmd: KEYS_RQM.USE_REFERRAL })
  async useReferral(@Payload() data: ReferralDto & { referredUserId: number }) {
    try {
      return await this.referralService.useReferral(data);
    } catch (error) {
      throw error;
    }
  }
}
