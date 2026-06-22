import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const OWM_API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Clé démo publique identique au Frontend
const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function kelvinToCelsius(k: number): number {
  return Math.round(k - 273.15);
}

function mpsToKmh(mps: number): number {
  return Math.round(mps * 3.6);
}

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Conserve la méthode d'origine pour Dakar (via Open-Meteo) pour compatibilité
   */
  async getDakarWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.69&longitude=-17.44&current=temperature_2m,weather_code,wind_speed_10m';

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const currentData = response.data.current;

      return {
        city: 'Dakar',
        temperature: `${currentData.temperature_2m}°C`,
        windSpeed: `${currentData.wind_speed_10m} km/h`,
        recordedAt: currentData.time,
        datasource: 'Open-Meteo API',
      };
    } catch {
      throw new HttpException(
        "Impossible de récupérer les données météo de Dakar",
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }

  /**
   * Récupère la météo actuelle pour n'importe quelle ville.
   * Retourne exactement le format attendu par l'interface WeatherData du Frontend.
   */
  async getWeather(city: string) {
    const url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&lang=fr`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      return {
        city: data.name,
        country: data.sys?.country ?? '',
        temperature: kelvinToCelsius(data.main.temp),
        feelsLike: kelvinToCelsius(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: mpsToKmh(data.wind.speed),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        condition: data.weather[0].main,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        updatedAt: new Date(),
      };
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = status === 404 ? `Ville introuvable : "${city}"` : "Erreur de l'API météo externe";
      throw new HttpException(message, status);
    }
  }

  /**
   * Récupère les prévisions météo sur 5 jours pour n'importe quelle ville.
   * Retourne exactement le format attendu par l'interface ForecastDay[] du Frontend.
   */
  async getForecast(city: string) {
    const url = `${OWM_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&lang=fr`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      const days: Record<string, any[]> = {};
      data.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) days[date] = [];
        days[date].push(item);
      });

      return Object.entries(days)
        .slice(0, 5)
        .map(([dateStr, items]) => {
          const temps = items.map((i) => kelvinToCelsius(i.main.temp));
          const noonItem = items.find((i) => i.dt_txt.includes('12:00')) ?? items[0];
          return {
            date: new Date(dateStr),
            tempMax: Math.max(...temps),
            tempMin: Math.min(...temps),
            description: noonItem.weather[0].description,
            icon: noonItem.weather[0].icon,
            condition: noonItem.weather[0].main,
          };
        });
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = status === 404 ? `Ville introuvable : "${city}"` : "Erreur de l'API de prévision externe";
      throw new HttpException(message, status);
    }
  }
}