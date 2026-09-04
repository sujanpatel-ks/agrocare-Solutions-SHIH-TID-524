// validators.ts — Request validation and auth security guards
import * as admin from 'firebase-admin';

export interface AgentRequestInput {
  message?: string;
  crop?: string;
  location?: string;
  lat?: number;
  lng?: number;
  diagnosis?: {
    disease?: string;
    confidence?: number;
    severity?: string;
    crop?: string;
  };
  sensorData?: {
    moisture?: number;
    ph?: number;
    n?: number;
    p?: number;
    k?: number;
  };
  farmerContext?: {
    location?: string;
    farmSizeHectares?: number;
    crops?: string[];
  };
  language?: string;
}

export function validateAgentInput(data: any): { valid: boolean; error?: string; cleanData?: AgentRequestInput } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request payload must be a JSON object.' };
  }

  // Sanitize and normalize input
  const cleanData: AgentRequestInput = {
    message: typeof data.message === 'string' ? data.message.trim().slice(0, 1000) : '',
    crop: typeof data.crop === 'string' ? data.crop.trim().slice(0, 100) : undefined,
    location: typeof data.location === 'string' ? data.location.trim().slice(0, 200) : undefined,
    lat: typeof data.lat === 'number' && !isNaN(data.lat) ? data.lat : undefined,
    lng: typeof data.lng === 'number' && !isNaN(data.lng) ? data.lng : undefined,
    diagnosis: data.diagnosis && typeof data.diagnosis === 'object' ? {
      disease: typeof data.diagnosis.disease === 'string' ? data.diagnosis.disease.slice(0, 150) : undefined,
      confidence: typeof data.diagnosis.confidence === 'number' ? data.diagnosis.confidence : undefined,
      severity: typeof data.diagnosis.severity === 'string' ? data.diagnosis.severity.slice(0, 50) : undefined,
      crop: typeof data.diagnosis.crop === 'string' ? data.diagnosis.crop.slice(0, 100) : undefined,
    } : undefined,
    sensorData: data.sensorData && typeof data.sensorData === 'object' ? data.sensorData : undefined,
    farmerContext: data.farmerContext && typeof data.farmerContext === 'object' ? data.farmerContext : undefined,
    language: typeof data.language === 'string' ? data.language.slice(0, 10) : 'en'
  };

  if (!cleanData.message && !cleanData.diagnosis?.disease && !cleanData.crop) {
    return { valid: false, error: 'At least a message, crop name, or diagnosis object must be provided.' };
  }

  return { valid: true, cleanData };
}

export async function requireAuthToken(authHeader?: string): Promise<{ uid: string; email?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('AUTH_REQUIRED');
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token || admin.apps.length === 0) throw new Error('AUTH_UNAVAILABLE');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    throw new Error('AUTH_INVALID');
  }
}
