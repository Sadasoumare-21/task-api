import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 🚀 LOGIQUE D'INSCRIPTION (REGISTER)
  async register(registerDto: { email: string; password: string }) {
    // 1. Vérification propre de l'existence de l'utilisateur
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // 2. L'unique hachage robuste du mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 3. Création via le UserService
    const newUser = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    // 4. Token JWT
    const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  // LOGIQUE DE CONNEXION (LOGIN)
  async login(loginDto: { email: string; password: string }) {
    console.log('Données reçues au login :', loginDto);
    const user = await this.userService.findByEmailWithPassword(loginDto.email);
    console.log('Utilisateur trouvé en BDD :', user);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

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