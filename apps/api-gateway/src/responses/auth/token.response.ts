import { BaseResponse } from '@app/shared/response/base.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class TokenResult {
  @ApiProperty()
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

@ApiExtraModels()
export class TokenResponse extends BaseResponse {
  @ApiProperty({ type: TokenResult })
  result: TokenResult;

  constructor(token: string) {
    super();
    this.result = new TokenResult(token);
  }
}
