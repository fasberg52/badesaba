import { RmqService } from '@app/shared/rmq/rmq.service';
import { Controller, Get, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(PaymentMicroserviceController.name);

  constructor(
    private readonly paymentMicroserviceService: PaymentMicroserviceService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: KEYS_RQM.PAYMENT_GENERATE })
  async generatePayment(
    @Payload() data: CreatePaymentDto & { userId: number },
    @Ctx() context: RmqContext,
  ) {
    console.log(
      JSON.stringify(`PAYMENT_GENERATE DATA ${JSON.stringify(data)}`),
    );
    try {
      const result = await this.paymentMicroserviceService.createPayment(data);
      this.logger.log(`process complete for GET_SCORE_BY_USER_ID`);

      this.rmqService.ack(context);

      return result;
    } catch (error) {
      this.rmqService.nAck(context);
      throw error;
    }
  }

  @MessagePattern({ cmd: KEYS_RQM.PAYMENT_VERIFY })
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
