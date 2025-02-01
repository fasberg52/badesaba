import { RpcException } from '@nestjs/microservices';

export class BaseRpcException extends RpcException {
  constructor(message: string, statusCode: number) {
    super({ message, statusCode, timestamp: new Date().toISOString() });
  }
}
