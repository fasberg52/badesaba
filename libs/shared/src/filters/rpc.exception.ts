import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const startTime = Date.now();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = exception.getError();
    const message =
      typeof errorResponse === 'object' && 'message' in errorResponse
        ? errorResponse.message
        : 'Internal Server Error';
    const statusCode =
      typeof errorResponse === 'object' && 'statusCode' in errorResponse
        ? Number(errorResponse.statusCode)
        : 500;

    const errorBody = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorBody);
    const duration = Date.now() - startTime;
    console.log(`Exception filter processed error in ${duration}ms`);
  }
}
