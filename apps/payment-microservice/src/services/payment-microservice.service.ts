import { Injectable, Inject } from '@nestjs/common';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { SCORE_SERVICE } from '@app/shared/constants/name-microservice';
import { KEYS_RQM } from '@app/shared/constants/keys.constant';
import { v4 as uuidv4 } from 'uuid';
import { PaymentRepository } from '../repository/payment.repository';
import { CreatePaymentDto } from '@app/shared/dtos/payment/create-payment.dto';
import { RedisService } from '@app/shared/redis/redis.service';
import { PaymentStatusEnum } from '@app/shared/enums/payment.enum';
import { PaymentEntity } from '@app/shared/entities/payment.entity';
import {
  NotAcceptableRpcException,
  NotFoundRpcException,
} from '@app/shared/filters/custom-rpc-exception/custm-rpc-exception';
import { ProcessPaymentDto } from '@app/shared/dtos/payment/process-payment.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentMicroserviceService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @Inject(SCORE_SERVICE) private readonly scoreClient: ClientProxy,
    private readonly connection: Connection,
    private readonly redisService: RedisService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto & { userId: number }) {
    try {
      const { userId, amount } = createPaymentDto;

      const transactionId = uuidv4();
      const redisKey = `transaction:${transactionId}`;

      const payment = this.paymentRepository.create({
        amount,
        userId,
        transactionId,
        status: PaymentStatusEnum.PENDING,
      });
      await this.paymentRepository.save(payment);

      await this.redisService.set(redisKey, payment, 600);

      const paymentLink = this.generatePaymentLink(transactionId);

      return {
        paymentLink,
      };
    } catch (error) {
      throw new NotAcceptableRpcException(`پرداخت انجام نشد: ${error}`);
    }
  }

  async processPayment(data: ProcessPaymentDto) {
    const { transactionId, status } = data;
    const redisKey = `transaction:${transactionId}`;
    const cachedPayment = await this.redisService.get<PaymentEntity>(redisKey);
    if (!cachedPayment) {
      throw new NotFoundRpcException('تراکنش منقضی یا پردازش شده است');
    }

    const payment = cachedPayment;
    const userId = payment.userId;

    payment.status = status;

    try {
      payment.updatedAt = new Date();
      await this.paymentRepository.save(payment);

      if (status === PaymentStatusEnum.SUCCESS) {
        const pointsEarned = this.calculatePoints(payment.amount);
        await firstValueFrom(
          this.scoreClient.emit(
            { cmd: KEYS_RQM.ADD_POINTS_TO_USER },
            { userId: userId, score: Number(pointsEarned) },
          ),
        );
      }
      await this.redisService.del(redisKey);

      return {
        message: 'پرداخت با موفقیت آپدیت شد',
        transactionId,
        status: payment.status,
      };
    } catch (error) {
      throw new NotAcceptableRpcException(`پرداخت انجام نشد: ${error}`);
    }
  }

  private generatePaymentLink(transactionId: string): string {
    return `http://localhost/pay?transactionId=${transactionId}`;
  }

  private calculatePoints(amount: number): number {
    if (amount > 200000) {
      return 2;
    } else if (amount > 100000) {
      return 1;
    }
    return 0;
  }
}
