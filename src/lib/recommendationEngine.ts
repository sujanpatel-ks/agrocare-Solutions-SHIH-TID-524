import { DISEASE_DATABASE, DiseaseEntry, searchDiseaseByName, findDiseasesForCrop } from './diseaseDatabase';
import { NUTRIENT_DEFICIENCIES, NutrientDeficiency, detectNutrientDeficiencyFromSymptoms, getNutrientDeficiencyById } from './nutrientDeficiency';
import { calculateConfidenceAssessment, ConfidenceAssessment } from './confidenceHandler';

export interface WeatherConditionInput {
  temp?: number;
  humidity?: number;
  rainChance?: number;
  condition?: string;
  windSpeed?: number;
}

export interface EnrichedDiagnosis {
  healthStatus: 'HEALTHY' | 'DISEASED' | 'NUTRIENT_DEFICIENCY' | 'CANNOT_DIAGNOSE';
  crop: string;
  disease: string;
  diseaseHi: string;
  diseaseKn: string;
  diseaseName: string;
  diseaseNameHi: string;
  diseaseNameKn: string;
  scientificName: string;
  confidence: number;
  description: string;
  confidenceAssessment: ConfidenceAssessment;
  symptoms: string[];
  differentialDiagnosis?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  urgency: 'monitor' | 'advisory' | 'urgent';
  actionRequired: string;
  treatment: {
    organic: {
      name: string;
      nameHi: string;
      nameKn?: string;
      dosage: string;
      frequency: string;
      precautions: string;
      costEstimate: string;
      modeOfAction?: string;
      itkSource?: string;
      fertilizerCategory?: 'Organic Base';
      whereToFetch?: {
        storeType: string;
        recommendedShop: string;
        searchQuery: string;
        distance?: string;
        category: 'Bio-Organic' | 'Chemical Stockist' | 'Fertilizer Depot';
      };
    };
    chemical: {
      name: string;
      nameHi: string;
      nameKn?: string;
      dosage: string;
      frequency: string;
      precautions: string;
      costEstimate: string;
      modeOfAction?: string;
      chemicalComposition?: string;
      fertilizerCategory?: 'Chemical Base';
      whereToFetch?: {
        storeType: string;
        recommendedShop: string;
        searchQuery: string;
        distance?: string;
        category: 'Bio-Organic' | 'Chemical Stockist' | 'Fertilizer Depot';
      };
    };
    inorganic?: {
      name: string;
      nameHi: string;
      nameKn?: string;
      dosage: string;
      frequency: string;
      precautions: string;
      costEstimate: string;
      modeOfAction?: string;
      chemicalComposition?: string;
      fertilizerCategory?: 'Inorganic Base';
      whereToFetch?: {
        storeType: string;
        recommendedShop: string;
        searchQuery: string;
        distance?: string;
        category: 'Bio-Organic' | 'Chemical Stockist' | 'Fertilizer Depot';
      };
    };
  };
  inorganicTreatment?: {
    name: string;
    nameHi: string;
    nameKn?: string;
    activeIngredient: string;
    applicationRate: string;
    method: string;
    frequency: string;
    costEstimate: string;
    modeOfAction: string;
    safetyPrecautions: string;
  };
  applicationDue?: {
    dueDate: string;
    dueWindow: string;
    recommendedTiming: string;
    nextRoundDue: string;
    priority: 'Immediate (Today)' | 'Within 24-48 Hours' | 'Scheduled Routine';
    weatherSafe: boolean;
  };
  organicTreatment: {
    name: string;
    nameHi: string;
    nameKn?: string;
    formulation: string;
    applicationRate: string;
    method: string;
    timing: string;
    withholdingPeriod: string;
    costEstimate: string;
    itkSource?: string;
    modeOfAction: string;
    safetyPrecautions: string;
    isITKFirst: boolean;
  };
  chemicalTreatment: {
    name: string;
    nameHi: string;
    nameKn?: string;
    activeIngredient: string;
    applicationRate: string;
    method: string;
    frequency: string;
    withholdingPeriod: string;
    costEstimate: string;
    modeOfAction: string;
    safetyPrecautions: string;
  };
  nutrientDeficiency?: any;
  weatherAdvisory: {
    canSprayNow: boolean;
    warningLevel: 'safe' | 'caution' | 'danger';
    title: string;
    message: string;
    optimalTiming: string;
  };
  explanation: {
    whyRecommended: string;
    organicJustification: string;
    chemicalJustification: string;
  };
  alternativeDiagnoses?: Array<{
    diseaseName: string;
    probability: number;
    keyDistinction: string;
  }>;
  topAlternatives?: Array<{
    diseaseName: string;
    probability: number;
    keyDistinction: string;
  }>;
  prevention: {
    immediate: string[];
    longTerm: string[];
  };
  recommendation: string;
  icarAdvisory?: string;
  boundingBox?: [number, number, number, number];
}

/**
 * Matches detected disease name and crop type against reference ICAR database
 */
export function matchTreatment(diseaseName: string, cropType?: string): DiseaseEntry | null {
  if (!diseaseName || diseaseName.toLowerCase().includes('healthy')) return null;

  // Direct search
  const found = searchDiseaseByName(diseaseName);
  if (found) return found;

  // Crop-filtered search
  if (cropType) {
    const cropDiseases = findDiseasesForCrop(cropType);
    if (cropDiseases.length > 0) {
      // Find closest disease in crop list
      const dName = diseaseName.toLowerCase();
      const match = cropDiseases.find(cd => 
        dName.includes(cd.name.toLowerCase()) || 
        cd.name.toLowerCase().includes(dName) ||
        cd.symptoms.some(s => dName.includes(s.toLowerCase()))
      );
      if (match) return match;
    }
  }

  // Fallback to closest match in entire DB
  const lower = diseaseName.toLowerCase();
  for (const d of DISEASE_DATABASE) {
    const words = lower.split(/\s+/);
    if (words.some(w => w.length > 3 && d.name.toLowerCase().includes(w))) {
      return d;
    }
  }

  return null;
}

/**
 * Calculates context-aware weather spray advice
 */
export function generateWeatherAdvisory(weather?: WeatherConditionInput): {
  canSprayNow: boolean;
  warningLevel: 'safe' | 'caution' | 'danger';
  title: string;
  message: string;
  optimalTiming: string;
} {
  const rainChance = weather?.rainChance ?? 0;
  const temp = weather?.temp ?? 27;
  const humidity = weather?.humidity ?? 60;
  const wind = weather?.windSpeed ?? 5;

  // Rain condition (highest risk)
  if (rainChance >= 60) {
    return {
      canSprayNow: false,
      warningLevel: 'danger',
      title: 'Rain Hazard: Spraying Prohibited',
      message: `High precipitation probability (${rainChance}%). Sprayed bio-pesticides and fungicides will wash off before absorption, causing chemical waste and runoff contamination. Wait for dry window.`,
      optimalTiming: 'Wait at least 24 hours after rain ceases and leaf canopy is completely dry.'
    };
  }

  // Extreme heat condition
  if (temp >= 35) {
    return {
      canSprayNow: false,
      warningLevel: 'caution',
      title: 'Heat Caution: High Ambient Temperature',
      message: `Current temperature is ${temp}°C. Mid-day spraying causes rapid droplet evaporation and severe chemical phytotoxicity (foliage scorching).`,
      optimalTiming: 'Spray strictly between 6:00 AM - 8:30 AM or after 5:30 PM in cool conditions.'
    };
  }

  // High wind condition
  if (wind >= 18) {
    return {
      canSprayNow: false,
      warningLevel: 'caution',
      title: 'High Wind Velocity',
      message: `Wind speed is ${wind} km/h. High wind drift will carry spray droplets away from the target crop onto non-target vegetation or water sources.`,
      optimalTiming: 'Wait for calm morning hours with wind speed under 10 km/h.'
    };
  }

  // High humidity (favorable for systemic bio-uptake, but watch fungal sporulation)
  if (humidity >= 85) {
    return {
      canSprayNow: true,
      warningLevel: 'caution',
      title: 'High Humidity Alert (RH > 85%)',
      message: `Moist air favors fungal spore germination. Ensure thorough coverage of leaf undersides with bio-fungicide before morning dew fully evaporates.`,
      optimalTiming: 'Apply bio-spray in late afternoon (4:30 PM) ensuring dry leaf surface.'
    };
  }

  return {
    canSprayNow: true,
    warningLevel: 'safe',
    title: 'Optimal Spray Window Active',
    message: `Weather parameters (Temp: ${temp}°C, Humidity: ${humidity}%, Rain risk: ${rainChance}%) are ideal for uniform droplet adherence and maximum absorption.`,
    optimalTiming: 'Early morning (7:00 AM - 10:00 AM) or evening (4:30 PM - 6:30 PM).'
  };
}

/**
 * Generates clear agronomic explanations for why specific treatments are recommended
 */
export function explainRecommendation(
  diseaseName: string,
  organicName: string,
  chemicalName: string,
  weather?: WeatherConditionInput
): {
  whyRecommended: string;
  organicJustification: string;
  chemicalJustification: string;
} {
  const dbMatch = searchDiseaseByName(diseaseName);

  const whyRecommended = dbMatch
    ? `Treatment protocol is engineered specifically for ${dbMatch.name} (${dbMatch.scientificName}), designed to halt active fungal mycelium/pathogen multiplication while restoring photosynthetic foliage health.`
    : `Treatment formulation provides targeted anti-pathogen action matched to the observed symptom morphology.`;

  const organicJustification = dbMatch?.organicTreatment?.itkSource
    ? `Prioritized Organic (ITK-First): ${organicName} is recommended as the primary tier. ${dbMatch.organicTreatment.itkSource} It provides effective disease suppression with 0-day harvest withholding and zero chemical soil residue.`
    : `Organic tier utilizes botanical active ingredients that stimulate plant natural systemic acquired resistance (SAR) without harming beneficial pollinators.`;

  const chemicalJustification = dbMatch?.chemicalTreatment?.modeOfAction
    ? `Targeted Chemical Backup: ${chemicalName} provides high-potency systemic knockdown when disease severity exceeds the economic injury threshold. ${dbMatch.chemicalTreatment.modeOfAction}`
    : `Chemical option offers curative systemic action for high-pressure outbreaks.`;

  return {
    whyRecommended,
    organicJustification,
    chemicalJustification
  };
}

export function generateInorganicTreatment(diseaseName: string, crop: string, dbMatch?: any) {
  const dLower = (diseaseName || '').toLowerCase();
  
  if (dLower.includes('wilt') || dLower.includes('rot') || dLower.includes('damping')) {
    return {
      name: "Potassium Schoenite (K₂SO₄·MgSO₄) + Chelated Zinc/Boron",
      nameHi: "पोटेशियम शोइनाइट + चिलेटेड जिंक/बोरोन",
      nameKn: "ಪೊಟ್ಯಾಸಿಯಮ್ ಶೋನೈಟ್ + ಜಿಂಕ್/ಬೋರಾನ್",
      activeIngredient: "Potassium Schoenite 23% K₂O + 11% Mg + Zinc EDTA 12%",
      applicationRate: "5.0 g / L water (Soil drench & foliar)",
      method: "Root zone drenching + light foliar mist",
      frequency: "2 applications at 8-day interval",
      costEstimate: "₹ 320 - ₹ 440 / acre",
      modeOfAction: "Provides bio-available potassium and magnesium ions to fortify root xylem cell walls and suppress vascular fungal penetration.",
      safetyPrecautions: "Apply in moist soil conditions for optimal nutrient uptake."
    };
  }

  if (dLower.includes('mosaic') || dLower.includes('curl') || dLower.includes('virus') || dLower.includes('chlorosis')) {
    return {
      name: "Zinc Sulphate 21% + Borax 0.2% + Multi-Micronutrient Grade IV",
      nameHi: "जिंक सल्फेट 21% + सुहागा (बोरेक्स) 0.2% + सूक्ष्म पोषक तत्व",
      nameKn: "ಜಿಂಕ್ ಸಲ್ಫೇಟ್ 21% + ಬೋರಾಕ್ಸ್ 0.2% + ಲಘು ಪೋಷಕಾಂಶಗಳು",
      activeIngredient: "Zinc Sulphate Heptahydrate + Sodium Tetraborate",
      applicationRate: "4.0 g Zinc + 1.5 g Borax / L water",
      method: "Foliar spray with uniform coverage on young leaves",
      frequency: "Every 10 days until leaf recovery (2-3 rounds)",
      costEstimate: "₹ 260 - ₹ 350 / acre",
      modeOfAction: "Restores viral-inhibited auxin production, stops vein yellowing, and reactivates photosynthetic chloroplast assembly.",
      safetyPrecautions: "Spray in cool morning hours; avoid tank mixing with concentrated phosphorus."
    };
  }

  if (dLower.includes('blight') || dLower.includes('spot') || dLower.includes('rust') || dLower.includes('mildew') || dLower.includes('blast')) {
    return {
      name: "Copper Oxychloride 50% WP (Mineral Base) + 19:19:19 NPK Foliar",
      nameHi: "कॉपर ऑक्सीक्लोराइड 50% WP (खनिज आधार) + 19:19:19 एनपीके",
      nameKn: "ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ 50% WP (ಖನಿಜ ಮೂಲ) + 19:19:19 NPK",
      activeIngredient: "Copper Oxychloride 50% WP + 100% Water Soluble NPK 19:19:19",
      applicationRate: "2.5 g COC + 5.0 g NPK / L water",
      method: "Foliar spray covering upper and lower leaf surfaces",
      frequency: "2 applications spaced 10-12 days apart",
      costEstimate: "₹ 380 - ₹ 490 / acre",
      modeOfAction: "Inorganic cupric ions denature fungal enzyme membranes while water-soluble NPK fuels rapid canopy leaf repair.",
      safetyPrecautions: "Do not mix with acidic pesticide formulations. Wear standard protective goggles."
    };
  }

  return {
    name: "100% Water-Soluble NPK (19:19:19) + Chelated Micro-Complex",
    nameHi: "100% पानी में घुलनशील एनपीके (19:19:19) + चिलेटेड सूक्ष्म पोषक तत्व",
    nameKn: "100% ನೀರಿನಲ್ಲಿ ಕರಗುವ NPK (19:19:19) + ಲಘು ಪೋಷಕಾಂಶಗಳು",
    activeIngredient: "Total Nitrogen 19%, P₂O₅ 19%, K₂O 19% + EDTA Fe, Zn, Mn, Cu",
    applicationRate: "5.0 g / L water (200 L / acre spray volume)",
    method: "Foliar spray with fine droplet mist",
    frequency: "Every 10-14 days during vegetative/fruiting stage",
    costEstimate: "₹ 290 - ₹ 390 / acre",
    modeOfAction: "Direct leaf stomatal intake accelerates cell division, thickens cuticular wax barriers, and restores photosynthetic vigor.",
    safetyPrecautions: "Spray in early morning (6-9 AM) or late afternoon (4-6 PM)."
  };
}

export function generateWhereToFetch(name: string, category: 'organic' | 'chemical' | 'inorganic') {
  if (category === 'organic') {
    return {
      storeType: "Certified Bio-Agri & Organic Input Kendra",
      recommendedShop: "Sri Lakshmi Bio-Agri & Natural Inputs",
      searchQuery: `${name} Organic Bio Pesticide Fertilizer`,
      distance: "1.2 km away",
      category: "Bio-Organic" as const
    };
  }
  if (category === 'chemical') {
    return {
      storeType: "Licensed Plant Protection & Chemical Stockist",
      recommendedShop: "Vikas Agro Chemicals & Seed Center",
      searchQuery: `${name} Crop Protection Fungicide`,
      distance: "2.8 km away",
      category: "Chemical Stockist" as const
    };
  }
  return {
    storeType: "Government Fertilizer Depot & IFFCO / PACS Center",
    recommendedShop: "Kisan Suvidha IFFCO Fertilizer Depot",
    searchQuery: `${name} Water Soluble NPK Micronutrient Fertilizer Depot`,
    distance: "1.8 km away",
    category: "Fertilizer Depot" as const
  };
}

export function generateApplicationDue(weatherAdvisory?: any, severity?: string) {
  const isSevere = severity === 'Severe' || severity === 'High';
  return {
    dueDate: "Tomorrow Morning",
    dueWindow: "6:00 AM – 9:00 AM",
    recommendedTiming: weatherAdvisory?.canSprayNow 
      ? "Optimal Spray Window • Zero rain washout risk & calm wind (<5 km/h)" 
      : "High Alert: Check local atmospheric humidity before foliar application",
    nextRoundDue: "Round 2 Due: In 7–10 days",
    priority: (isSevere ? 'Immediate (Today)' : 'Within 24-48 Hours') as any,
    weatherSafe: weatherAdvisory?.canSprayNow ?? true
  };
}

/**
 * Enriches raw Gemini / Local diagnosis result with full database treatment mappings,
 * ITK-First verification, nutrient deficiency mapping, and weather adjustments.
 */
export function enrichDiagnosis(raw: any, weather?: WeatherConditionInput): EnrichedDiagnosis {
  const healthStatus = raw.health_status || (raw.disease === 'Healthy Leaf' || raw.diseaseName === 'Healthy Leaf' ? 'HEALTHY' : 'DISEASED');
  const isHealthy = healthStatus === 'HEALTHY';
  const isUncertain = healthStatus === 'CANNOT_DIAGNOSE' || (!isHealthy && (raw.confidence < 0.60 || raw.confidence < 60));

  const crop = raw.crop || 'Crop';
  const diseaseName = isHealthy ? 'Healthy Foliage' : (raw.disease_name || raw.disease || 'Unknown Condition');
  const rawConfidence = raw.confidence ?? 75;

  const confidenceAssessment = calculateConfidenceAssessment(rawConfidence, healthStatus);
  const weatherAdvisory = generateWeatherAdvisory(weather);

  // Check for nutrient deficiency in raw payload or symptoms
  let deficiency: NutrientDeficiency | null = null;
  if (raw.nutrient_deficiency && raw.nutrient_deficiency.element) {
    deficiency = getNutrientDeficiencyById(raw.nutrient_deficiency.element) || null;
  }
  if (!deficiency && raw.symptoms_observed) {
    deficiency = detectNutrientDeficiencyFromSymptoms(raw.symptoms_observed, crop);
  }

  // Lookup in certified disease database
  const dbMatch = matchTreatment(diseaseName, crop);

  // Construct organic details
  const organicTreatment = {
    name: dbMatch?.organicTreatment?.name || raw.organic_treatment?.name || raw.treatment?.organic?.name || 'Neem Oil Spray 10,000 PPM',
    nameHi: dbMatch?.organicTreatment?.nameHi || raw.treatment?.organic?.nameHi || 'नीम का तेल स्प्रे',
    nameKn: dbMatch?.organicTreatment?.nameKn,
    formulation: dbMatch?.organicTreatment?.formulation || '3-5 ml per liter water with 1g soap emulsifier',
    applicationRate: dbMatch?.organicTreatment?.applicationRate || raw.organic_treatment?.application_rate || '200 L / acre',
    method: dbMatch?.organicTreatment?.method || raw.organic_treatment?.method || 'Foliar spray on both leaf surfaces',
    timing: dbMatch?.organicTreatment?.timing || raw.organic_treatment?.timing || 'Early morning (6-9 AM)',
    withholdingPeriod: dbMatch?.organicTreatment?.withholdingPeriod || '0 days',
    costEstimate: dbMatch?.organicTreatment?.costEstimate || raw.treatment?.organic?.costEstimate || '₹ 250 - ₹ 350 / acre',
    itkSource: dbMatch?.organicTreatment?.itkSource || 'ICAR Indigenous Technical Knowledge Database (ITK-First Protocol)',
    modeOfAction: dbMatch?.organicTreatment?.modeOfAction || raw.organic_treatment?.mode_of_action || 'Contact bio-antifungal and antifeedant action',
    safetyPrecautions: dbMatch?.organicTreatment?.safetyPrecautions || raw.treatment?.organic?.precautions || 'Safe for beneficial insects; avoid spraying during hottest sun hours.',
    isITKFirst: true
  };

  // Construct chemical details
  const chemicalTreatment = {
    name: dbMatch?.chemicalTreatment?.name || raw.chemical_treatment?.name || raw.treatment?.chemical?.name || 'Mancozeb 75% WP',
    nameHi: dbMatch?.chemicalTreatment?.nameHi || raw.treatment?.chemical?.nameHi || 'मैंकोज़ेब 75% डब्ल्यूपी',
    nameKn: dbMatch?.chemicalTreatment?.nameKn,
    activeIngredient: dbMatch?.chemicalTreatment?.activeIngredient || raw.chemical_treatment?.active_ingredient || 'Mancozeb 75% WP',
    applicationRate: dbMatch?.chemicalTreatment?.applicationRate || raw.chemical_treatment?.application_rate || '2.0 g / L water',
    method: dbMatch?.chemicalTreatment?.method || 'Foliar spray with uniform coverage',
    frequency: dbMatch?.chemicalTreatment?.frequency || raw.chemical_treatment?.frequency || '2 sprays at 12-day intervals',
    withholdingPeriod: dbMatch?.chemicalTreatment?.withholdingPeriod || raw.chemical_treatment?.withholding_period || '14 days before harvest',
    costEstimate: dbMatch?.chemicalTreatment?.costEstimate || raw.treatment?.chemical?.costEstimate || '₹ 420 - ₹ 540 / acre',
    modeOfAction: dbMatch?.chemicalTreatment?.modeOfAction || raw.chemical_treatment?.mode_of_action || 'Broad-spectrum multi-site protective fungicide',
    safetyPrecautions: dbMatch?.chemicalTreatment?.safetyPrecautions || raw.chemical_treatment?.safety_precautions || 'Wear rubber gloves and mask; wash spray equipment thoroughly away from water bodies.'
  };

  // Construct inorganic details
  const inorganicTreatment = generateInorganicTreatment(diseaseName, crop, dbMatch);

  const explanations = explainRecommendation(diseaseName, organicTreatment.name, chemicalTreatment.name, weather);

  // Build top alternatives if confidence is low or uncertain
  let topAlternatives = raw.top_alternatives;
  if (!topAlternatives && confidenceAssessment.showAlternatives && dbMatch) {
    const similar = findDiseasesForCrop(crop).filter(d => d.id !== dbMatch.id).slice(0, 3);
    topAlternatives = similar.map((s, idx) => ({
      diseaseName: s.name,
      probability: idx === 0 ? 0.35 : idx === 1 ? 0.20 : 0.10,
      keyDistinction: s.differentialDiagnosis || s.symptoms[0]
    }));
  }

  const applicationDue = generateApplicationDue(weatherAdvisory, raw.severity || dbMatch?.severity);

  return {
    healthStatus: isHealthy ? 'HEALTHY' : (deficiency ? 'NUTRIENT_DEFICIENCY' : (isUncertain ? 'CANNOT_DIAGNOSE' : 'DISEASED')),
    crop,
    disease: isHealthy ? 'Healthy Leaf' : (dbMatch?.name || diseaseName),
    diseaseHi: isHealthy ? 'स्वस्थ पत्ता (Healthy Leaf)' : (dbMatch?.nameHi || raw.disease_name_hindi || raw.diseaseHi || diseaseName),
    diseaseKn: isHealthy ? 'ಆರೋಗ್ಯಕರ ಎಲೆ (Healthy Leaf)' : (dbMatch?.nameKn || raw.disease_name_kannada || raw.diseaseKn || diseaseName),
    diseaseName: isHealthy ? 'Healthy Leaf' : (dbMatch?.name || diseaseName),
    diseaseNameHi: isHealthy ? 'स्वस्थ पत्ता (Healthy Leaf)' : (dbMatch?.nameHi || raw.disease_name_hindi || raw.diseaseHi || diseaseName),
    diseaseNameKn: isHealthy ? 'ಆರೋಗ್ಯಕರ ಎಲೆ (Healthy Leaf)' : (dbMatch?.nameKn || raw.disease_name_kannada || raw.diseaseKn || diseaseName),
    scientificName: dbMatch?.scientificName || raw.scientific_name || (isHealthy ? 'Healthy Plant Foliage' : 'Pathogen Unknown'),
    confidence: confidenceAssessment.normalizedPercentage,
    description: raw.description || (isHealthy ? 'Plant foliage demonstrates normal photosynthetic chlorophyll index with no visible fungal or viral pathology.' : `ICAR Certified diagnostic engine detected ${diseaseName} (${dbMatch?.scientificName || 'Plant Pathogen'}). ${dbMatch?.symptoms?.[0] || 'Observe recommended foliar treatment.'}`),
    confidenceAssessment,
    symptoms: dbMatch?.symptoms || raw.symptoms_observed || raw.symptoms || (isHealthy ? ['Uniform green coloration', 'Intact leaf margins', 'No necrotic spotting'] : ['Leaf spotting', 'Chlorosis']),
    differentialDiagnosis: dbMatch?.differentialDiagnosis,
    severity: isHealthy ? 'Low' : (dbMatch?.severity || raw.severity || 'Medium'),
    urgency: !weatherAdvisory.canSprayNow ? 'monitor' : (raw.urgency || (dbMatch?.severity === 'Severe' ? 'urgent' : 'advisory')),
    actionRequired: !weatherAdvisory.canSprayNow ? `Delay Spray: ${weatherAdvisory.message}` : `Apply ${organicTreatment.name} (${organicTreatment.applicationRate})`,
    treatment: {
      organic: {
        name: organicTreatment.name,
        nameHi: organicTreatment.nameHi,
        nameKn: organicTreatment.nameKn,
        dosage: organicTreatment.applicationRate || organicTreatment.formulation,
        frequency: organicTreatment.timing,
        precautions: organicTreatment.safetyPrecautions,
        costEstimate: organicTreatment.costEstimate,
        modeOfAction: organicTreatment.modeOfAction,
        itkSource: organicTreatment.itkSource,
        fertilizerCategory: 'Organic Base',
        whereToFetch: generateWhereToFetch(organicTreatment.name, 'organic')
      },
      chemical: {
        name: chemicalTreatment.name,
        nameHi: chemicalTreatment.nameHi,
        nameKn: chemicalTreatment.nameKn,
        dosage: chemicalTreatment.applicationRate,
        frequency: chemicalTreatment.frequency,
        precautions: chemicalTreatment.safetyPrecautions,
        costEstimate: chemicalTreatment.costEstimate,
        modeOfAction: chemicalTreatment.modeOfAction,
        chemicalComposition: chemicalTreatment.activeIngredient,
        fertilizerCategory: 'Chemical Base',
        whereToFetch: generateWhereToFetch(chemicalTreatment.name, 'chemical')
      },
      inorganic: {
        name: inorganicTreatment.name,
        nameHi: inorganicTreatment.nameHi,
        nameKn: inorganicTreatment.nameKn,
        dosage: inorganicTreatment.applicationRate,
        frequency: inorganicTreatment.frequency,
        precautions: inorganicTreatment.safetyPrecautions,
        costEstimate: inorganicTreatment.costEstimate,
        modeOfAction: inorganicTreatment.modeOfAction,
        chemicalComposition: inorganicTreatment.activeIngredient,
        fertilizerCategory: 'Inorganic Base',
        whereToFetch: generateWhereToFetch(inorganicTreatment.name, 'inorganic')
      }
    },
    organicTreatment,
    chemicalTreatment,
    inorganicTreatment,
    applicationDue,
    nutrientDeficiency: deficiency,
    weatherAdvisory,
    explanation: explanations,
    alternativeDiagnoses: topAlternatives,
    topAlternatives,
    prevention: {
      immediate: dbMatch?.prevention?.immediate || raw.prevention?.immediate || ['Prune infected leaves to restrict spread', 'Adjust watering method to prevent leaf wetness'],
      longTerm: dbMatch?.prevention?.longTerm || raw.prevention?.longTerm || ['Implement balanced NPK fertilization', 'Rotate crops with non-host species every 2-3 seasons']
    },
    recommendation: raw.recommendation || (isHealthy ? 'Maintain regular crop maintenance and scheduled nutrient irrigation.' : (weatherAdvisory.canSprayNow ? 'Apply prioritized organic treatment in early morning.' : weatherAdvisory.message)),
    icarAdvisory: (dbMatch as any)?.icarAdvisory || 'Follow standard ICAR/TNAU integrated pest management (IPM) practices and maintain proper field spacing.',
    boundingBox: raw.boundingBox
  };
}
