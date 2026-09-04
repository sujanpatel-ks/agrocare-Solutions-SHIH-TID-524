export interface SensorTelemetry {
  status: 'online' | 'offline' | 'degraded';
  soilMoisturePercent: number;
  canopyTemperatureC: number;
  leafWetnessIndex: number;
  ambientLux: number;
  batteryLevelPercent: number;
  recordedAt: string;
}

const toNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export async function fetchSensorTelemetry(signal?: AbortSignal): Promise<SensorTelemetry> {
  const response = await fetch('/api/context/sensors', { signal });
  if (!response.ok) throw new Error(`Sensor gateway returned ${response.status}`);

  const raw = await response.json() as Record<string, unknown>;
  return {
    status: raw.status === 'offline' || raw.status === 'degraded' ? raw.status : 'online',
    soilMoisturePercent: toNumber(raw.soilMoisture, 0),
    canopyTemperatureC: toNumber(raw.canopyTemperature, 0),
    leafWetnessIndex: toNumber(raw.leafWetnessIndex, 0),
    ambientLux: toNumber(raw.ambientLux, 0),
    batteryLevelPercent: Math.max(0, Math.min(100, toNumber(raw.batteryLevel, 0))),
    recordedAt: typeof raw.recordedAt === 'string' ? raw.recordedAt : new Date().toISOString(),
  };
}
