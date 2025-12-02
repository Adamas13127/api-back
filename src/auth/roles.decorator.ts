// Décorateur personnalisé @Roles('admin', 'user', ...)
// Permet de déclarer les rôles autorisés directement au niveau des handlers.
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
