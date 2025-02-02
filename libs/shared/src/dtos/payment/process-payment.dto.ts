import { PaymentEntity } from '@app/shared/entities/payment.entity';
import { PickType } from '@nestjs/swagger';

export class ProcessPaymentDto extends PickType(PaymentEntity, [
  'transactionId',
  'status',
]) {}
