// MASTER END-TO-END AGROCARE AI ORCHESTRATOR — Multi-Agent Chaining & Real-Time Case Resolution
import { 
  AgroCareMasterAnalyzeResponse, 
  SentinelAnalyzeRequest, 
  StepTrace,
  CaseTraceResponse
} from './types';
import { runSentinelAnalyze } from './sentinelAgent';
import { runContextEvaluate } from './contextEngine';
import { runPlannerPlan } from './plannerAgent';
import { runSafetyCheck } from './safetyLayer';
import { runExecutorExecute } from './executorAgent';
import { evaluateEscalation } from './escalationAgent';
import { measureStep, recordCaseTrace } from './traceService';

export interface MasterAnalyzeInput extends SentinelAnalyzeRequest {
  caseId?: string;
  farmerProfile?: {
    state?: string;
    district?: string;
    crop?: string;
    landSize?: number;
  };
}

/**
 * Runs the full 5-stage AgroCare agent pipeline:
 * Sentinel -> Context -> Planner -> Safety -> Executor -> Escalation Check
 */
export async function runAgroCareMasterPipeline(input: MasterAnalyzeInput): Promise<AgroCareMasterAnalyzeResponse> {
  const overallStart = Date.now();
  const caseId = input.caseId || `AC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const stepTraces: StepTrace[] = [];
  const stepLatencies: Record<string, number> = {};

  // 1. STEP 1: Sentinel Agent (Image validation + diagnosis)
  const sentinelMeasure = await measureStep('sentinel', async () => {
    return runSentinelAnalyze({
      imageUrl: input.imageUrl,
      imageBase64: input.imageBase64,
      crop: input.crop,
      symptoms: input.symptoms,
      location: input.location
    });
  }, 'Sentinel diagnostic image inspection and symptom extraction');

  const sentinelOut = sentinelMeasure.result;
  stepTraces.push(sentinelMeasure.trace);
  stepLatencies.sentinel = sentinelMeasure.trace.latencyMs;

  // 2. STEP 2: Context Intelligence Engine
  const contextMeasure = await measureStep('context', async () => {
    return runContextEvaluate({
      crop: sentinelOut.crop,
      disease: sentinelOut.diagnosis,
      location: input.location
    });
  }, 'Context evaluation of atmospheric weather, soil condition, and safe spray window');

  const contextOut = contextMeasure.result;
  stepTraces.push(contextMeasure.trace);
  stepLatencies.context = contextMeasure.trace.latencyMs;

  // 3. STEP 3: Planner Agent
  const plannerMeasure = await measureStep('planner', async () => {
    return runPlannerPlan({
      diagnosis: {
        disease: sentinelOut.diagnosis,
        crop: sentinelOut.crop,
        confidence: sentinelOut.confidence,
        severity: sentinelOut.severity,
        symptoms: sentinelOut.symptoms
      },
      context: {
        rainExpected: contextOut.rainExpected,
        humidity: contextOut.humidity,
        weatherRisk: contextOut.weatherRisk,
        windSpeed: contextOut.windSpeed,
        treatmentWindow: contextOut.treatmentWindow
      },
      location: input.location,
      farmer: input.farmerProfile
    });
  }, 'Planner formulation of integrated crop management strategy');

  const plannerOut = plannerMeasure.result;
  stepTraces.push(plannerMeasure.trace);
  stepLatencies.planner = plannerMeasure.trace.latencyMs;

  // 4. STEP 4: Safety Layer Check & Gatekeeper
  const safetyMeasure = await measureStep('safety', async () => {
    return runSafetyCheck({
      sentinelOutput: sentinelOut,
      contextOutput: contextOut,
      plannerOutput: plannerOut
    });
  }, 'Pre-execution biological and environmental safety verification');

  const safetyOut = safetyMeasure.result;
  stepTraces.push(safetyMeasure.trace);
  stepLatencies.safety = safetyMeasure.trace.latencyMs;

  // 5. STEP 5: Escalation Check
  const escalationMeasure = await measureStep('escalation', async () => {
    return evaluateEscalation({
      confidence: sentinelOut.confidence,
      imageQuality: sentinelOut.imageQuality,
      disease: sentinelOut.diagnosis,
      crop: sentinelOut.crop,
      weatherAvailable: contextOut.weatherAvailable
    });
  }, 'Escalation threshold check (<0.70 triggers KVK routing)');

  const escalationOut = escalationMeasure.result;
  stepTraces.push(escalationMeasure.trace);
  stepLatencies.escalation = escalationMeasure.trace.latencyMs;

  // 6. STEP 6: Executor Agent (Safety-Approved Actions)
  const executorMeasure = await measureStep('executor', async () => {
    return runExecutorExecute({
      caseId,
      approvedDecision: safetyOut.safeDecision,
      actions: safetyOut.approvedActions,
      crop: sentinelOut.crop,
      disease: sentinelOut.diagnosis,
      location: input.location,
      farmer: input.farmerProfile
    });
  }, 'Execution of downstream supplier search, scheme matching, and follow-up alerts');

  const executorOut = executorMeasure.result;
  stepTraces.push(executorMeasure.trace);
  stepLatencies.executor = executorMeasure.trace.latencyMs;

  const totalLatencyMs = Date.now() - overallStart;

  // Determine master status
  let masterStatus: AgroCareMasterAnalyzeResponse['status'] = 'completed';
  if (escalationOut.escalate) {
    masterStatus = 'escalated';
  } else if (safetyOut.safeDecision === 'DELAY_TREATMENT') {
    masterStatus = 'delayed_treatment';
  } else if (!contextOut.weatherAvailable) {
    masterStatus = 'degraded';
  }

  const response: AgroCareMasterAnalyzeResponse = {
    caseId,
    status: masterStatus,
    timestamp: new Date().toISOString(),
    diagnosis: {
      crop: sentinelOut.crop,
      disease: sentinelOut.diagnosis,
      confidence: sentinelOut.confidence,
      severity: sentinelOut.severity,
      symptoms: sentinelOut.symptoms,
      imageQuality: sentinelOut.imageQuality
    },
    context: {
      weatherRisk: contextOut.weatherRisk,
      rainExpected: contextOut.rainExpected,
      humidity: contextOut.humidity,
      temperature: contextOut.temperature,
      windSpeed: contextOut.windSpeed,
      treatmentWindow: contextOut.treatmentWindow
    },
    decision: {
      action: safetyOut.safeDecision,
      priority: plannerOut.priority,
      reason: safetyOut.overrideReason || plannerOut.reason,
      recommendations: safetyOut.approvedActions,
      safeNonAction: safetyOut.safeDecision === 'DELAY_TREATMENT' || safetyOut.safeDecision === 'DO_NOT_ACT'
    },
    safety: {
      passed: safetyOut.passed,
      flags: safetyOut.safetyFlags
    },
    execution: {
      supplierSearch: executorOut.results.suppliers ? 'completed' : 'unavailable',
      schemeSearch: executorOut.results.schemes ? 'completed' : 'unavailable',
      followUpScheduled: Boolean(executorOut.results.followUp),
      suppliers: executorOut.results.suppliers || [],
      schemes: executorOut.results.schemes || [],
      followUp: executorOut.results.followUp
    },
    escalation: {
      required: escalationOut.escalate,
      reason: escalationOut.reason,
      ticketId: escalationOut.ticketId
    },
    performance: {
      totalLatencyMs,
      stepLatencies
    },
    trace: stepTraces
  };

  // Record trace for observability API
  const caseTrace: CaseTraceResponse = {
    caseId,
    timestamp: response.timestamp,
    totalLatencyMs,
    status: masterStatus,
    steps: stepTraces
  };
  await recordCaseTrace(caseTrace);

  return response;
}
