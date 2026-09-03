// Sentinel — Deterministic pre-check in application code BEFORE any LLM call
export interface SentinelInput {
  diagnosis?: {
    disease?: string;
    crop?: string;
    confidence?: number;
    severity?: string;
  } | null;
  weather?: any;
  sensorData?: any;
  image?: string | null;
  farmerContext?: {
    location?: string;
    lat?: number;
    lng?: number;
    farmSizeHectares?: number;
    crops?: string[];
  } | null;
}

export interface SentinelOutput {
  risk_detected: boolean;
  risk_level: 'low' | 'medium' | 'high';
  signals: Array<{ type: string; value: any; message: string }>;
  missing_context: string[];
  requires_planning: boolean;
}

export function runSentinel(input: SentinelInput): SentinelOutput {
  const { diagnosis, weather, sensorData, farmerContext } = input;
  const signals: Array<{ type: string; value: any; message: string }> = [];
  const missing: string[] = [];

  const threshold = parseFloat(process.env.AGROCARE_ESCALATION_THRESHOLD || '0.70');

  // Check diagnosis confidence
  if (diagnosis && typeof diagnosis.confidence === 'number') {
    // Confidence can be 0.0 - 1.0 or 0 - 100
    const normalizedConfidence = diagnosis.confidence > 1 ? diagnosis.confidence / 100 : diagnosis.confidence;
    if (normalizedConfidence < threshold) {
      signals.push({
        type: 'low_confidence',
        value: normalizedConfidence,
        message: `Diagnostic confidence (${(normalizedConfidence * 100).toFixed(0)}%) is below safety threshold (${(threshold * 100).toFixed(0)}%). Human expert escalation recommended.`
      });
    }
  }

  // Check severity risk
  if (diagnosis?.severity === 'High' || diagnosis?.severity === 'Critical') {
    signals.push({
      type: 'high_severity',
      value: diagnosis.severity,
      message: `Pathological severity is classified as ${diagnosis.severity}. Immediate multi-modal intervention needed.`
    });
  }

  // Identify missing context items
  if (!weather) missing.push('weather_data');
  if (!sensorData) missing.push('sensor_data');
  if (!farmerContext?.lat || !farmerContext?.lng) {
    if (!farmerContext?.location) missing.push('farmer_location');
  }

  const isHighRisk = signals.some(s => s.type === 'low_confidence' || s.type === 'high_severity');
  const isMediumRisk = signals.length > 0 || missing.length > 0;

  return {
    risk_detected: signals.length > 0 || missing.length > 0,
    risk_level: isHighRisk ? 'high' : isMediumRisk ? 'medium' : 'low',
    signals,
    missing_context: missing,
    requires_planning: true
  };
}
