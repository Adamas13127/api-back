// Guard d'authentification basé sur la stratégie "jwt".
// Il vérifie automatiquement la présence et la validité du token Bearer.
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
