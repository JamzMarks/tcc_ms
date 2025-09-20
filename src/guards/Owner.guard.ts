import { CanActivate, ExecutionContext } from '@nestjs/common';
export class OwnerGuard implements CanActivate{

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; 
        const idParam = request.params.id;

        if (!user) return false;

        if(user.sub !== idParam) {
            return false;
        }

        return true;
     }
}