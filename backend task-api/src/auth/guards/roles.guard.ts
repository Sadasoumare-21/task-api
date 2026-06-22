import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../user/roles.decorator'; 
import { Role } from '../../user/role.enum';          

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupérer les rôles requis définis sur la route via @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est spécifié sur la route, elle est accessible par tous
    if (!requiredRoles) {
      return true;
    }

    // 2. Récupérer l'utilisateur de la requête (injecté précédemment par le JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException("Accès refusé : session invalide ou rôle manquant");
    }

    // 3. Vérifier si le rôle de l'utilisateur correspond à l'un des rôles autorisés
    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      throw new ForbiddenException("Accès refusé : vous n'avez pas les privilèges nécessaires");
    }

    return true;
  }
}