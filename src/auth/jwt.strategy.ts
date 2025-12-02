// Stratégie Passport qui permet de valider les tokens JWT "access".
// Elle est utilisée par le guard JwtAuthGuard pour protéger les routes.
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // On lit le token depuis l'en-tête Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ⚠️ DOIT être exactement le même que dans AuthModule / AuthService
      secretOrKey: process.env.JWT_SECRET || 'secret123',
    });
  }

  // Méthode appelée automatiquement si le token est valide.
  // On peut ici "façonner" l'objet user qui sera attaché à req.user.
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
