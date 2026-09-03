// AGENT 3: PLANNER AGENT — Evidence-Based Agricultural Action Planning
import { PlannerPlanRequest, PlannerPlanResponse, PlannerDecision } from './types';
import { AGROCARE_CONFIG } from './config';
import { DISEASE_DATABASE, searchDiseaseByName } from '../../src/lib/diseaseDatabase';

/**
 * Evaluates Sentinel diagnosis + Context intelligence to produce a structured action plan.
 */
export async function runPlannerPlan(req: PlannerPlanRequest): Promise<PlannerPlanResponse> {
  const { diagnosis, context } = req;
  const diseaseName = diagnosis?.disease || 'Unspecified Condition';
  const crop = diagnosis?.crop || 'Crop';
  const confidence = diagnosis?.confidence ?? 0.8;
  const isRainExpected = Boolean(context?.rainExpected);

  // Match against disease database for ICAR verified organic/chemical treatments
  const dbMatch = searchDiseaseByName(diseaseName) || 
    DISEASE_DATABASE.find(d => d.affectedCrops.some(c => c.toLowerCase() === crop.toLowerCase())) ||
    DISEASE_DATABASE[0];

  // 1. Rule: Low diagnostic confidence -> ESCALATE
  if (confidence < AGROCARE_CONFIG.escalation.minAcceptableConfidence) {
    return {
      agent: 'planner',
      decision: 'REQUEST_BETTER_IMAGE',
      priority: 'HIGH',
      reason: `Diagnostic confidence (${(confidence * 100).toFixed(0)}%) is too low to safely formulate treatment. Clearer visual evidence is required.`,
      actions: [
        'Take a close-up photo of infected leaf surface under natural daylight',
        'Ensure both upper and lower leaf surfaces are visible',
        'Avoid blurry or shadowed camera angles'
      ],
      followUpHours: 24
    };
  }

  if (confidence < AGROCARE_CONFIG.escalation.defaultThreshold) {
    return {
      agent: 'planner',
      decision: 'ESCALATE',
      priority: 'HIGH',
      reason: `Diagnostic confidence (${(confidence * 100).toFixed(0)}%) is below safety threshold (${(AGROCARE_CONFIG.escalation.defaultThreshold * 100).toFixed(0)}%). Expert field review required.`,
      actions: [
        'Route case telemetry to local KVK Agricultural Extension Officer',
        'Do not apply synthetic chemical fungicides until diagnosis is confirmed',
        'Isolate symptomatic plants to prevent potential spore spread'
      ],
      followUpHours: 24
    };
  }

  // 2. Rule: Rain expected within treatment window -> DELAY_TREATMENT (DO NOT SPRAY NOW)
  if (isRainExpected || (context?.treatmentWindow && !context.treatmentWindow.recommended)) {
    return {
      agent: 'planner',
      decision: 'DELAY_TREATMENT',
      priority: 'HIGH',
      reason: context?.treatmentWindow?.reason || 'Rain is expected soon. Chemical or biological foliar spray will be washed away and cause runoff.',
      actions: [
        'DO NOT SPRAY NOW — Postpone all foliar spraying until rain subsides',
        'Inspect drainage channels around crop beds to prevent waterlogging',
        'Prune heavily infected lower leaves and safely dispose away from the field',
        `Prepare ${dbMatch.organicTreatment.name} for application during the next clear weather window`
      ],
      treatmentOptions: {
        organic: {
          name: dbMatch.organicTreatment.name,
          dosage: dbMatch.organicTreatment.applicationRate,
          timing: 'Post-rain clear morning window',
          itkPractice: dbMatch.organicTreatment.itkSource || 'ICAR Traditional Knowledge'
        },
        chemical: {
          name: dbMatch.chemicalTreatment.name,
          dosage: dbMatch.chemicalTreatment.applicationRate,
          activeIngredient: dbMatch.chemicalTreatment.activeIngredient,
          safetyPrecautions: dbMatch.chemicalTreatment.safetyPrecautions
        }
      },
      followUpHours: 48
    };
  }

  // 3. Rule: Normal clear conditions -> TAKE_ACTION
  return {
    agent: 'planner',
    decision: 'TAKE_ACTION',
    priority: diagnosis?.severity === 'critical' || diagnosis?.severity === 'high' ? 'HIGH' : 'MEDIUM',
    reason: `Favorable atmospheric conditions detected. Pathogen (${diseaseName}) is active and manageable with targeted integrated pest management.`,
    actions: [
      `Apply primary organic bio-treatment: ${dbMatch.organicTreatment.name} (${dbMatch.organicTreatment.applicationRate})`,
      'Spray during recommended window: Early Morning (6:30 - 9:00 AM) or Late Afternoon (4:30 - 6:30 PM)',
      'Ensure complete underside leaf coverage using a fine hollow-cone nozzle',
      'If symptoms persist after 7 days, evaluate secondary ICAR certified chemical option'
    ],
    treatmentOptions: {
      organic: {
        name: dbMatch.organicTreatment.name,
        dosage: dbMatch.organicTreatment.applicationRate,
        timing: dbMatch.organicTreatment.timing,
        itkPractice: dbMatch.organicTreatment.itkSource
      },
      chemical: {
        name: dbMatch.chemicalTreatment.name,
        dosage: dbMatch.chemicalTreatment.applicationRate,
        activeIngredient: dbMatch.chemicalTreatment.activeIngredient,
        safetyPrecautions: dbMatch.chemicalTreatment.safetyPrecautions
      }
    },
    followUpHours: 72
  };
}
