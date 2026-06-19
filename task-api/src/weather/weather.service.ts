import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getDakarWeather() {
    // Coordonnées de Dakar (Latitude: 14.6937, Longitude: -17.4479)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.69&longitude=-17.44&current=temperature_2m,weather_code,wind_speed_10m';

    try {
      // 1. Appel asynchrone à l'API externe
      const response = await firstValueFrom(this.httpService.get(url));
      
      // 2. Extraction des données utiles
      const currentData = response.data.current;

      return {
        city: 'Dakar',
        temperature: `${currentData.temperature_2m}°C`,
        windSpeed: `${currentData.wind_speed_10m} km/h`,
        recordedAt: currentData.time,
        datasource: 'Open-Meteo API'
      };
    } catch (error) {
      // Gestion des erreurs au cas où l'API externe est en panne
      throw new HttpException(
        "Impossible de récupérer les données météo pour le moment",
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}