import { Controller, Get, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('dakar')
  @UseGuards(JwtAuthGuard) // Optionnel : Seul un utilisateur connecté peut consulter la météo
  getDakarWeather() {
    return this.weatherService.getDakarWeather();
  }
}
