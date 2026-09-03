// AGENT 4: SAFETY LAYER — Pre-Execution Safeguards & Gatekeeper
import { SafetyCheckRequest, SafetyCheckResponse, PlannerDecision } from './types';
import { AGROCARE_CONFIG } from './config';

/**
 * Validates the generated plan against hard biological and environmental safety constraints.
 * The Executor MUST NOT execute any actions that fail this check.
 */
export function runSafetyCheck(req: SafetyCheckRequest): SafetyCheckResponse {
  const sentinelOutput = req?.sentinelOutput || { agent: 'sentinel' as const, status: 'success' as const, confidence: 0, imageQuality: 'poor' as const, crop: 'Unknown', diagnosis: 'Unknown', severity: 'low' as const, symptoms: [], needsEscalation: true };
  const contextOutput = req?.contextOutput || { agent: 'context' as const, status: 'success' as const, weatherAvailable: false, weatherRisk: 'low' as const, rainExpected: false, treatmentWindow: { recommended: true, reason: 'Safe fallback' } };
  const plannerOutput = req?.plannerOutput || { agent: 'planner' as const, decision: 'ESCALATE' as PlannerDecision, actions: [], reasoning: '', priority: 'LOW' as const };

  const flags: SafetyCheckResponse['safetyFlags'] = [];
  const blockedActions: string[] = [];
  const approvedActions: string[] = [];

  let safeDecision: PlannerDecision = plannerOutput.decision || 'ESCALATE';
  let overrideReason: string | undefined = undefined;

  // 1. Confidence Gate
  if (sentinelOutput.confidence < AGROCARE_CONFIG.escalation.defaultThreshold) {
    flags.push({
      type: 'LOW_CONFIDENCE',
      severity: 'BLOCK',
      message: `Diagnostic confidence (${(sentinelOutput.confidence * 100).toFixed(0)}%) is below safety threshold (${(AGROCARE_CONFIG.escalation.defaultThreshold * 100).toFixed(0)}%). Synthetic chemical intervention blocked.`
    });
    if (safeDecision === 'TAKE_ACTION') {
      safeDecision = 'ESCALATE';
      overrideReason = 'Safety override: Low diagnostic confidence prohibits automatic chemical treatment.';
    }
  }

  // 2. Weather Gate: Rain Conflict vs Spraying
  if (contextOutput.rainExpected || (contextOutput.treatmentWindow && !contextOutput.treatmentWindow.recommended)) {
    flags.push({
      type: 'WEATHER_CONFLICT',
      severity: 'BLOCK',
      message: `Rain or unfavorable weather detected (${contextOutput.treatmentWindow?.reason || 'Rain incoming'}). Spraying now violates safe application standards.`
    });

    if (safeDecision === 'TAKE_ACTION') {
      safeDecision = 'DELAY_TREATMENT';
      overrideReason = 'Safety override: Weather conditions require delaying all foliar applications.';
    }
  }

  // 3. Image Quality Gate
  if (sentinelOutput.imageQuality !== 'good') {
    flags.push({
      type: 'POOR_IMAGE',
      severity: sentinelOutput.imageQuality === 'unrelated' ? 'BLOCK' : 'WARNING',
      message: `Image quality evaluated as '${sentinelOutput.imageQuality}'. Advice accuracy may be reduced.`
    });
  }

  // 4. Action-by-action filtering
  for (const action of (plannerOutput.actions || [])) {
    const isChemicalSpray = /spray|fungicide|pesticide|mancozeb|chlorothalonil|chemical|छिड़काव|ಸಿಂಪಡಣೆ/i.test(action);

    if (isChemicalSpray && (contextOutput.rainExpected || sentinelOutput.confidence < 0.70)) {
      if (!action.includes('DO NOT SPRAY') && !action.includes('Postpone') && !action.includes('Prepare')) {
        blockedActions.push(action);
        continue;
      }
    }

    approvedActions.push(action);
  }

  const passed = flags.every(f => f.severity !== 'BLOCK') || safeDecision === 'DELAY_TREATMENT' || safeDecision === 'DO_NOT_ACT' || safeDecision === 'ESCALATE';

  return {
    agent: 'safety',
    passed,
    safeDecision,
    approvedActions,
    blockedActions,
    safetyFlags: flags,
    overrideReason
  };
}
