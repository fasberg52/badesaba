import { Controller, Get } from '@nestjs/common';
import { SpinnerMicroserviceService } from '../services/spinner-microservice.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';

@Controller()
export class SpinnerMicroserviceController {
  constructor(
    private readonly spinnerMicroserviceService: SpinnerMicroserviceService,
  ) {}

  @MessagePattern({ cmd: KEYS_RQM.RUN_SPINNER })
  async runSpinner(@Payload() userId: number) {
    try {
      console.log(`user id >> ${userId}`);
      return this.spinnerMicroserviceService.runSpinner(userId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
