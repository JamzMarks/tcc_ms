import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TerminusModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.RABBITMQ_USERMS_QUEUE!,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Use a strong secret in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, PrismaService, AuthService],
})
export class AppModule {}
