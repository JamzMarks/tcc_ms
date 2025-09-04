import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    TerminusModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Use a strong secret in production
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, PrismaService, AuthService],
})
export class AppModule {}
