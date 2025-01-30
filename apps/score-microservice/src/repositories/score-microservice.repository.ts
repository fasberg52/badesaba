import { ScoreEntity } from '@app/shared/entities/score.entity';
import { UserEntity } from '@app/shared/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ScoreRepository extends Repository<ScoreEntity> {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super(ScoreEntity, dataSource.createEntityManager());
  }

  async findUserScores(user: Partial<UserEntity>): Promise<ScoreEntity[]> {
    const userId = user.id;
    return this.find({ where: { userId: userId } });
  }
}
