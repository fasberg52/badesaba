import { Injectable } from '@nestjs/common';

@Injectable()
export class SpinnerMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
