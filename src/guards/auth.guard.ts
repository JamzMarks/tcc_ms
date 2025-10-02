import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any; 
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    let token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractToken(request: AuthRequest): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, value] = authHeader.split(' ');
      if (type === 'Bearer' && value) return value;
    }

    if (request.cookies?.access_token) {
      return request.cookies.access_token;
    }

    return undefined;
  }
}
