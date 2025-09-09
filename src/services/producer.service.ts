// src/services/producer.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ProducerService implements OnModuleInit{
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}
    async onModuleInit() {
    const channel = this.amqpConnection.channel;
    await channel.assertExchange('users.exchange', 'topic', { durable: true });

    await channel.assertQueue('users_queue', { durable: true });

    await channel.bindQueue('users_queue', 'users.exchange', 'user.*');
  }
  /**
   * Envia uma mensagem para o RabbitMQ
   * @param routingKey Chave de roteamento (ex: 'user.created')
   * @param payload Dados da mensagem
   */
  async sendMessage(routingKey: string, payload: any): Promise<void> {
    this.amqpConnection.publish('users.exchange', routingKey, payload);
    this.logger.log(`Mensagem enviada -> exchange: exchange_name | routingKey: ${routingKey}`);
  }
}
