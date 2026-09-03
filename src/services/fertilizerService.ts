// src/services/fertilizerService.ts — Client service for Fertilizer RAG Intelligence Agent
export interface FertilizerRecord {
  fertilizerId: string;
  fertilizerName: string;
  category: string;
  fcoStandard?: string;
  nutrientContent: {
    N?: number;
    P?: number;
    K?: number;
    S?: number;
    Zn?: number;
    B?: number;
    organicMatterPercent?: number;
  };
  suitableCrops: string[];
  applicationMethods: string[];
  applicationTiming: string[];
  dosageBaseline: {
    fieldCrops?: string;
    horticulture?: string;
    plantation?: string;
    foliarConcentrationPercent?: number;
  };
  compatibility: string[];
  incompatibility: string[];
  precautions: string[];
}

export interface DocumentChunk {
  chunkId: string;
  sourceId: string;
  title: string;
  organization: string;
  sourceType: string;
  text: string;
  section: string;
}

export interface SourceRecord {
  sourceId: string;
  title: string;
  organization: string;
  authorityLevel: 'PRIMARY_REGULATORY' | 'GOVERNMENT_RESEARCH' | 'UNIVERSITY_EXTENSION';
  url?: string;
}

export interface FertilizerAgentResponse {
  status: 'success' | 'safety_warning' | 'deferred' | 'needs_context';
  intent: string;
  fertilizer: FertilizerRecord | null;
  crop: string | null;
  answer: string;
  directlySupportedFacts: string[];
  derivedInterpretation: string[];
  unknowns: string[];
  evidence: DocumentChunk[];
  sources: SourceRecord[];
  confidence: number;
  safety: {
    outcome: 'ALLOW' | 'WARN_AND_CONSTRAIN' | 'BLOCK' | 'DEFER';
    warnings: string[];
    reason?: string;
    dosageSafetyNotice?: string;
    weatherBlock?: {
      blocked: boolean;
      reason: string;
    };
    incompatibleMix?: {
      detected: boolean;
      chemicals: string[];
      hazard: string;
    };
  };
  needsClarification: boolean;
  clarificationPrompt?: string;
  suggestedFollowUps?: string[];
  latencyMs?: number;
}

export interface FertilizerQueryRequest {
  query: string;
  crop?: string;
  fertilizerName?: string;
  weather?: {
    rainProbability?: number;
    windSpeedKph?: number;
    temperatureC?: number;
    relativeHumidity?: number;
  };
  soilTest?: {
    ph?: number;
    nitrogenKgHa?: number;
    phosphorusKgHa?: number;
    potassiumKgHa?: number;
  };
  language?: string;
  growthStage?: string;
  fieldSizeAcres?: number;
}

export async function askFertilizerAgent(request: FertilizerQueryRequest): Promise<FertilizerAgentResponse> {
  const response = await fetch('/api/fertilizer/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Fertilizer Agent error: ${response.statusText}`);
  }

  return response.json();
}

export async function getFertilizerDetails(name: string, crop?: string) {
  const params = new URLSearchParams({ name });
  if (crop) params.append('crop', crop);

  const response = await fetch(`/api/fertilizer/details?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch fertilizer details: ${response.statusText}`);
  }
  return response.json();
}

export async function checkCompatibility(fertilizerA: string, fertilizerB: string) {
  const response = await fetch('/api/fertilizer/compatibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fertilizerA, fertilizerB })
  });

  if (!response.ok) {
    throw new Error(`Failed to check compatibility: ${response.statusText}`);
  }
  return response.json();
}
