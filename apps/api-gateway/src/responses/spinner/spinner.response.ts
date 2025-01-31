import { PrizeEntity } from '@app/shared/entities/prize.entity';
import { BaseResponse } from '@app/shared/response/base.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';



@ApiExtraModels()
export class SpinnerResponse extends BaseResponse {
  @ApiProperty()
  result: PrizeEntity;
  constructor(result: PrizeEntity) {
    super();
    this.result = result;
  }
}

