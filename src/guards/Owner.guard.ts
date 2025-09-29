import { CanActivate, ExecutionContext } from '@nestjs/common';

export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const { id, email } = request.params;

    if (id) {
      return user.sub === id; 
    }

    if (email) {
      return user.email === email; 
    }

    return false;
  }
}
