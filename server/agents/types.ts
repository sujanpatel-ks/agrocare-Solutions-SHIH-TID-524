// Master Types & Contracts for AgroCare AI Multi-Agent Decision & Action System

export interface LocationCoordinates {
  lat: number;
  lng: number;
  name?: string;
}

export interface FarmerProfileInput {
  state?: string;
  district?: string;
  crop?: string;
  landSize?: number; // in acres
  irrigationType?: string;
  soilType?: string;
}

// 1. Sentinel Agent Contracts
export interface SentinelAnalyzeRequest {
  imageUrl?: string;
  imageBase64?: string;
  crop?: string;
  symptoms?: string[];
  location?: LocationCoordinates;
}

export interface SentinelAnalyzeResponse {
  agent: 'sentinel';
  status: 'success' | 'uncertain' | 'rejected';
  crop: string;
  diagnosis: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  imageQuality: 'good' | 'blurry' | 'dark' | 'unrelated' | 'missing';
  needsEscalation: boolean;
  notes?: string;
  rawDiagnosis?: any;
}

export interface SentinelValidateImageRequest {
  imageUrl?: string;
  imageBase64?: string;
}

export interface SentinelValidateImageResponse {
  valid: boolean;
  quality: 'good' | 'blurry' | 'dark' | 'unrelated' | 'missing' | 'oversized';
  error?: string;
  mimeType?: string;
  sizeBytes?: number;
  cropDetected?: boolean;
}

// 2. Context Engine Contracts
export interface ContextEvaluateRequest {
  crop?: string;
  disease?: string;
  location?: LocationCoordinates;
  cropStage?: string;
  sensorData?: {
    soilMoisturePercent?: number;
    canopyTempCelsius?: number;
    leafWetnessHours?: number;
  };
}

export interface WeatherContextData {
  available: boolean;
  temperatureCelsius: number;
  relativeHumidity: number;
  rainExpected: boolean;
  precipitationProbability: number;
  rainVolumeMm: number;
  windSpeedKph: number;
  forecastSummary: string;
  hoursUntilRain?: number;
  isFallback?: boolean;
}

export interface TreatmentWindow {
  recommended: boolean;
  reason: string;
  optimalTiming?: string;
  earliestSafeTime?: string;
}

export interface ContextEvaluateResponse {
  agent: 'context';
  status: 'success' | 'degraded';
  weatherAvailable: boolean;
  weatherRisk: 'low' | 'medium' | 'high';
  rainExpected: boolean;
  humidity: number;
  temperature: number;
  windSpeed: number;
  treatmentWindow: TreatmentWindow;
  soilContext?: {
    moisturePercent?: number;
    ph?: number;
    npkStatus?: string;
  };
  sensorContext?: any;
  locationContext: LocationCoordinates;
  historicalContext?: {
    previousOutbreaks: number;
    regionalRisk: string;
  };
}

// 3. Planner Agent Contracts
export type PlannerDecision =
  | 'TAKE_ACTION'
  | 'DELAY_TREATMENT'
  | 'DO_NOT_ACT'
  | 'REQUEST_BETTER_IMAGE'
  | 'ESCALATE'
  | 'MONITOR';

export interface PlannerPlanRequest {
  diagnosis: {
    disease: string;
    crop?: string;
    confidence: number;
    severity?: string;
    symptoms?: string[];
  };
  context: {
    rainExpected: boolean;
    humidity: number;
    weatherRisk?: string;
    windSpeed?: number;
    treatmentWindow?: TreatmentWindow;
  };
  location?: LocationCoordinates;
  farmer?: FarmerProfileInput;
}

export interface PlannerPlanResponse {
  agent: 'planner';
  decision: PlannerDecision;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reason: string;
  actions: string[];
  treatmentOptions?: {
    organic: {
      name: string;
      dosage: string;
      timing: string;
      itkPractice?: string;
    };
    chemical?: {
      name: string;
      dosage: string;
      activeIngredient?: string;
      safetyPrecautions: string;
    };
  };
  followUpHours: number;
}

// 4. Safety Layer Contracts
export interface SafetyCheckRequest {
  sentinelOutput: SentinelAnalyzeResponse;
  contextOutput: ContextEvaluateResponse;
  plannerOutput: PlannerPlanResponse;
}

export interface SafetyCheckResponse {
  agent: 'safety';
  passed: boolean;
  safeDecision: PlannerDecision;
  approvedActions: string[];
  blockedActions: string[];
  safetyFlags: Array<{
    type: 'WEATHER_CONFLICT' | 'LOW_CONFIDENCE' | 'HIGH_CHEMICAL_RISK' | 'POOR_IMAGE' | 'CONFLICTING_SIGNALS';
    severity: 'WARNING' | 'BLOCK';
    message: string;
  }>;
  overrideReason?: string;
}

// 5. Executor Agent Contracts
export interface ExecutorExecuteRequest {
  caseId?: string;
  planId?: string;
  approvedDecision: PlannerDecision;
  actions: string[];
  crop?: string;
  disease?: string;
  location?: LocationCoordinates;
  farmer?: FarmerProfileInput;
}

export interface ExecutorExecuteResponse {
  agent: 'executor';
  status: 'completed' | 'partial' | 'failed' | 'skipped_safety';
  executedActions: string[];
  results: {
    suppliers?: SupplierItem[];
    schemes?: SchemeMatchItem[];
    followUp?: FollowUpItem;
    advisory?: string[];
  };
  errors?: string[];
}

// 6. Escalation Agent Contracts
export interface EscalationEvaluateRequest {
  confidence: number;
  imageQuality?: string;
  disease?: string;
  crop?: string;
  missingContext?: string[];
  weatherAvailable?: boolean;
}

export interface EscalationEvaluateResponse {
  agent: 'escalation';
  escalate: boolean;
  reason: string;
  confidence: number;
  threshold: number;
  recommendedAction: string;
  ticketId?: string;
  kvkContact?: {
    center: string;
    phone: string;
    email: string;
  };
}

// 7. Supplier Contracts
export interface SupplierItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm: number;
  verified: boolean;
  verificationEvidence?: {
    licenseNumber?: string;
    issuingAuthority?: string;
    verifiedAt?: string;
  };
  inStock: boolean;
  productsAvailable: string[];
  rating: number;
  latitude: number;
  longitude: number;
}

// 8. Scheme Contracts
export interface SchemeMatchItem {
  id: string;
  name: string;
  officialName: string;
  ministry: string;
  benefit: string;
  eligibility: boolean;
  reason: string;
  applicationUrl: string;
  sourceType: 'OFFICIAL_REGISTRY' | 'STATE_PORTAL';
}

// 9. Feedback & Follow-up Contracts
export interface FeedbackCreateRequest {
  caseId?: string;
  diagnosisId?: string;
  actionTaken: 'followed' | 'partially_followed' | 'delayed' | 'not_followed';
  outcome: 'improved' | 'cured' | 'worsened' | 'no_change';
  farmerRating: number; // 1-5
  comments?: string;
}

export interface FollowUpItem {
  id: string;
  caseId: string;
  scheduledTime: string;
  scheduledHoursFromNow: number;
  purpose: string;
  status: 'scheduled' | 'sent' | 'completed' | 'cancelled';
  contactMethod: 'whatsapp' | 'sms' | 'app_notification';
}

// Trace & Orchestration Contracts
export interface StepTrace {
  agent: 'sentinel' | 'context' | 'planner' | 'safety' | 'executor' | 'escalation';
  status: 'completed' | 'warning' | 'failed' | 'skipped';
  latencyMs: number;
  startTime: string;
  endTime: string;
  summary?: string;
  data?: any;
}

export interface CaseTraceResponse {
  caseId: string;
  timestamp: string;
  totalLatencyMs: number;
  status: 'completed' | 'escalated' | 'delayed_treatment' | 'degraded' | 'failed';
  steps: StepTrace[];
}

export interface AgroCareMasterAnalyzeResponse {
  caseId: string;
  status: 'completed' | 'escalated' | 'delayed_treatment' | 'degraded';
  timestamp: string;
  diagnosis: {
    crop: string;
    disease: string;
    confidence: number;
    severity: string;
    symptoms: string[];
    imageQuality: string;
  };
  context: {
    weatherRisk: 'low' | 'medium' | 'high';
    rainExpected: boolean;
    humidity: number;
    temperature: number;
    windSpeed: number;
    treatmentWindow: TreatmentWindow;
  };
  decision: {
    action: PlannerDecision;
    priority: string;
    reason: string;
    recommendations: string[];
    safeNonAction: boolean;
  };
  safety: {
    passed: boolean;
    flags: Array<{ type: string; severity: string; message: string }>;
  };
  execution: {
    supplierSearch: 'completed' | 'unavailable' | 'not_required';
    schemeSearch: 'completed' | 'unavailable' | 'not_required';
    followUpScheduled: boolean;
    suppliers: SupplierItem[];
    schemes: SchemeMatchItem[];
    followUp?: FollowUpItem;
  };
  escalation: {
    required: boolean;
    reason?: string;
    ticketId?: string;
  };
  performance: {
    totalLatencyMs: number;
    stepLatencies: Record<string, number>;
  };
  trace: StepTrace[];
}
