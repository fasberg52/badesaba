import { RmqService } from '@app/shared/rmq/rmq.service';
import { Controller, Get } from '@nestjs/common';
import { PaymentMicroserviceService } from '../services/payment-microservice.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { CreatePaymentDto } from '@app/shared/dtos/payment/create-payment.dto';
import { ProcessPaymentDto } from '@app/shared/dtos/payment/process-payment.dto';

@Controller()
export class PaymentMicroserviceController {
  constructor(
    private readonly paymentMicroserviceService: PaymentMicroserviceService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: KEYS_RQM.PAYMENT_GENERATE })
  async generatePayment(
    @Payload() data: CreatePaymentDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result = await this.paymentMicroserviceService.createPayment(data);
      this.rmqService.ack(context);

      return result;
    } catch (error) {
      this.rmqService.nAck(context);
      throw error;
    }
  }

  @MessagePattern({ cmd: KEYS_RQM.PAYMENT_GENERATE })
  async processPayment(
    @Payload() data: ProcessPaymentDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result = await this.paymentMicroserviceService.processPayment(data);
      this.rmqService.ack(context);

      return result;
    } catch (error) {
      this.rmqService.nAck(context);
      throw error;
    }
  }
}
