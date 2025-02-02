import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { PAYMENT_SERVICE } from '@app/shared/constants/name-microservice';
import { CreatePaymentDto } from '@app/shared/dtos/payment/create-payment.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { PaymentsResponse } from '../responses/payment/payment.response';
import { User } from '@app/shared/decorators/user.decorator';
import { UserEntity } from '@app/shared/entities/user.entity';
import { ProcessPaymentDto } from '@app/shared/dtos/payment/process-payment.dto';

@Controller('payment')
@ApiTags('Payment - Microservice')
@ApiBearerAuth()
export class PaymentController {
  constructor(@Inject(PAYMENT_SERVICE) private paymentClint: ClientRMQ) {}

  @ApiOkResponse(PaymentsResponse.getApiDoc())
  @Post('generate-link')
  async generatePaymentLink(
    @Body() dto: CreatePaymentDto,
    @User() user: UserEntity,
  ): Promise<PaymentsResponse> {
    try {
      const userId = user.id;
      const result = await firstValueFrom(
        this.paymentClint.send(
          { cmd: KEYS_RQM.PAYMENT_GENERATE },
          { ...dto, userId },
        ),
      );
      return new PaymentsResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOkResponse(PaymentsResponse.getApiDoc())
  @Post('verify')
  async processPayment(
    @Body() dto: ProcessPaymentDto,
    @User() user: UserEntity,
  ): Promise<PaymentsResponse> {
    try {
      const userId = user.id;
      const result = await firstValueFrom(
        this.paymentClint.send(
          { cmd: KEYS_RQM.PAYMENT_VERIFY },
          { ...dto, userId },
        ),
      );
      return new PaymentsResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
