import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule, // Permet d'appeler le UserService
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_SUPER_SECURISÉ_D_EXAMEN',
      signOptions: { expiresIn: '1d' }, // Le jeton expire au bout d'un jour
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}