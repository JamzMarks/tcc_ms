import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoginDto } from 'src/dto/login.dto';
import { compare } from 'bcrypt';
import { hashPassword } from '@utils/HashPassword';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(dto: LoginDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return payload;
  }

  async updateUserPassword(
    id: string,
    newPassword: string,
    confirmationPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    console.log(confirmationPassword)
    const isMatch = await compare(confirmationPassword, user.password);
    console.log(isMatch);
    console.log(user)
    if (!isMatch) {
      throw new UnauthorizedException('Current password incorrect.');
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}
