import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly prefix: string;
  private redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    this.prefix = this.configService.get<string>('REDIS_PREFIX');
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async setTransactionStatus(transactionId: string, status: string) {
    const prefixedKey = this.getPrefixedKey(
      `transaction:${transactionId}:status`,
    );
    await this.redisClient.set(prefixedKey, status);
  }

  async getTransactionStatus(transactionId: string): Promise<string | null> {
    const prefixedKey = this.getPrefixedKey(
      `transaction:${transactionId}:status`,
    );
    return this.redisClient.get(prefixedKey);
  }
}
