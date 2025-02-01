import { PrizeEntity } from '@app/shared/entities/prize.entity';
import { ScoreEntity } from '@app/shared/entities/score.entity';
import { BaseResponse } from '@app/shared/response/base.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class ScoreResponse extends BaseResponse {
  @ApiProperty()
  result: ScoreEntity;
  constructor(result: ScoreEntity) {
    super();
    this.result = result;
  }
}
