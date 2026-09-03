import { AgroCareContext, EscalationResult, WeatherGateResult } from './types';

export function evaluateSpraySafety(
  weather: any,
  proposedAction?: string[] | string
): WeatherGateResult {
  if (!weather) {
    return {
      blocked: false,
      reason: 'No adverse weather signals detected. Standard precautions apply.',
    };
  }

  const rainChance = weather.rainChance ?? weather.rainProbability ?? weather.maxRainProbability ?? 0;
  const windSpeed = weather.windSpeed ?? 0;
  const humidity = weather.humidity ?? 0;

  const actionsText = Array.isArray(proposedAction) ? proposedAction.join(' ') : (proposedAction || '');
  const isSprayAction = /spray|fungicide|pesticide|insecticide|chemical|छिड़काव|ಸಿಂಪಡಣೆ/i.test(actionsText);

  // If the proposed action is not related to spraying, don't block
  if (proposedAction && !isSprayAction) {
    return {
      blocked: false,
      reason: 'Proposed non-spray operations are safe under current weather.',
    };
  }

  if (rainChance > 40) {
    return {
      blocked: true,
      reason: `Rain chance ${rainChance}% – spraying not recommended due to risk of chemical wash-off and environmental contamination.`,
    };
  }

  if (windSpeed > 20) {
    return {
      blocked: true,
      reason: `Wind speed ${windSpeed} km/h – spraying not recommended due to high chemical drift hazard to neighboring crops and water sources.`,
    };
  }

  if (humidity > 85) {
    return {
      blocked: true,
      reason: `Humidity ${humidity}% – high moisture reduces foliar absorption efficacy and increases phytotoxicity risk.`,
    };
  }

  return {
    blocked: false,
    reason: 'Weather conditions safe for spraying.',
  };
}

export function evaluateEscalation(
  confidence: number,
  threshold: number,
  context: AgroCareContext
): EscalationResult {
  const normConfidence = confidence > 1 ? confidence / 100 : confidence;
  const normThreshold = threshold > 1 ? threshold / 100 : threshold;

  if (normConfidence < normThreshold) {
    return {
      required: true,
      reason: `Diagnostic confidence (${(normConfidence * 100).toFixed(0)}%) is below safety threshold (${(normThreshold * 100).toFixed(0)}%). Recommended to consult your local KVK or agricultural extension officer.`,
    };
  }

  if (context.currentDiagnosis && !context.currentDiagnosis.disease) {
    return {
      required: true,
      reason: 'Crop pathology cannot be conclusively verified from provided inputs. Expert field inspection is advised.',
    };
  }

  return {
    required: false,
    reason: 'Confidence sufficient.',
  };
}

export function validateRecommendation(
  plan: string[] | string,
  context: AgroCareContext
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const planText = Array.isArray(plan) ? plan.join(' \n') : (plan || '');

  // Flag excessively high chemical dosages (> 5L/acre or > 5 kg/acre)
  const excessiveVolumeRegex = /(\b([6-9]|\d{2,})\s*(l|liters?|litres?|kg|kilograms?)\s*(per|\/)\s*acre)/i;
  if (excessiveVolumeRegex.test(planText)) {
    issues.push('Identified potential excessive chemical application rate (>5 units/acre). Safe standard is 1-3L/acre.');
  }

  // Flag treatment recommendations without an identified diagnosis or symptoms
  const hasDiagnosis = !!(context.currentDiagnosis?.disease || context.crop);
  const suggestsAggressiveChemicals = /systemic|mancozeb|chlorothalonil|propiconazole|metalaxyl|imidacloprid/i.test(planText);

  if (!hasDiagnosis && suggestsAggressiveChemicals) {
    issues.push('Chemical treatment suggested without conclusive pathological diagnosis. Prioritize organic/preventive practices.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
