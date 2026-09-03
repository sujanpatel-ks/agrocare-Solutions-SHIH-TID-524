// src/services/agentService.ts — Client-side service to communicate with AgroCare Agent
import { auth } from '../firebase';

export interface AgentAction {
  step: number;
  action: string;
  type: 'itk' | 'chemical' | 'monitoring' | 'advisory' | 'escalation';
  timing: string;
  notes: string;
}

export interface AgentTraceStep {
  stepId: string;
  status: 'running' | 'completed' | 'warning' | 'blocked' | 'escalated';
  toolName?: string;
  label: string;
  details?: any;
  timestamp: string;
}

export interface AgentResult {
  status: 'success' | 'partial' | 'escalated' | 'fallback';
  crop: string;
  issue: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  evidence: string[];
  reasoning_summary: string;
  recommended_actions: AgentAction[];
  weather_gate: {
    blocked: boolean;
    reason: string;
    recommended_window?: string;
  };
  itk: Array<{
    practice: string;
    source: string;
    confidence: string;
    preparation?: string;
  }>;
  supplier: {
    name?: string;
    distance?: string;
    phone?: string;
    mapsUrl?: string;
  } | null;
  scheme: {
    name?: string;
    portal?: string;
    benefit?: string;
  } | null;
  escalation: {
    required: boolean;
    reason?: string;
    questions_for_expert?: string[];
    ticketId?: string;
  };
  agent_trace: AgentTraceStep[];
}

export interface AgentRequestParams {
  message?: string;
  crop?: string;
  location?: string;
  lat?: number;
  lng?: number;
  diagnosis?: {
    disease?: string;
    crop?: string;
    confidence?: number;
    severity?: string;
  };
  sensorData?: any;
  farmerContext?: any;
  language?: string;
}

export async function runAgentOrchestrator(params: AgentRequestParams): Promise<AgentResult> {
  let idToken = '';
  if (auth.currentUser) {
    try {
      idToken = await auth.currentUser.getIdToken();
    } catch (e) {
      console.warn('Could not retrieve Firebase ID token:', e);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  const response = await fetch('/api/agrocare/agent', {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Agent request failed (${response.status}): ${errText}`);
  }

  return response.json();
}
