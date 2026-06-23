// src/services/weather.service.ts
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  WeatherService — Open-Meteo (aucune clé API requise, gratuit)          │
// │                                                                         │
// │  Géocodage : https://geocoding-api.open-meteo.com (city → lat/lon)     │
// │  Météo     : https://api.open-meteo.com           (lat/lon → données)  │
// └─────────────────────────────────────────────────────────────────────────┘

export interface WeatherData {
  city:        string
  country:     string
  temperature: number        // °C
  feelsLike:   number        // °C
  humidity:    number        // %
  windSpeed:   number        // km/h
  description: string
  icon:        string        // "01d" | "01n" (day/night détecté via sunrise/sunset)
  condition:   string        // "Clear" | "Clouds" | "Rain" …
  sunrise:     number        // timestamp unix (secondes)
  sunset:      number        // timestamp unix (secondes)
  updatedAt:   Date
  timezone?:   number        // décalage UTC en secondes
}

export interface ForecastDay {
  date:        Date
  tempMax:     number
  tempMin:     number
  description: string
  icon:        string
  condition:   string
}

// ─── WMO code → condition / description ───────────────────────────────────────

interface WmoInfo { condition: string; description: string }

function wmoToInfo(code: number): WmoInfo {
  if (code === 0)              return { condition:'Clear',       description:'ciel dégagé' }
  if (code === 1)              return { condition:'Clear',       description:'principalement dégagé' }
  if (code === 2)              return { condition:'Clouds',      description:'partiellement nuageux' }
  if (code === 3)              return { condition:'Clouds',      description:'couvert' }
  if (code === 45 || code === 48) return { condition:'Mist',    description:'brouillard' }
  if (code >= 51 && code <= 55)  return { condition:'Drizzle',  description:'bruine' }
  if (code >= 61 && code <= 67)  return { condition:'Rain',     description:'pluie' }
  if (code >= 71 && code <= 77)  return { condition:'Snow',     description:'neige' }
  if (code >= 80 && code <= 82)  return { condition:'Rain',     description:'averses' }
  if (code >= 85 && code <= 86)  return { condition:'Snow',     description:'averses de neige' }
  if (code >= 95 && code <= 99)  return { condition:'Thunderstorm', description:'orage' }
  return { condition:'Clouds', description:'nuageux' }
}

// ─── Géocodage Open-Meteo ─────────────────────────────────────────────────────

interface GeoResult {
  name: string
  country_code: string
  latitude: number
  longitude: number
  timezone: string
}

async function geocode(city: string): Promise<GeoResult> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`
  )
  if (!res.ok) throw new Error(`Géocodage échoué : ${res.status}`)
  const data = await res.json()
  if (!data.results?.length) throw new Error(`Ville introuvable : "${city}"`)
  return data.results[0] as GeoResult
}

// ─── Service public ───────────────────────────────────────────────────────────

/**
 * Récupère la météo actuelle pour une ville donnée.
 */
export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const geo = await geocode(city)

  const url = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${geo.latitude}&longitude=${geo.longitude}`,
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`,
    `&daily=sunrise,sunset`,
    `&timezone=${encodeURIComponent(geo.timezone)}`,
    `&forecast_days=1`,
  ].join('')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`API météo : ${res.status}`)
  const data = await res.json()

  const cur = data.current
  const info = wmoToInfo(cur.weather_code)

  // Sunrise / sunset du jour (format ISO)
  const sunriseTs = Math.floor(new Date(data.daily.sunrise[0]).getTime() / 1000)
  const sunsetTs  = Math.floor(new Date(data.daily.sunset[0]).getTime() / 1000)
  const nowTs     = Math.floor(Date.now() / 1000)
  const isDay     = nowTs >= sunriseTs && nowTs < sunsetTs

  // Décalage UTC fourni directement par Open-Meteo (en secondes)
  const tzOffsetSeconds: number = data.utc_offset_seconds ?? 0

  return {
    city:        geo.name,
    country:     geo.country_code,
    temperature: Math.round(cur.temperature_2m),
    feelsLike:   Math.round(cur.apparent_temperature),
    humidity:    cur.relative_humidity_2m,
    windSpeed:   Math.round(cur.wind_speed_10m),
    description: info.description,
    icon:        isDay ? '01d' : '01n',   // suffixe 'n' = nuit → 🌙 dans le widget
    condition:   info.condition,
    sunrise:     sunriseTs,
    sunset:      sunsetTs,
    updatedAt:   new Date(),
    timezone:    tzOffsetSeconds,
  }
}

/**
 * Récupère les prévisions sur 5 jours pour une ville donnée.
 */
export async function fetchForecast(city: string): Promise<ForecastDay[]> {
  const geo = await geocode(city)

  const url = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${geo.latitude}&longitude=${geo.longitude}`,
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset`,
    `&timezone=${encodeURIComponent(geo.timezone)}`,
    `&forecast_days=5`,
  ].join('')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`API prévision : ${res.status}`)
  const data = await res.json()

  return (data.daily.time as string[]).map((dateStr: string, i: number) => {
    const info = wmoToInfo(data.daily.weather_code[i])
    return {
      date:        new Date(dateStr),
      tempMax:     Math.round(data.daily.temperature_2m_max[i]),
      tempMin:     Math.round(data.daily.temperature_2m_min[i]),
      description: info.description,
      icon:        '01d',
      condition:   info.condition,
    }
  })
}
