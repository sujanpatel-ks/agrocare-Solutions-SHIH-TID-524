export interface AgroCareLocation {
  lat?: number;
  lng?: number;
  name?: string;
}

export interface CurrentDiagnosis {
  disease?: string;
  confidence?: number;
  severity?: string;
  imageUrl?: string;
}

export interface WeatherContext {
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  rainChance?: number;
  forecast?: any[];
}

export interface SoilContext {
  moisture?: number;
  ph?: number;
  npk?: {
    n?: number;
    p?: number;
    k?: number;
  };
}

export interface SafetyConstraints {
  sprayBlock: boolean;
  escalationThreshold: number;
}

export interface AgroCareContext {
  userId: string;
  language: string;
  location: AgroCareLocation;
  crop?: string;
  currentDiagnosis?: CurrentDiagnosis;
  recentDiagnoses: any[];
  weather?: WeatherContext;
  soil?: SoilContext;
  farmerProfile?: any;
  conversationSummary?: string;
  safetyConstraints: SafetyConstraints;
}

export interface WeatherGateResult {
  blocked: boolean;
  reason: string;
}

export interface ITKItem {
  practice: string;
  description: string;
}

export interface SupplierItem {
  name: string;
  distance: string;
  contact?: string;
  address?: string;
}

export interface SchemeItem {
  name: string;
  description: string;
  eligibility?: string;
}

export interface EscalationResult {
  required: boolean;
  reason: string;
}

export interface ToolCallRecord {
  tool: string;
  input: any;
  output: any;
  duration_ms: number;
  success: boolean;
}

export interface AgentResult {
  status: 'success' | 'error' | 'escalation' | 'fallback';
  crop?: string;
  issue?: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  evidence: string[];
  reasoning_summary: string;
  recommended_actions: string[];
  weather_gate: WeatherGateResult;
  itk: ITKItem[];
  supplier: SupplierItem | null;
  scheme: SchemeItem | null;
  escalation: EscalationResult;
  trace_id: string;
  tool_calls: ToolCallRecord[];
}

export interface ToolCall {
  name: string;
  args: Record<string, any>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  executor: (args: any, context: AgroCareContext) => Promise<any>;
}
