// Guard d'autorisation basé sur les rôles.
// Il fonctionne avec le décorateur @Roles pour restreindre certaines routes
// à des profils spécifiques (ex: admin seulement).
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles nécessaires depuis le décorateur @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucune règle de rôle n'est définie, on laisse l'accès
    // (seul JwtAuthGuard éventuellement s'appliquera).
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // rempli par JwtStrategy via JwtAuthGuard

    if (!user) return false;

    // Vérifie que le rôle de l'utilisateur fait partie des rôles requis
    return requiredRoles.includes(user.role);
  }
}
