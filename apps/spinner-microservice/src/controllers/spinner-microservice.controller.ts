import { Controller, Get } from '@nestjs/common';
import { SpinnerMicroserviceService } from '../services/spinner-microservice.service';

@Controller()
export class SpinnerMicroserviceController {
  constructor(
    private readonly spinnerMicroserviceService: SpinnerMicroserviceService,
  ) {}

  @Get()
  getHello(): string {
    return this.spinnerMicroserviceService.getHello();
  }
}
