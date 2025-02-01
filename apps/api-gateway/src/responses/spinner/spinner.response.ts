import { PrizeEntity } from '@app/shared/entities/prize.entity';
import { UserPrizeEntity } from '@app/shared/entities/user-prize.entity';
import { BaseResponse, Pagination } from '@app/shared/response/base.response';
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

@ApiExtraModels()
export class UserPrizeListResponse extends BaseResponse {
  result: UserPrizeEntity[];

  @ApiProperty()
  pagination: Pagination;
  constructor(result: UserPrizeEntity[], total: number) {
    super();
    this.result = result;
    this.pagination = Pagination.set({ total });
  }
}
