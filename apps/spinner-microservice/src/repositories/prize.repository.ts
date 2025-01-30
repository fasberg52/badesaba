import { PrizeEntity } from '@app/shared/entities/prize.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PrizeRepository extends Repository<PrizeEntity> {
  constructor(
    private datasource: DataSource,
    private configService: ConfigService,
  ) {
    super(PrizeEntity, datasource.createEntityManager());
  }
}
