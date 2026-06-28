import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';       
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 🚀 AJOUTE CETTE MÉTHODE POUR L'INSCRIPTION :
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) { 
    // Cette méthode va appeler la logique d'inscription dans ton AuthService
    return this.authService.register(registerDto);
  }
}