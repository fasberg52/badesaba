import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import {
  ResponseError,
  ResponseInterface,
  ResponseMessage,
} from './response.interface';

@ApiExtraModels()
export class BaseResponse implements ResponseInterface<any> {
  @ApiProperty()
  success: boolean = true;

  // no need to add @ApiProperty(), extended class will have this
  result: any;

  pagination: Pagination;

  error: ResponseError;

  @ApiProperty()
  snackbar: ResponseMessage;

  static getApiDoc(): ApiResponseOptions {
    return {
      description: this.name,
      type: this,
    };
  }
}

@ApiExtraModels()
export class Pagination {
  static set(props?: Partial<Pagination>) {
    const pagination = new Pagination();
    Object.assign(pagination, props);
    return pagination;
  }

  @ApiProperty()
  total: number;
}

@ApiExtraModels()
export class MessageResponse extends BaseResponse {
  constructor(message: string) {
    super();
    this.snackbar = {
      type: 'success',
      message: message,
    };
  }
}
@ApiExtraModels()
export class SuccessResponse extends BaseResponse {
  constructor() {
    super();
    this.success = true;
  }
}
