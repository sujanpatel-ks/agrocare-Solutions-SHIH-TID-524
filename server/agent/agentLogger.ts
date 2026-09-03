// agentLogger.ts — Google Cloud Logging / Telemetry Logger
export interface LogData {
  [key: string]: any;
}

export function sanitize(data: LogData): LogData {
  if (!data || typeof data !== 'object') return data;
  const safe = { ...data };
  
  // Strip sensitive PII
  delete safe.farmerId;
  delete safe.phone;
  delete safe.phoneNumber;
  delete safe.email;
  delete safe.farmerName;
  delete safe.uid;

  // Mask heavy image/audio strings
  if (safe.imageBase64 && typeof safe.imageBase64 === 'string') {
    safe.imageBase64 = `[Base64 Image Payload - ${Math.round(safe.imageBase64.length / 1024)} KB]`;
  }
  if (safe.audioBase64 && typeof safe.audioBase64 === 'string') {
    safe.audioBase64 = `[Base64 Audio Payload - ${Math.round(safe.audioBase64.length / 1024)} KB]`;
  }

  return safe;
}

export function log(message: string, data: LogData = {}) {
  const timestamp = new Date().toISOString();
  const safeData = sanitize(data);
  const entry = {
    timestamp,
    service: 'agrocare-agent-orchestrator',
    message,
    ...(Object.keys(safeData).length > 0 && { metadata: safeData })
  };

  console.log(`[AGROCARE AGENT] ${message}`, Object.keys(safeData).length ? JSON.stringify(safeData) : '');
  return entry;
}
