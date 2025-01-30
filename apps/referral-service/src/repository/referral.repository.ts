import { ReferralEntity } from '@app/shared/entities/referral.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReferralRepository extends Repository<ReferralEntity> {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super(ReferralEntity, dataSource.createEntityManager());
  }
}
