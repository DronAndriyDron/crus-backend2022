import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/types/userroles.type';

export const ROLES_KEY= 'roles';

export const Roles = (...args: UserRole[]) => SetMetadata(ROLES_KEY, args);