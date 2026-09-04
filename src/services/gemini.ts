import { ConfidenceAssessment } from '../lib/confidenceHandler';
import { getAuthHeaders } from '../firebase';
export type { ConfidenceAssessment };

export interface WhereToFetchInfo {
  storeType: string;
  recommendedShop: string;
  searchQuery: string;
  distance?: string;
  category: 'Bio-Organic' | 'Chemical Stockist' | 'Fertilizer Depot';
}

export interface ApplicationDueInfo {
  dueDate: string;
  dueWindow: string;
  recommendedTiming: string;
  nextRoundDue: string;
  priority: 'Immediate (Today)' | 'Within 24-48 Hours' | 'Scheduled Routine';
  weatherSafe: boolean;
}

export interface TreatmentDetails {
  name: string;
  nameHi: string;
  nameKn?: string;
  dosage: string;
  frequency: string;
  precautions: string;
  costEstimate: string;
  imageUrl?: string;
  brand?: string;
  packagingSize?: string;
  modeOfAction?: string;
  itkSource?: string;
  chemicalComposition?: string;
  fertilizerCategory?: 'Organic Base' | 'Chemical Base' | 'Inorganic Base';
  whereToFetch?: WhereToFetchInfo;
}

export interface WeatherAdvisory {
  canSprayNow: boolean;
  warningLevel: 'safe' | 'caution' | 'danger';
  title: string;
  message: string;
  optimalTiming: string;
}

export interface AlternativeDiagnosis {
  diseaseName: string;
  probability: number;
  keyDistinction: string;
}

export interface NutrientDeficiency {
  nutrient: string;
  deficiencyType: string;
  keySymptom: string;
  remedy: string;
}

export interface DiagnosisResult {
  crop: string;
  disease: string;
  diseaseHi: string;
  diseaseKn: string;
  scientificName?: string;
  confidence: number;
  description: string;
  symptoms: string[];
  symptomsExpected?: string[];
  symptomMatchPercentage?: number;
  prevention: {
    immediate: string[];
    longTerm: string[];
  };
  treatment: {
    organic: TreatmentDetails;
    chemical: TreatmentDetails;
    inorganic?: TreatmentDetails;
  };
  applicationDue?: ApplicationDueInfo;
  actionRequired?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  boundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  confidenceAssessment?: ConfidenceAssessment;
  weatherAdvisory?: WeatherAdvisory;
  alternativeDiagnoses?: AlternativeDiagnosis[];
  nutrientDeficiency?: NutrientDeficiency;
  icarAdvisory?: string;
}

function compressImage(base64Str: string, maxWidth = 1024, maxHeight = 1024, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(base64Str);
        }
      } catch (err) {
        console.warn("Error compressing image on canvas:", err);
        resolve(base64Str);
      }
    };
    img.onerror = (err) => {
      console.warn("Failed to load image for compression:", err);
      resolve(base64Str);
    };
  });
}

export interface DiagnoseCropOptions {
  crop?: string;
  region?: string;
  growthStage?: string;
  weather?: {
    temperature: number;
    humidity: number;
    rainfallProb: number;
    condition: string;
  };
  soilType?: string;
}

export async function diagnoseCrop(imageBase64: string, options?: DiagnoseCropOptions): Promise<DiagnosisResult> {
  const compressedBase64 = await compressImage(imageBase64);
  const authHeaders = await getAuthHeaders();
  if (!Object.keys(authHeaders).length) throw new Error('Authentication is required for crop diagnosis.');
  const response = await fetch("/api/gemini/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({
      imageBase64: compressedBase64,
      crop: options?.crop,
      region: options?.region,
      growthStage: options?.growthStage,
      weather: options?.weather,
      soilType: options?.soilType
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to diagnose crop: ${response.statusText}`);
  }
  return response.json();
}

export interface Supplier {
  id: string;
  name: string;
  distance: string;
  rating: number;
  reviews: number;
  status: 'open' | 'closed' | 'closing';
  specialty: string[];
  verified: boolean;
  lat?: number;
  lng?: number;
  address?: string;
}

export async function findNearbySuppliers(lat: number, lng: number): Promise<Supplier[]> {
  const response = await fetch("/api/gemini/nearby-suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });
  if (!response.ok) {
    throw new Error(`Failed to find suppliers: ${response.statusText}`);
  }
  return response.json();
}

export interface WeatherData {
  temp: number;
  location: string;
  humidity: number;
  rain: number;
  wind: number;
  condition: string;
}

export interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainChance: number;
  advice: string;
}

export async function getRealTimeWeather(lat: number, lng: number): Promise<WeatherData> {
  // Fetch highly accurate location name using a free reverse geocoding API
  let exactLocation = "";
  try {
    const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      exactLocation = geoData.locality || geoData.city || geoData.principalSubdivision || "";
    }
  } catch (error) {
    console.error("Reverse geocoding failed on client:", error);
  }

  const response = await fetch("/api/gemini/realtime-weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng, exactLocation }),
  });
  if (!response.ok) {
    throw new Error(`Failed to get weather: ${response.statusText}`);
  }
  return response.json();
}

export async function getWeatherForecast(lat: number, lng: number): Promise<ForecastDay[]> {
  const response = await fetch("/api/gemini/weather-forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });
  if (!response.ok) {
    throw new Error(`Failed to get weather forecast: ${response.statusText}`);
  }
  return response.json();
}

export async function chatWithAssistant(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[], language: string = 'en', sessionId?: string): Promise<string> {
  const response = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, language, sessionId }),
  });
  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.text || "";
}

export async function generateSpeech(text: string): Promise<string | undefined> {
  const response = await fetch("/api/gemini/generate-speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error(`Speech generation failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.audio;
}

export async function transcribeAudio(audioBase64: string, mimeType: string, language: string): Promise<string> {
  const response = await fetch("/api/gemini/transcribe-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64, mimeType, language }),
  });
  if (!response.ok) {
    throw new Error(`Audio transcription failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.text || "";
}

export interface SoilData {
  n: number;
  p: number;
  k: number;
  ph: number;
  type: string;
  moisture: number;
}

export interface CropFertilizerRecommendation {
  crop: string;
  type: string;
  quantityPerAcre: string;
  frequency: string;
  applicationMethod: string;
}

export interface SoilAnalysisResult {
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  phAnalysis: string;
  npkAnalysis: string;
  recommendations: string[];
  suitableCrops: string[];
  fertilizerAdvice: string;
  cropFertilizerRecommendations: CropFertilizerRecommendation[];
}

export async function analyzeSoil(data: SoilData): Promise<SoilAnalysisResult> {
  const response = await fetch("/api/gemini/analyze-soil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) {
    throw new Error(`Soil analysis failed: ${response.statusText}`);
  }
  return response.json();
}

export interface AgentResponse {
  status: 'success' | 'error' | 'escalation' | 'fallback';
  crop?: string;
  issue?: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  evidence: string[];
  reasoning_summary: string;
  recommended_actions: string[];
  weather_gate: { blocked: boolean; reason: string };
  itk: Array<{ practice: string; description: string }>;
  supplier: { name: string; distance: string; contact?: string; address?: string } | null;
  scheme: { name: string; description: string; eligibility?: string } | null;
  escalation: { required: boolean; reason: string };
  trace_id: string;
  tool_calls: Array<{ tool: string; input: any; output: any; duration_ms: number; success: boolean }>;
}

export async function callAgent(
  message: string,
  context?: {
    crop?: string;
    language?: string;
    location?: { lat?: number; lng?: number; name?: string };
    diagnosis?: any;
    summary?: string;
  }
): Promise<AgentResponse> {
  const token = localStorage.getItem('agrocare_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/agrocare/agent', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      crop: context?.crop,
      language: context?.language,
      location: context?.location,
      currentDiagnosis: context?.diagnosis,
      conversationSummary: context?.summary,
    }),
  });

  if (!response.ok) {
    throw new Error(`Agent request failed: ${response.statusText}`);
  }

  return response.json();
}
