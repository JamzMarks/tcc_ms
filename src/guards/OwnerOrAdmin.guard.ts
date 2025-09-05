import { CanActivate } from '@nestjs/common';
import { Roles } from 'generated/prisma';

export class OwnerOrAdminGuard implements CanActivate{

    async canActivate(context): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; 
        const idParam = request.params.id;

        if (!user) return false;

        if(!user.roles.includes(Roles.ADMIN) && user.sub !== idParam) {
            return false;
        }

        return true;
     }
}