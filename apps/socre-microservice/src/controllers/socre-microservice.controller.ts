import { Controller, Get } from '@nestjs/common';
import { SocreMicroserviceService } from '../services/socre-microservice.service';

@Controller()
export class SocreMicroserviceController {
  constructor(
    private readonly socreMicroserviceService: SocreMicroserviceService,
  ) {}

  @Get()
  getHello(): string {
    return this.socreMicroserviceService.getHello();
  }
}
