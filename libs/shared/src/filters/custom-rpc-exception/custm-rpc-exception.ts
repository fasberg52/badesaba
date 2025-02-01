import { BaseRpcException } from '../base-rpc.exception';

export class NotFoundRpcException extends BaseRpcException {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedRpcException extends BaseRpcException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class BadRequestRpcException extends BaseRpcException {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}
export class ConfilctRpcException extends BaseRpcException {
  constructor(message = 'Conflict request') {
    super(message, 409);
  }
}
