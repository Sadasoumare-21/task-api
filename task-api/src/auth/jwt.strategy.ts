import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_SUPER_SECURISÉ_D_EXAMEN', // Dans un vrai projet, on utilise une variable d'environnement (.env)
    });
  }

  // Cette méthode s'exécute automatiquement si le token est valide
  async validate(payload: { sub: number; email: string }) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non autorisé');
    }
    // Ce qui est retourné ici sera automatiquement injecté dans l'objet Request (req.user)
    return user;
  }
}