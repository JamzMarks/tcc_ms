import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Primeiro tenta pegar do header Authorization
    let token: string | undefined;
    const authorizationHeader = request.headers.authorization;

    if (authorizationHeader) {
      const [type, value] = authorizationHeader.split(' ');
      if (type === 'Bearer' && value) {
        token = value;
      }
    }

    // Se não achou no header, tenta no cookie "access_token"
    if (!token && request.cookies?.access_token) {
      token = request.cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      (request as any).user = payload; // ✅ adiciona o user decodificado na request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
