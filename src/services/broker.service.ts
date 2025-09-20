// logger.service.ts
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrokerService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async log(
    message: string,
    level: 'info' | 'warn' | 'error' = 'info',
    context?: { userId?: string; action?: string; requestId?: string },
  ) {
    const payload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'unknown-service',
      ...context,
    };

    await this.amqpConnection.publish('log_event', `logs.${level}`, payload);
    console.log(`[📤 Log enviado]: ${payload.message}`);
  }
}
