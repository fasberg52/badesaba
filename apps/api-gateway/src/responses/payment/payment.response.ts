import { PaymentEntity } from '@app/shared/entities/payment.entity';
import { PrizeEntity } from '@app/shared/entities/prize.entity';
import { ScoreEntity } from '@app/shared/entities/score.entity';
import { BaseResponse } from '@app/shared/response/base.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class PaymentsResponse extends BaseResponse {
  @ApiProperty()
  result: PaymentEntity;
  constructor(result: PaymentEntity) {
    super();
    this.result = result;
  }
}
