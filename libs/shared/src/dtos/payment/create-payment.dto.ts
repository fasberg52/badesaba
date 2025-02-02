import { PaymentEntity } from '@app/shared/entities/payment.entity';
import { PickType } from '@nestjs/swagger';

export class CreatePaymentDto extends PickType(PaymentEntity, ['amount']) {}
