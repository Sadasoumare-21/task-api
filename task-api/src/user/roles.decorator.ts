import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum'; // L'import est plus simple car ils sont dans le même dossier

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);