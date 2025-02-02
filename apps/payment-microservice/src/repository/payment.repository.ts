import { PaymentEntity } from '@app/shared/entities/payment.entity';
import { ReferralEntity } from '@app/shared/entities/referral.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PaymentRepository extends Repository<PaymentEntity> {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super(PaymentEntity, dataSource.createEntityManager());
  }
}
