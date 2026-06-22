// src/hooks/useWeather.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchCurrentWeather,
  fetchForecast,
  type WeatherData,
  type ForecastDay,
} from '../services/weather.service'

interface WeatherState {
  current:    WeatherData | null
  forecast:   ForecastDay[]
  loading:    boolean
  error:      string | null
  city:       string
  setCity:    (city: string) => void
  refresh:    () => void
}

const DEFAULT_CITY     = 'Paris'
const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes

export function useWeather(initialCity = DEFAULT_CITY): WeatherState {
  const [city,    setCity]    = useState(initialCity)
  const [current, setCurrent] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (targetCity: string) => {
    setLoading(true)
    setError(null)
    try {
      const [cur, fore] = await Promise.all([
        fetchCurrentWeather(targetCity),
        fetchForecast(targetCity),
      ])
      setCurrent(cur)
      setForecast(fore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger quand la ville change
  useEffect(() => {
    load(city)
    // Rafraîchissement automatique toutes les 10 minutes
    intervalRef.current = setInterval(() => load(city), REFRESH_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [city, load])

  return {
    current,
    forecast,
    loading,
    error,
    city,
    setCity,
    refresh: () => load(city),
  }
}
