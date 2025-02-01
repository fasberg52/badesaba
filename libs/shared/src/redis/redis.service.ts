import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { PaymentStatusEnum } from '../enums/payment.enum';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async setTransactionStatus(transactionId: string, status: PaymentStatusEnum.PENDING) {
    await this.redisClient.set(`transaction:${transactionId}:status`, status);
  }

  async getTransactionStatus(transactionId: string): Promise<string | null> {
    return this.redisClient.get(`transaction:${transactionId}:status`);
  }
}
