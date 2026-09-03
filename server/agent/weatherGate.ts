// weatherGate.ts — Deterministic safety gate (no LLM involved)
export interface WeatherDataPayload {
  available?: boolean;
  temp?: number;
  location?: string;
  humidity?: number;
  rain?: number;
  wind?: number;
  condition?: string;
  forecast?: Array<{
    day?: string;
    hoursFromNow?: number;
    precipitationMm?: number;
    rainChance?: number;
    date?: string;
    windKph?: number;
  }>;
  current?: {
    humidityPercent?: number;
    windKph?: number;
    precipitationMm?: number;
  };
}

export interface WeatherGateResult {
  blocked: boolean;
  reason: string;
  recommended_window?: string;
  degraded?: boolean;
  conditions?: {
    rainForecastMm: number;
    windKph: number;
    humidity: number;
  };
}

export function weatherGate(weatherData: WeatherDataPayload | null | undefined): WeatherGateResult {
  const rainThreshold = parseFloat(process.env.AGROCARE_WEATHER_RAIN_THRESHOLD_MM || '2.5');
  const windThreshold = parseFloat(process.env.AGROCARE_WEATHER_WIND_THRESHOLD_KPH || '30');

  if (!weatherData || weatherData.available === false) {
    return {
      blocked: false,
      reason: 'Weather data temporarily unavailable — proceed with caution and inspect local field conditions before chemical spraying.',
      degraded: true
    };
  }

  // Check 24-hour precipitation forecast
  const rainNext24h = weatherData.forecast?.some((day) => {
    const hours = day.hoursFromNow ?? 0;
    const precip = day.precipitationMm ?? ((day.rainChance ?? 0) > 60 ? 5.0 : 0);
    return hours <= 24 && precip >= rainThreshold;
  }) || (weatherData.rain !== undefined && weatherData.rain > 50);

  const humidity = weatherData.current?.humidityPercent ?? weatherData.humidity ?? 60;
  const windKph = weatherData.current?.windKph ?? weatherData.wind ?? 12;

  if (rainNext24h) {
    const dryWindow = weatherData.forecast?.find(d => (d.precipitationMm ?? 0) < 1 && (d.rainChance ?? 0) < 30)?.date ||
                      weatherData.forecast?.find(d => (d.hoursFromNow ?? 0) > 24)?.day ||
                      'Wait 48 hours for clear skies and dry canopy';

    return {
      blocked: true,
      reason: `Rain forecast within 24 hours. Chemical spray will wash off foliage into groundwater and be ineffective. Spraying must be postponed.`,
      recommended_window: dryWindow,
      degraded: false,
      conditions: {
        rainForecastMm: rainThreshold,
        windKph,
        humidity
      }
    };
  }

  if (windKph > windThreshold) {
    return {
      blocked: true,
      reason: `High winds detected (${windKph} km/h > ${windThreshold} km/h limit). Spray drift risk to adjacent non-target crops and pollinators. Wait for calm morning conditions (< 15 km/h).`,
      recommended_window: 'Early morning window (06:00 - 08:30 AM) with calm winds',
      degraded: false,
      conditions: {
        rainForecastMm: 0,
        windKph,
        humidity
      }
    };
  }

  return {
    blocked: false,
    reason: 'Weather conditions suitable for treatment (clear sky, moderate wind & dry foliage window).',
    degraded: false,
    conditions: {
      rainForecastMm: 0,
      windKph,
      humidity
    }
  };
}
