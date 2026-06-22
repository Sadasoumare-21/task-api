import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * On surcharge handleRequest pour personnaliser le message d'erreur renvoyé
   * au Frontend. Sans ça, NestJS renvoie un message générique peu exploitable.
   */
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: { message?: string } | undefined,
  ): TUser {
    // "info" contient le détail de l'échec Passport (token expiré, malformé…)
    if (err || !user) {
      const reason = info?.message ?? 'Token JWT manquant ou invalide.';
      throw new UnauthorizedException(reason);
    }
    return user;
  }

  // canActivate n'a pas besoin d'être surchargé : Passport gère tout
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}