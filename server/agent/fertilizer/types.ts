import { AgroCareLocation, CurrentDiagnosis, WeatherContext, SoilContext, SafetyConstraints } from '../types';

export type FertilizerType = 
  | 'synthetic' 
  | 'organic' 
  | 'bio_fertilizer' 
  | 'micronutrient' 
  | 'water_soluble' 
  | 'soil_amendment';

export type FertilizerCategory =
  | 'Nitrogenous'
  | 'Phosphatic'
  | 'Potassic'
  | 'Complex NPK'
  | 'Secondary Nutrient'
  | 'Micronutrient'
  | 'Bio-inoculant'
  | 'Organic Manure';

export interface NutrientContent {
  N?: number; // % Nitrogen
  P?: number; // % P2O5
  K?: number; // % K2O
  secondary?: {
    S?: number; // % Sulphur
    Ca?: number; // % Calcium
    Mg?: number; // % Magnesium
    [key: string]: number | undefined;
  };
  micronutrients?: {
    Zn?: number; // % Zinc
    Fe?: number; // % Iron
    B?: number;  // % Boron
    Mn?: number; // % Manganese
    Cu?: number; // % Copper
    Mo?: number; // % Molybdenum
    [key: string]: number | undefined;
  };
  organicMatterPercent?: number;
  microbialCount?: string; // e.g. "1x10^8 CFU/g"
}

export type SourceType = 
  | 'icar_research' 
  | 'gov_extension' 
  | 'fertilizer_control_order' 
  | 'university_package_of_practices' 
  | 'technical_bulletin'
  | 'field_advisory';

export interface SourceRecord {
  sourceId: string;
  title: string;
  organization: string;
  sourceType: SourceType;
  publishedDate?: string;
  accessedDate?: string;
  url?: string;
  authorityLevel: 'official_statutory' | 'national_research' | 'university_extension' | 'technical_verified';
  documentId?: string;
}

export interface FertilizerRecord {
  fertilizerId: string;
  fertilizerName: string;
  normalizedName: string;
  aliases: string[];
  type: FertilizerType;
  category: FertilizerCategory;
  fcoStandard?: string; // Fertilizer Control Order Specification (India)
  nutrientContent: NutrientContent;
  formulation?: string;
  physicalForm?: string; // Prilled, Granular, Crystalline Powder, Liquid, Pellets
  suitableCrops: string[];
  cropStages: string[];
  applicationMethods: string[];
  applicationTiming: string[];
  soilConsiderations: string[];
  compatibility: string[];
  incompatibility: string[];
  precautions: string[];
  storage: string[];
  sourceRecords: SourceRecord[];
  metadata?: Record<string, any>;
}

export type ChunkSection = 
  | 'overview'
  | 'nutrient_composition'
  | 'crop_suitability'
  | 'application_guidelines'
  | 'timing'
  | 'compatibility'
  | 'precautions'
  | 'soil_requirements'
  | 'storage_handling'
  | 'safety_warning';

export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  sourceId: string;
  title: string;
  organization: string;
  sourceType: SourceType;
  fertilizer: string;
  crop?: string;
  section: ChunkSection;
  text: string;
  keywords: string[];
  language: string;
  publishedDate?: string;
  accessedDate?: string;
  url?: string;
  isAuthoritative: boolean;
}

export type FertilizerIntent =
  | 'fertilizer_definition'
  | 'nutrient_content'
  | 'crop_suitability'
  | 'application_guidance'
  | 'timing'
  | 'compatibility'
  | 'incompatibility'
  | 'precautions'
  | 'storage'
  | 'soil_consideration'
  | 'comparison'
  | 'price_availability'
  | 'disease_misconception_check'
  | 'general_agriculture'
  | 'unsupported_high_risk';

export interface ExtractedEntities {
  fertilizer?: string;
  normalizedFertilizerId?: string;
  secondaryFertilizer?: string;
  brand?: string;
  crop?: string;
  cropStage?: string;
  soilCondition?: string;
  location?: string;
  applicationMethod?: string;
  actionRequested?: string;
  isDosageQuery: boolean;
  isWeatherDependent: boolean;
  isCompatibilityQuery: boolean;
  isDiseaseCureQuery: boolean;
}

export type SafetyOutcome = 'ALLOW' | 'MODIFY' | 'DEFER' | 'ESCALATE';

export interface FertilizerSafetyResult {
  outcome: SafetyOutcome;
  allowed: boolean;
  reason?: string;
  warnings: string[];
  dosageSafetyNotice?: string;
  weatherGate?: {
    blocked: boolean;
    reason: string;
  };
  missingContextFields?: string[];
  requiresExpertEscalation: boolean;
}

export interface FertilizerAgentRequest {
  message?: string;
  query?: string;
  conversationId?: string;
  fertilizerId?: string;
  fertilizerName?: string;
  crop?: string;
  location?: string;
  lat?: number;
  lng?: number;
  language?: string;
  weather?: any;
  soilTest?: any;
  growthStage?: string;
  fieldSizeAcres?: number;
  farmerContext?: {
    crops?: string[];
    soilType?: string;
    landSize?: string;
    irrigation?: string;
  };
}

export interface FertilizerAgentResponse {
  status: 'success' | 'clarification' | 'deferred' | 'safety_warning' | 'error';
  intent: FertilizerIntent;
  fertilizer: Partial<FertilizerRecord> | null;
  crop: string | null;
  answer: string;
  directlySupportedFacts: string[];
  derivedInterpretation: string[];
  unknowns: string[];
  evidence: DocumentChunk[];
  sources: SourceRecord[];
  confidence: number;
  safety: FertilizerSafetyResult;
  needsClarification: boolean;
  clarificationPrompt?: string;
  traceId: string;
  latencyMs: number;
  suggestedFollowUps?: string[];
}
