import { Injectable } from '@nestjs/common';

@Injectable()
export class SocreMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
