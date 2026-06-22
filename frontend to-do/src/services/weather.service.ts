// src/services/weather.service.ts
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  WeatherService — prêt pour NestJS                                      │
// │                                                                         │
// │  MODE ACTUEL  : appel direct OpenWeatherMap (clé publique démo)         │
// │  MODE NESTJS  : décommentez USE_BACKEND et configurez NESTJS_BASE_URL   │
// │                 Votre backend doit exposer :                             │
// │                   GET /weather?city=Paris                               │
// │                   GET /weather/forecast?city=Paris                      │
// │                 et retourner le même format WeatherData                 │
// └─────────────────────────────────────────────────────────────────────────┘

export interface WeatherData {
  city:        string
  country:     string
  temperature: number        // °C
  feelsLike:   number        // °C
  humidity:    number        // %
  windSpeed:   number        // km/h
  description: string
  icon:        string        // code OpenWeatherMap, ex: "01d"
  condition:   string        // ex: "Clear", "Clouds", "Rain"
  sunrise:     number        // timestamp unix
  sunset:      number        // timestamp unix
  updatedAt:   Date
  timezone?:   number        // Décalage en secondes par rapport à UTC
}

export interface ForecastDay {
  date:        Date
  tempMax:     number
  tempMin:     number
  description: string
  icon:        string
  condition:   string
}

// ─── Configuration ────────────────────────────────────────────────────────────

// ⚠️  Remplacez par votre vraie clé OpenWeatherMap si besoin (gratuite sur openweathermap.org)
//     Ou passez en mode backend NestJS en activant USE_BACKEND ci-dessous.
const OWM_API_KEY    = 'bd5e378503939ddaee76f12ad7a97608' // clé démo publique
const OWM_BASE_URL   = 'https://api.openweathermap.org/data/2.5'

// ─── Backend NestJS ───────────────────────────────────────────────────────────
// Pour activer le backend, passez USE_BACKEND à true et configurez l'URL
const USE_BACKEND    = false
const NESTJS_BASE_URL = 'http://localhost:3000' // même base que votre API

// ─── Helpers ──────────────────────────────────────────────────────────────────

function kelvinToCelsius(k: number): number {
  return Math.round(k - 273.15)
}

function mpsToKmh(mps: number): number {
  return Math.round(mps * 3.6)
}

// ─── Parser de la réponse OpenWeatherMap ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOWMCurrent(data: any): WeatherData {
  return {
    city:        data.name,
    country:     data.sys?.country ?? '',
    temperature: kelvinToCelsius(data.main.temp),
    feelsLike:   kelvinToCelsius(data.main.feels_like),
    humidity:    data.main.humidity,
    windSpeed:   mpsToKmh(data.wind.speed),
    description: data.weather[0].description,
    icon:        data.weather[0].icon,
    condition:   data.weather[0].main,
    sunrise:     data.sys.sunrise,
    sunset:      data.sys.sunset,
    updatedAt:   new Date(),
    timezone:    data.timezone,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOWMForecast(data: any): ForecastDay[] {
  // OWM renvoie des points toutes les 3h — on garde un par jour (12:00)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const days: Record<string, any[]> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0]
    if (!days[date]) days[date] = []
    days[date].push(item)
  })

  return Object.entries(days)
    .slice(0, 5)
    .map(([dateStr, items]) => {
      const temps     = items.map((i) => kelvinToCelsius(i.main.temp))
      const noonItem  = items.find((i) => i.dt_txt.includes('12:00')) ?? items[0]
      return {
        date:        new Date(dateStr),
        tempMax:     Math.max(...temps),
        tempMin:     Math.min(...temps),
        description: noonItem.weather[0].description,
        icon:        noonItem.weather[0].icon,
        condition:   noonItem.weather[0].main,
      }
    })
}

// ─── Service public ───────────────────────────────────────────────────────────

/**
 * Récupère la météo actuelle pour une ville donnée.
 *
 * 🔌 Migration NestJS :
 *   Passez USE_BACKEND à true — votre endpoint /weather?city=... sera appelé
 *   et doit retourner un objet compatible avec WeatherData.
 */
export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  if (USE_BACKEND) {
    // ── NestJS backend ────────────────────────────────────────────────────────
    const res = await fetch(`${NESTJS_BASE_URL}/weather?city=${encodeURIComponent(city)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
    return res.json() as Promise<WeatherData>
  }

  // ── OpenWeatherMap direct ─────────────────────────────────────────────────
  const res = await fetch(
    `${OWM_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&lang=fr`
  )
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Ville introuvable : "${city}"`)
    throw new Error(`Erreur météo : ${res.status}`)
  }
  const data = await res.json()
  return parseOWMCurrent(data)
}

/**
 * Récupère les prévisions sur 5 jours pour une ville donnée.
 *
 * 🔌 Migration NestJS :
 *   Endpoint : GET /weather/forecast?city=...
 *   Retourne : ForecastDay[]
 */
export async function fetchForecast(city: string): Promise<ForecastDay[]> {
  if (USE_BACKEND) {
    // ── NestJS backend ────────────────────────────────────────────────────────
    const res = await fetch(`${NESTJS_BASE_URL}/weather/forecast?city=${encodeURIComponent(city)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
    if (!res.ok) throw new Error(`Forecast API error: ${res.status}`)
    return res.json() as Promise<ForecastDay[]>
  }

  // ── OpenWeatherMap direct ─────────────────────────────────────────────────
  const res = await fetch(
    `${OWM_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&lang=fr`
  )
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Ville introuvable : "${city}"`)
    throw new Error(`Erreur prévisions : ${res.status}`)
  }
  const data = await res.json()
  return parseOWMForecast(data)
}
