// src/components/ui/WeatherWidget.tsx
import { useState, useRef } from 'react'
import { useWeather } from '../../hooks/useWeather'
import {
  SunIcon,
  CloudIcon,
  RainIcon,
  DrizzleIcon,
  CloudLightningIcon,
  SnowflakeIcon,
  MistIcon,
  TornadoIcon,
  WindyIcon,
  VolcanoIcon,
  ThermometerIcon,
  AlertIcon,
  SearchIcon,
  HumidityIcon,
  WindIcon,
  SunriseIcon,
  SunsetIcon
} from '../ui/Icons'

// ─── Helpers visuels ──────────────────────────────────────────────────────────

function getWeatherIcon(condition: string, size = 16, color = 'currentColor'): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    Clear:        <SunIcon size={size} color={color} />,
    Clouds:       <CloudIcon size={size} color={color} />,
    Rain:         <RainIcon size={size} color={color} />,
    Drizzle:      <DrizzleIcon size={size} color={color} />,
    Thunderstorm: <CloudLightningIcon size={size} color={color} />,
    Snow:         <SnowflakeIcon size={size} color={color} />,
    Mist:         <MistIcon size={size} color={color} />,
    Fog:          <MistIcon size={size} color={color} />,
    Haze:         <MistIcon size={size} color={color} />,
    Sand:         <TornadoIcon size={size} color={color} />,
    Dust:         <WindyIcon size={size} color={color} />,
    Ash:          <VolcanoIcon size={size} color={color} />,
    Squall:       <WindyIcon size={size} color={color} />,
    Tornado:      <TornadoIcon size={size} color={color} />,
  }
  return map[condition] ?? <ThermometerIcon size={size} color={color} />
}

function getWeatherGradient(condition: string): string {
  const map: Record<string, string> = {
    Clear:        'linear-gradient(135deg, #1a3a6b 0%, #2563ab 50%, #1d4ed8 100%)',
    Clouds:       'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
    Rain:         'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    Drizzle:      'linear-gradient(135deg, #1a2a3a 0%, #2a4a6a 50%, #1e3a5f 100%)',
    Thunderstorm: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    Snow:         'linear-gradient(135deg, #1a2540 0%, #2a4060 50%, #1e3050 100%)',
    Mist:         'linear-gradient(135deg, #1e2432 0%, #2d3748 50%, #1a2333 100%)',
  }
  return map[condition] ?? 'linear-gradient(135deg, #0d1426 0%, #1a2540 100%)'
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDay(date: Date): string {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  return days[date.getDay()]
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function WeatherWidget() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [inputVal,   setInputVal]   = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { current, forecast, loading, error, setCity, refresh } = useWeather('Paris')

  const handleSearch = () => {
    const val = inputVal.trim()
    if (val) {
      setCity(val)
      setInputVal('')
      setSearchOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setSearchOpen(false)
  }

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  // ── Skeleton de chargement ─────────────────────────────────────────────────
  if (loading && !current) {
    return (
      <div className="weather-widget weather-skeleton">
        <div className="weather-skeleton-main" />
        <div className="weather-skeleton-row">
          {[1,2,3].map(i => <div key={i} className="weather-skeleton-pill" />)}
        </div>
        <div className="weather-skeleton-forecast">
          {[1,2,3,4,5].map(i => <div key={i} className="weather-skeleton-day" />)}
        </div>
      </div>
    )
  }

  // ── Erreur ─────────────────────────────────────────────────────────────────
  if (error && !current) {
    return (
      <div className="weather-widget weather-error-state">
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--red)', marginBottom: 12 }}>
          <AlertIcon size={36} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 6 }}>
          Impossible de charger la météo
        </p>
        <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16, lineHeight: 1.5 }}>
          {error}
        </p>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 16px', gap: 6 }} onClick={refresh}>
          <svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Réessayer
        </button>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 16px', marginTop: 6, gap: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={openSearch}>
          <SearchIcon size={12} /> Autre ville
        </button>
      </div>
    )
  }

  if (!current) return null
  const gradient = getWeatherGradient(current.condition)

  return (
    <div className="weather-widget" style={{ background: gradient }}>

      {/* ── Halo lumineux décoratif ──────────────────────────────────── */}
      <div className="weather-glow" />

      {/* ── Header : ville + actions ─────────────────────────────────── */}
      <div className="weather-header">
        <div className="weather-location" onClick={openSearch} title="Changer de ville">
          <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span>{current.city}, {current.country}</span>
          <svg width={10} height={10} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {/* Bouton refresh */}
          <button
            className="weather-icon-btn"
            onClick={refresh}
            title="Actualiser"
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            <svg
              width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
              style={{ animation: loading ? 'spin .8s linear infinite' : 'none' }}
            >
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Barre de recherche ───────────────────────────────────────── */}
      {searchOpen && (
        <div className="weather-search-bar fx-in">
          <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ opacity: 0.5, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            className="weather-search-input"
            placeholder="Paris, Tokyo, New York…"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="weather-icon-btn" onClick={handleSearch} title="Rechercher">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <button className="weather-icon-btn" onClick={() => setSearchOpen(false)} title="Fermer">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── Température principale ───────────────────────────────────── */}
      <div className="weather-main">
        <div className="weather-emoji" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getWeatherIcon(current.condition, 48)}</div>
        <div className="weather-temp">{current.temperature}°</div>
        <div className="weather-desc">{capitalize(current.description)}</div>
        <div className="weather-feels">Ressenti {current.feelsLike}°C</div>
      </div>

      {/* ── Métriques ────────────────────────────────────────────────── */}
      <div className="weather-metrics">
        <div className="weather-metric">
          <span className="weather-metric-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HumidityIcon size={16} /></span>
          <span className="weather-metric-val">{current.humidity}%</span>
          <span className="weather-metric-lbl">Humidité</span>
        </div>
        <div className="weather-metric-sep" />
        <div className="weather-metric">
          <span className="weather-metric-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WindIcon size={16} /></span>
          <span className="weather-metric-val">{current.windSpeed} km/h</span>
          <span className="weather-metric-lbl">Vent</span>
        </div>
        <div className="weather-metric-sep" />
        <div className="weather-metric">
          <span className="weather-metric-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SunriseIcon size={16} /></span>
          <span className="weather-metric-val">{formatTime(current.sunrise)}</span>
          <span className="weather-metric-lbl">Lever</span>
        </div>
        <div className="weather-metric-sep" />
        <div className="weather-metric">
          <span className="weather-metric-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SunsetIcon size={16} /></span>
          <span className="weather-metric-val">{formatTime(current.sunset)}</span>
          <span className="weather-metric-lbl">Coucher</span>
        </div>
      </div>

      {/* ── Prévisions 5 jours ───────────────────────────────────────── */}
      {forecast.length > 0 && (
        <div className="weather-forecast">
          <div className="weather-forecast-title">Prévisions 5 jours</div>
          <div className="weather-forecast-days">
            {forecast.map((day, i) => (
              <div key={i} className="weather-forecast-day">
                <span className="weather-forecast-label">{i === 0 ? "Auj." : formatDay(day.date)}</span>
                <span className="weather-forecast-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getWeatherIcon(day.condition, 16)}
                </span>
                <span className="weather-forecast-max">{day.tempMax}°</span>
                <span className="weather-forecast-min">{day.tempMin}°</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer : heure de mise à jour ────────────────────────────── */}
      <div className="weather-footer">
        Mis à jour à {current.updatedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
