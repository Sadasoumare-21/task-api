import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard) // Sécurise toutes les routes météo : utilisateur connecté uniquement
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /** GET /weather/dakar — Renvoyé par défaut si besoin */
  @Get('dakar')
  getDakarWeather() {
    return this.weatherService.getDakarWeather();
  }

  /**
   * GET /weather?city=Paris
   * Récupère la météo d'une ville (Dakar par défaut)
   */
  @Get()
  getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city || 'Dakar');
  }

  /**
   * GET /weather/forecast?city=Paris
   * Récupère les prévisions sur 5 jours
   */
  @Get('forecast')
  getForecast(@Query('city') city: string) {
    return this.weatherService.getForecast(city || 'Dakar');
  }
}
