import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  // 🚀 AJOUTE CETTE MÉTHODE POUR L'INSCRIPTION :
  @Post('register')
  register(@Body() registerDto: any) { 
    // Cette méthode va appeler la logique d'inscription dans ton AuthService
    return this.authService.register(registerDto);
  }
}