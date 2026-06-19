import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Valider l'utilisateur et générer un jeton
  async login(loginDto: { email: string; password: string }) {
    // 1. Chercher l'utilisateur avec son mot de passe
    const user = await this.userService.findByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 2. Comparer le mot de passe fourni avec le mot de passe haché en BDD
    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 3. Préparer le contenu du jeton (Payload)
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. Retourner le jeton et les infos publiques de l'utilisateur
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}