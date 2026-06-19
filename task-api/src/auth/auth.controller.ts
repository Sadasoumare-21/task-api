import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Renvoie un code 200 au lieu de 201 (car on ne crée pas de ressource)
  login(@Body() loginDto: any) { // Tu pourras créer un LoginDto spécifique plus tard
    return this.authService.login(loginDto);
  }
}