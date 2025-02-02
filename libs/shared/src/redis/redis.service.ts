import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly prefix: string;
  private redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    this.prefix = this.configService.get<string>('REDIS_PREFIX');
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      lazyConnect: true,
    });

    this.redisClient.on('error', (err) => {
      console.error('error initialize redis:', err);
    });

    this.redisClient.on('connect', () => {
      console.log('initialize redis CONNECTED');
    });
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async set(key: string, value: any, ttl: number) {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
