import { SetMetadata } from '@nestjs/common';
import { Roles as RolesEnum} from 'generated/prisma';

export const ROLES_KEY = 'roles';
export const Role = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
