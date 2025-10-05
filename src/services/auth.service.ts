import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoginDto } from 'src/dto/login.dto';
import { compare } from 'bcrypt';
import { hashPassword } from '@utils/HashPassword';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from '@dtos/auth/payload.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(dto: LoginDto, res: Response): Promise<any> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = this.buildTokenPayload(user);
    const { access_token, refresh_token } = await this.generateTokens(payload);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return {
      user: payload,
      // access_token,
      // refresh_token,
    };
  }

  async updateUserPassword(
    id: string,
    newPassword: string,
    confirmationPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    console.log(confirmationPassword);
    const isMatch = await compare(confirmationPassword, user.password);
    console.log(isMatch);
    console.log(user);
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

  async refreshAccessToken(refresh_token: string): Promise<string> {
    console.log(refresh_token);
    if (!refresh_token) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const isValid = await this.validateRefreshToken(refresh_token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const decoded = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = this.buildTokenPayload(user);
    const { access_token } = await this.generateTokens(payload);

    return access_token;
  }

  private async validateRefreshToken(refreshToken: string): Promise<Boolean> {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  private buildTokenPayload(user: any): PayloadDto {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.firstName + ' ' + user.lastName,
    };
    return payload;
  }

  async generateTokens(payload: PayloadDto) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(
      { sub: payload.sub },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
    return { access_token, refresh_token };
  }
}
