import { ReferralDto } from '@app/shared/dtos/referrals/referral.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReferralRepository } from '../repository/referral.repository';
import {
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { first, firstValueFrom } from 'rxjs';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { DataSource } from 'typeorm';
import {
  BadRequestRpcException,
  NotFoundRpcException,
} from '@app/shared/filters/custom-rpc-exception/custm-rpc-exception';

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralRepository: ReferralRepository,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
    @Inject(SCORE_SERVICE) private scoreClient: ClientRMQ,
    private readonly dataSource: DataSource,
  ) {}

  async useReferral(referralCode: string, referredUserId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      console.log(`referralCode >> ${JSON.stringify(referralCode)}`);
      console.log(`referredUserId >> ${JSON.stringify(referredUserId)}`);

      if (!referredUserId) {
        throw new BadRequestRpcException('کاربر ارجاع شده وجود ندارد');
      }

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
        throw new BadRequestRpcException('کد معرف اشتباه است');
      }
      console.log('Fetching user by ID:', referredUserId);

      const referredUser = await firstValueFrom(
        this.userClient.send(
          { cmd: KEYS_RQM.GET_USER_BY_ID },
          { referredUserId },
        ),
      );

      console.log('referredUser:', referredUser);

      if (!referredUser) {
        throw new NotFoundRpcException('کاربر معرفی شده یافت نشد');
      }

      const existingReferral = await this.referralRepository.findOne({
        where: { referredId: referredUserId },
      });
      console.log('existingReferral:', existingReferral);

      if (existingReferral) {
        throw new BadRequestRpcException('این کاربر قبلا معرفی شده است');
      }

      const referral = this.referralRepository.create({
        referrerId: referrer.id,
        referredId: referredUser.id,
        referralDate: new Date(),
      });

      console.log('referral+++ ', JSON.stringify(referral));

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
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
