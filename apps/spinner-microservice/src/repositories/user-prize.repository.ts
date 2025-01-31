import { UserPrizeEntity } from '@app/shared/entities/user-prize.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserPrizeRepository extends Repository<UserPrizeEntity> {
  constructor(
    private datasource: DataSource,
    private configService: ConfigService,
  ) {
    super(UserPrizeEntity, datasource.createEntityManager());
  }

  async findPrizesByUserId(userId: number) {
    return this.find({
      where: { userId },
      relations: { prize: true },
    });
  }

  async addPrizeToUser(userId: number, prizeId: number) {
    const userPrize = new UserPrizeEntity();
    userPrize.userId = userId;
    userPrize.prizeId = prizeId;

    return this.save(userPrize);
  }

  async removePrizeFromUser(userId: number, prizeId: number) {
    return this.delete({ userId, prizeId });
  }
}
