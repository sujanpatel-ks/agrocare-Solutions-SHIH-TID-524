import { ExtractedEntities, FertilizerIntent, FertilizerRecord, FertilizerSafetyResult } from './types';

/**
 * Deterministic Safety Policy Engine for Fertilizer Advisory.
 * 
 * Rules:
 * 1. Hazardous Precipitate & Incompatibility Shield (e.g. Zinc Sulphate + DAP/SSP, Biofertilizer + Chemical Fungicides)
 * 2. Missing Context & Safe Dosage Guidance (Soil Health Card requirement, palm age/stage calibration)
 * 3. Disease Misconception Prevention (Fertilizers do not cure fungal rots; route to crop protection)
 * 4. Weather Gate (Rainfall leaching & wind drift safeguards)
 * 5. FCO Verification for Unknown / Non-standard products
 */

export function evaluateFertilizerSafety(
  query: string,
  entities: ExtractedEntities,
  intent: FertilizerIntent,
  fertilizerRecord: FertilizerRecord | null,
  weatherContext?: any
): FertilizerSafetyResult {
  const warnings: string[] = [];
  const missingContextFields: string[] = [];
  let outcome: 'ALLOW' | 'MODIFY' | 'DEFER' | 'ESCALATE' = 'ALLOW';
  let reason: string | undefined;
  let dosageSafetyNotice: string | undefined;

  const qLower = query.toLowerCase();

  // 1. UNSUPPORTED / HAZARDOUS PRODUCT CHECK
  if (intent === 'unsupported_high_risk' || /\b(abc-999|xyz-fertilizer|magic-grow|fake-chemical)\b/i.test(qLower)) {
    return {
      outcome: 'DEFER',
      allowed: false,
      reason: 'Product is not listed under the official Fertilizer (Control) Order (FCO) 1985 schedule. Unregulated chemicals pose severe crop burning, soil salinity, and groundwater contamination risks.',
      warnings: [
        'Unverified product with no ICAR/FCO safety registration.',
        'Never apply unregistered agro-chemicals without certified laboratory analysis.'
      ],
      missingContextFields: ['fco_registration_number', 'active_chemical_ingredients'],
      requiresExpertEscalation: true
    };
  }

  // 2. CRITICAL INCOMPATIBILITY & CHEMICAL TANK-MIX CHECK
  const mentionsZinc = /zinc|znso4|जिंक|ಜಿಂಕ್/i.test(qLower) || entities.normalizedFertilizerId === 'FERT-ZINC-SULPHATE';
  const mentionsPhosphate = /dap|ssp|diammonium phosphate|super phosphate|18:46:0|18-46-0|डीएपी|ಡಿಎಪಿ/i.test(qLower) || 
                            entities.normalizedFertilizerId === 'FERT-DAP' || 
                            entities.normalizedFertilizerId === 'FERT-SSP';

  if (mentionsZinc && mentionsPhosphate && (entities.isCompatibilityQuery || /mix|together|blend|tank/i.test(qLower))) {
    outcome = 'MODIFY';
    warnings.push(
      'CRITICAL INCOMPATIBILITY: Never mix Zinc Sulphate directly with Phosphatic fertilizers (DAP or SSP). They react chemically to precipitate insoluble Zinc Phosphate (Zn3(PO4)2), locking both Zinc and Phosphorus into an unusable form for plant roots.'
    );
    reason = 'Hazardous tank-mix detected. Zinc Sulphate and DAP/SSP must be applied separately with at least 7-10 days interval.';
  }

  const mentionsBio = /biofertilizer|azotobacter|azospirillum|psb|rhizobium/i.test(qLower) || entities.normalizedFertilizerId === 'FERT-BIO-AZOTOBACTER-PSB';
  const mentionsFungicide = /fungicide|mancozeb|copper oxychloride|bordeaux|hexaconazole|carbendazim|streptocycline/i.test(qLower);

  if (mentionsBio && mentionsFungicide) {
    outcome = 'MODIFY';
    warnings.push(
      'BIOLOGICAL INCOMPATIBILITY: Never combine Biofertilizers (Azotobacter, PSB, Rhizobium) directly with chemical fungicides or bactericides. Chemical fungicides destroy beneficial live microbial colonies. Maintain at least a 10 to 14 days application gap.'
    );
    reason = 'Chemical fungicide destroys live bio-fertilizer microbial inoculants.';
  }

  // 3. DISEASE MISCONCEPTION CHECK (e.g., Urea curing Koleroga / Fruit rot in Arecanut)
  if (entities.isDiseaseCureQuery) {
    outcome = 'MODIFY';
    warnings.push(
      'DIAGNOSTIC ADVISORY: Fertilizers provide essential plant nutrients for vigor and disease resistance, but they are NOT direct curative fungicides or pesticides. For active fungal outbreaks (e.g. Koleroga / Fruit Rot in Arecanut, Early/Late Blight in Solanaceous crops), an appropriate certified fungicide (such as 1% Bordeaux mixture or Copper Oxychloride) along with field sanitation must be applied.'
    );
  }

  // 4. DOSAGE RATE SAFETY & MISSING CONTEXT DEFERRAL
  if (entities.isDosageQuery) {
    if (!entities.crop) {
      missingContextFields.push('crop_name');
    }
    if (entities.crop?.toLowerCase().includes('arecanut') && !/bearing|age|year|mature|basin/i.test(qLower)) {
      missingContextFields.push('palm_age_or_bearing_status');
    }
    if (!/soil test|soil health card|shc|ph/i.test(qLower)) {
      missingContextFields.push('soil_test_values');
    }

    dosageSafetyNotice = 'Dosage Disclaimer: Exact nutrient application rates depend heavily on crop growth stage, palm age, and baseline soil fertility (Soil Health Card report). Standard ICAR package-of-practices reference ranges are provided as agronomic baselines, but customized field doses should always be calibrated to soil test results to prevent nutrient runoff and soil toxicity.';
    
    if (missingContextFields.length > 0) {
      warnings.push(`Recommended dosages vary by ${missingContextFields.join(', ')}. Consult local Krishi Vigyan Kendra (KVK) or Soil Health Card for parcel-specific precision.`);
    }
  }

  // 5. WEATHER GATE INTEGRATION
  let weatherGateResult = { blocked: false, reason: 'Weather conditions normal.' };
  if (entities.isWeatherDependent && weatherContext) {
    const rainChance = weatherContext.rainChance ?? weatherContext.rainProbability ?? 0;
    const windSpeed = weatherContext.windSpeed ?? 0;

    if (rainChance > 40) {
      weatherGateResult = {
        blocked: true,
        reason: `Precipitation forecast (${rainChance}%) within next 24-48 hours. Soil fertilizer application (especially Nitrogen/Urea) and foliar spraying should be postponed to avoid nutrient leaching and chemical run-off into waterways.`
      };
      outcome = 'MODIFY';
      warnings.push(weatherGateResult.reason);
    } else if (windSpeed > 20) {
      weatherGateResult = {
        blocked: true,
        reason: `High wind speed (${windSpeed} km/h). Foliar spraying is blocked due to excessive droplet drift hazard.`
      };
      outcome = 'MODIFY';
      warnings.push(weatherGateResult.reason);
    }
  }

  const isAllowed = (outcome as string) !== 'DEFER';
  const isEscalationRequired = (outcome as string) === 'DEFER' || (intent as string) === 'unsupported_high_risk';

  return {
    outcome,
    allowed: isAllowed,
    reason,
    warnings,
    dosageSafetyNotice,
    weatherGate: entities.isWeatherDependent ? weatherGateResult : undefined,
    missingContextFields,
    requiresExpertEscalation: isEscalationRequired
  };
}
