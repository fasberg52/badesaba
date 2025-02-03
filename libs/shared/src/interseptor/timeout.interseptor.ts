import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly REQUEST_TIMEOUT = 60000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.REQUEST_TIMEOUT),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new RpcException('پاسخ‌دهی میکروسرویس بیش از حد طول کشید!'),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
