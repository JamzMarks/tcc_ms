import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'generated/prisma';
import { ROLES_KEY } from '@decorators/role.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // if (!requiredRoles) return true;

    // const { user } = context.switchToHttp().getRequest();
    // console.log(user)
    // return requiredRoles.includes(user.role);
    return true
  }
}
