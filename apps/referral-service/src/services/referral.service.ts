import { ReferralDto } from '@app/shared/dtos/referrals/referral.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReferralRepository } from '../repository/referral.repository';
import { USER_SERVICE } from '@app/shared/constants/name-microservice';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralRepository: ReferralRepository,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async useReferral(referralDto: ReferralDto & { referredUserId: number }) {
    const { referredUserId, referralCode } = referralDto;
    const referrer = await firstValueFrom(
      this.userClient.send(
        { cmd: KEYS_RQM.GET_USER_BY_REFERRAL_CODE },
        referralCode,
      ),
    );
    console.log('Referrer:', referrer);

    if (!referrer) {
      throw new RpcException('کد معرف اشتباه است');
    }

    const referredUser = await firstValueFrom(
      this.userClient.send({ cmd: KEYS_RQM.GET_USER_BY_ID }, referredUserId),
    );

    if (!referredUser) {
      throw new RpcException('کاربر معرفی شده یافت نشد');
    }

    const existingReferral = await this.referralRepository.findOne({
      where: { referredId: referredUserId },
    });

    if (existingReferral) {
      throw new RpcException('این کاربر قبلا معرفی شده است');
    }

    const referral = this.referralRepository.create({
      referrerId: referrer.id,
      referredId: referredUser.id,
      referralDate: new Date(),
    });

    await this.referralRepository.save(referral);

    return {
      message: 'با موفقیت ثبت شد',
      referrer: referrer.id,
      referred: referredUser.id,
    };
  }
}
