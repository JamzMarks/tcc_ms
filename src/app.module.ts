import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'your_jwt_secret', // Use a strong secret in production
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, PrismaService, AuthService],
})
export class AppModule {}
