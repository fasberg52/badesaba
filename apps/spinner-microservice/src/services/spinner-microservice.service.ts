import {
  SCORE_SERVICE,
  USER_SERVICE,
} from '@app/shared/constants/name-microservice';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { PrizeRepository } from '../repositories/prize.repository';
import { first, firstValueFrom } from 'rxjs';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { PrizeTypeEnum } from '@app/shared/enums/prize.enum';
import { In, Not } from 'typeorm';
import { UserPrizeRepository } from '../repositories/user-prize.repository';
import { UserPrizeEntity } from '@app/shared/entities/user-prize.entity';

@Injectable()
export class SpinnerMicroserviceService {
  constructor(
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
    @Inject(SCORE_SERVICE) private scoreClient: ClientRMQ,
    private readonly prizeRepository: PrizeRepository,
    private readonly userPrizeRepository: UserPrizeRepository,
  ) {}

  async runSpinner(userId: number) {
    try {
      const user = await firstValueFrom(
        this.userClient.send({ cmd: KEYS_RQM.GET_USER_BY_ID }, userId),
      );
      if (!user) {
        throw new RpcException('کاربر پیدا نشد!');
      }

      const userWithPrizes = await this.userPrizeRepository.find({
        where: { userId },
        relations: { prize: true },
      });

      //console.log(`userWithPrizes >> ${JSON.stringify(userWithPrizes)}`);

      const claimedPrizeIds =
        userWithPrizes.length > 0
          ? userWithPrizes
              .filter((up) => up.prize.type !== PrizeTypeEnum.CHANCE)
              .map((up) => up.prize.id)
          : [];
      console.log(`claimedPrizeIds >> ${JSON.stringify(claimedPrizeIds)}`);

      const availablePrizes = await this.prizeRepository.find({
        where: [
          { id: Not(In(claimedPrizeIds)) },
          { type: PrizeTypeEnum.CHANCE },
        ],
        select: {
          id: true,
          name: true,
          weight: true,
          type: true,
        },
      });

      console.log(`availablePrizes >>\\n ${JSON.stringify(availablePrizes)}`);

      if (availablePrizes.length === 0) {
        throw new RpcException('هیچ جایزه‌ای برای کاربر باقی نمانده است!');
      }

      const scoreUser = await firstValueFrom(
        this.scoreClient.send(
          { cmd: KEYS_RQM.LOWER_POINTS_FROM_USER },
          { userId, score: 1 },
        ),
      );

      if (scoreUser.score <= 1) {
        throw new RpcException('امتیاز کافی برای اجرای گردونه وجود ندارد');
      }

      const totalWeight = availablePrizes.reduce((sum, p) => sum + p.weight, 0);
      console.log(`totalWeight >> ${totalWeight}`);
      const random = Math.random() * totalWeight;
      console.log(`random >> ${random}`);

      let cumulativeWeight = 0;
      let selectedPrize: any = null;

      for (const prize of availablePrizes) {
        cumulativeWeight += prize.weight;
        console.log(
          `Checking prize: ${prize.name} | Weight: ${prize.weight} | Cumulative: ${cumulativeWeight}\n`,
        );
        if (random < cumulativeWeight) {
          selectedPrize = prize;
          console.log(`Selected Prize: ${JSON.stringify(selectedPrize)}\n`);

          break;
        }
      }

      if (!selectedPrize) {
        return null;
      }

      const userPrize = new UserPrizeEntity();
      userPrize.userId = userId;
      userPrize.prizeId = selectedPrize.id;
      userPrize.wonAt = new Date();

      await this.userPrizeRepository.save(userPrize);

      return selectedPrize;
    } catch (error) {
      console.error('Error in runSpinner:', error);
      throw new RpcException(error.message || 'Unknown error occurred');
    }
  }
}
