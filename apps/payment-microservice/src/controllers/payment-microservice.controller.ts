import { Controller, Get } from '@nestjs/common';
import { PaymentMicroserviceService } from '../services/payment-microservice.service';

@Controller()
export class PaymentMicroserviceController {
  constructor(private readonly paymentMicroserviceService: PaymentMicroserviceService) {}


}
