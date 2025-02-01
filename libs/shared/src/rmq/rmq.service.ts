import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RMQ_URL')],
        queue: this.configService.get<string>(`RMQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  nAck(context: RmqContext, requeue = true) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.nack(originalMessage, false, requeue);
  }
}
