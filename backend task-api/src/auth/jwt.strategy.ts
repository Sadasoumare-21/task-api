import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { Role } from '../user/role.enum';

// ─── Types stricts (partagés avec le contrôleur via le Request) ───────────────

/** Structure exacte du payload encodé dans le JWT lors de la connexion */
export interface JwtPayload {
  sub: number;   // ID de l'utilisateur (subject standard JWT)
  email: string;
  role: Role;
}

/**
 * Ce que Passport injecte dans req.user après validation du token.
 * Volontairement minimal : pas de password, pas de relations chargées.
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: Role;
}

// ─── Stratégie JWT ────────────────────────────────────────────────────────────

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      // Lit le token depuis le header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Un token expiré est rejeté automatiquement
      ignoreExpiration: false,
      // Doit être identique au secret utilisé dans JwtModule.register()
      secretOrKey: process.env.JWT_SECRET ?? 'SECRET_SUPER_SECURISÉ_D_EXAMEN',
    });
  }

  /**
   * Appelé automatiquement par Passport APRÈS vérification de la signature du token.
   * On vérifie en plus que l'utilisateur existe toujours en base.
   * La valeur retournée sera disponible sous req.user dans les contrôleurs.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // 🟢 CORRIGÉ : On passe le payload extrait du token en 2ème argument pour satisfaire la signature de findOne
    const user = await this.userService.findOne(payload.sub, {
      id: payload.sub,
      role: payload.role,
    });

    if (!user) {
      throw new UnauthorizedException('Token invalide : utilisateur introuvable.');
    }

    // On retourne uniquement ce dont les contrôleurs ont besoin
    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
    };
  }
}