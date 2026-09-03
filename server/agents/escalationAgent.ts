// AGENT 6: ESCALATION AGENT — Human-in-the-Loop & KVK Expert Routing
import { EscalationEvaluateRequest, EscalationEvaluateResponse } from './types';
import { AGROCARE_CONFIG } from './config';

/**
 * Determines whether a case requires human expert escalation.
 */
export function evaluateEscalation(req: EscalationEvaluateRequest): EscalationEvaluateResponse {
  const threshold = AGROCARE_CONFIG.escalation.defaultThreshold; // 0.70
  const rawConfidence = req.confidence ?? 0;
  const confidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;

  const missing = req.missingContext || [];
  const imageQuality = req.imageQuality || 'good';

  let escalate = false;
  let reason = 'Diagnosis meets safety confidence threshold for automated advisory.';
  let recommendedAction = 'Proceed with verified AgroCare integrated pest management guidelines.';

  // Boundary condition checks
  if (confidence < AGROCARE_CONFIG.escalation.minAcceptableConfidence) {
    escalate = true;
    reason = `Critical uncertainty: Diagnostic confidence (${(confidence * 100).toFixed(0)}%) is below minimum threshold (${(AGROCARE_CONFIG.escalation.minAcceptableConfidence * 100).toFixed(0)}%).`;
    recommendedAction = 'Request a clearer leaf/stem photograph or arrange in-person field visit.';
  } else if (confidence < threshold) {
    escalate = true;
    reason = `Diagnostic confidence (${(confidence * 100).toFixed(0)}%) is below standard safety threshold (${(threshold * 100).toFixed(0)}%).`;
    recommendedAction = 'Forward diagnostic telemetry to regional Krishi Vigyan Kendra (KVK) agronomist for secondary verification.';
  } else if (imageQuality === 'blurry' || imageQuality === 'dark') {
    escalate = true;
    reason = `Image quality degraded (${imageQuality}). Pathological features cannot be guaranteed.`;
    recommendedAction = 'Retake photo in natural diffuse daylight before initiating treatments.';
  } else if (imageQuality === 'unrelated') {
    escalate = true;
    reason = 'Uploaded image did not contain recognized agricultural foliage or crop symptoms.';
    recommendedAction = 'Prompt farmer to upload valid plant photo.';
  }

  const ticketId = escalate 
    ? `KVK-TICKET-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`
    : undefined;

  return {
    agent: 'escalation',
    escalate,
    reason,
    confidence,
    threshold,
    recommendedAction,
    ticketId,
    kvkContact: AGROCARE_CONFIG.kvkDirectory.karnataka
  };
}
