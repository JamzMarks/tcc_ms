import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoginDto } from 'src/dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  
    async signin(dto: LoginDto){
        const normalizedEmail = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: {email: normalizedEmail}});


        if (!user || !(await compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
  
}
