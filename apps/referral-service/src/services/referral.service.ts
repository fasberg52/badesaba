import { ReferralDto } from '@app/shared/dtos/referrals/referral.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReferralRepository } from '../repository/referral.repository';
import {
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { first, firstValueFrom } from 'rxjs';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { DataSource } from 'typeorm';

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralRepository: ReferralRepository,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
    @Inject(SCORE_SERVICE) private scoreClient: ClientProxy,
    private readonly dataSource: DataSource,
  ) {}

  async useReferral(referralDto: ReferralDto & { referredUserId: number }) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const { referredUserId, referralCode } = referralDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();

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

      await queryRunner.manager.save(referral);

      await firstValueFrom(
        this.scoreClient.emit(
          { cmd: KEYS_RQM.ADD_POINTS_TO_USER },
          { userId: referrer.id, score: 1 },
        ),
      );

      await firstValueFrom(
        this.scoreClient.emit(
          { cmd: KEYS_RQM.ADD_POINTS_TO_USER },
          { userId: referredUser.id, score: 1 },
        ),
      );

      await queryRunner.commitTransaction();

      return {
        message: 'با موفقیت ثبت شد',
        referrer: referrer.id,
        referred: referredUser.id,
      };
    } catch (error) {
      console.error('Error in useReferral:', error);
      await queryRunner.rollbackTransaction();

      throw new RpcException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
