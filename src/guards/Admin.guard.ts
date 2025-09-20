import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Roles } from "generated/prisma";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate{

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; 

        if (!user) return false;

        if(!user.roles.includes(Roles.ADMIN)) {
            return false;
        }
        
        return true;
    }
 }