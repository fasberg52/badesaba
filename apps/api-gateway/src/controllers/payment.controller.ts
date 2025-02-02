import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { PAYMENT_SERVICE } from '@app/shared/constants/name-microservice';
import { CreatePaymentDto } from '@app/shared/dtos/payment/create-payment.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { PaymentsResponse } from '../responses/payment/payment.response';

@Controller('payment')
@ApiTags('PAYMENT - MICROSERVICE')
@ApiBearerAuth()
export class PaymentController {
  constructor(@Inject(PAYMENT_SERVICE) private paymentClint: ClientRMQ) {}

  @ApiOkResponse(PaymentsResponse.getApiDoc())
  @Post('generate-link')
  async generatePaymentLink(
    @Body() dto: CreatePaymentDto,
  ): Promise<PaymentsResponse> {
    try {
      const result = await firstValueFrom(
        this.paymentClint.send({ cmd: KEYS_RQM.PAYMENT_GENERATE }, dto),
      );
      return new PaymentsResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
