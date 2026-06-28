import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/user/role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 🚀 LOGIQUE D'INSCRIPTION (REGISTER)
  async register(registerDto: CreateUserDto) { 
  const existingUser = await this.userService.findByEmail(registerDto.email);
  if (existingUser) {
    throw new ConflictException('Un utilisateur avec cet email existe déjà');
  }

  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  // Lors de la création, si registerDto.role n'est pas défini, passe-lui la valeur par défaut de l'enum
  const newUser = await this.userService.create({
    email: registerDto.email,
    password: hashedPassword,
    role: registerDto.role || Role.USER, // <-- Plus d'erreur ici car les deux côtés utilisent l'enum "Role"
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