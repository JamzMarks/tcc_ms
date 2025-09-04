import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext,): Promise<boolean> { 

    const request = context.switchToHttp().getRequest();
    const rawCookie = request.cookies?.['access_token'];
    const token = typeof rawCookie === 'string' ? rawCookie : rawCookie?.access_token;
    if (!token) throw new UnauthorizedException('Token não encontrado');
    
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
