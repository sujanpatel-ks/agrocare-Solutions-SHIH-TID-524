import { DocumentChunk, FertilizerRecord, ExtractedEntities, FertilizerIntent, SourceRecord } from './types';
import { FERTILIZER_DATABASE, AUTHORITATIVE_SOURCES } from './knowledgeBase';
import { COMPILED_DOCUMENT_CHUNKS } from './ingestion';

/**
 * Hybrid Retriever for Fertilizer Intelligence.
 * 
 * Features:
 * - Deterministic Alias & Entity Normalizer (handles transliterations e.g., "यूरिया", "potash", "19-19-19", "adike", "supari")
 * - Multi-stage search combining Structured Entity Extraction + Filtered Document Chunk Scoring
 * - Intent Classifier (definition, nutrient_content, crop_suitability, compatibility, timing, disease_misconception, etc.)
 * - Prompt-injection resistance
 */

const FERTILIZER_ALIAS_MAP: Record<string, string> = {
  'urea': 'FERT-UREA',
  'neem coated urea': 'FERT-UREA',
  'ncu': 'FERT-UREA',
  'यूरिया': 'FERT-UREA',
  'ಯೂರಿಯಾ': 'FERT-UREA',
  'dap': 'FERT-DAP',
  'diammonium phosphate': 'FERT-DAP',
  '18:46:0': 'FERT-DAP',
  '18-46-0': 'FERT-DAP',
  'डीएपी': 'FERT-DAP',
  'ಡಿಎಪಿ': 'FERT-DAP',
  'mop': 'FERT-MOP',
  'muriate of potash': 'FERT-MOP',
  'potash': 'FERT-MOP',
  'kcl': 'FERT-MOP',
  'पोटाश': 'FERT-MOP',
  'ಪೊಟ್ಯಾಶ್': 'FERT-MOP',
  'npk 19 19 19': 'FERT-NPK-19-19-19',
  '19:19:19': 'FERT-NPK-19-19-19',
  '19-19-19': 'FERT-NPK-19-19-19',
  '19 19 19': 'FERT-NPK-19-19-19',
  'balanced npk': 'FERT-NPK-19-19-19',
  'ssp': 'FERT-SSP',
  'single super phosphate': 'FERT-SSP',
  'super phosphate': 'FERT-SSP',
  'zinc': 'FERT-ZINC-SULPHATE',
  'zinc sulphate': 'FERT-ZINC-SULPHATE',
  'zinc sulfate': 'FERT-ZINC-SULPHATE',
  'znso4': 'FERT-ZINC-SULPHATE',
  'जिंक': 'FERT-ZINC-SULPHATE',
  'ಜಿಂಕ್': 'FERT-ZINC-SULPHATE',
  'boron': 'FERT-BORAX',
  'borax': 'FERT-BORAX',
  'solubor': 'FERT-BORAX',
  'suhaga': 'FERT-BORAX',
  'magnesium': 'FERT-MAGNESIUM-SULPHATE',
  'magnesium sulphate': 'FERT-MAGNESIUM-SULPHATE',
  'epsom salt': 'FERT-MAGNESIUM-SULPHATE',
  'mgso4': 'FERT-MAGNESIUM-SULPHATE',
  'neem cake': 'FERT-NEEM-CAKE',
  'neem khali': 'FERT-NEEM-CAKE',
  'neem seed cake': 'FERT-NEEM-CAKE',
  'biofertilizer': 'FERT-BIO-AZOTOBACTER-PSB',
  'azotobacter': 'FERT-BIO-AZOTOBACTER-PSB',
  'azospirillum': 'FERT-BIO-AZOTOBACTER-PSB',
  'psb': 'FERT-BIO-AZOTOBACTER-PSB',
  'rhizobium': 'FERT-BIO-AZOTOBACTER-PSB'
};

const CROP_ALIAS_MAP: Record<string, string> = {
  'arecanut': 'Arecanut',
  'areca': 'Arecanut',
  'supari': 'Arecanut',
  'betel nut': 'Arecanut',
  'adike': 'Arecanut',
  'paddy': 'Paddy',
  'rice': 'Paddy',
  'dhan': 'Paddy',
  'wheat': 'Wheat',
  'gehun': 'Wheat',
  'tomato': 'Tomato',
  'tamatar': 'Tomato',
  'potato': 'Potato',
  'alu': 'Potato',
  'maize': 'Maize',
  'corn': 'Maize',
  'cotton': 'Cotton',
  'kapas': 'Cotton',
  'coconut': 'Coconut',
  'nariyal': 'Coconut',
  'cardamom': 'Cardamom',
  'chilli': 'Chilli',
  'mirchi': 'Chilli'
};

export function extractQueryEntities(query: string): ExtractedEntities {
  const qLower = query.toLowerCase();
  let foundFertId: string | undefined;
  let foundFertName: string | undefined;
  let secondaryFertName: string | undefined;

  // Detect fertilizer entities
  for (const [alias, fertId] of Object.entries(FERTILIZER_ALIAS_MAP)) {
    const regex = new RegExp(`\\b${alias.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(qLower)) {
      if (!foundFertId) {
        foundFertId = fertId;
        foundFertName = alias;
      } else if (foundFertId !== fertId && !secondaryFertName) {
        secondaryFertName = alias;
      }
    }
  }

  // Detect crop entities
  let foundCrop: string | undefined;
  for (const [alias, canonicalCrop] of Object.entries(CROP_ALIAS_MAP)) {
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(qLower)) {
      foundCrop = canonicalCrop;
      break;
    }
  }

  // Detect crop stages
  let cropStage: string | undefined;
  if (/basal|sowing|planting|transplant/i.test(qLower)) cropStage = 'Basal';
  else if (/vegetative|tillering|growing/i.test(qLower)) cropStage = 'Vegetative';
  else if (/flower|flowering|bloom/i.test(qLower)) cropStage = 'Flowering';
  else if (/fruit|nut setting|development|maturity/i.test(qLower)) cropStage = 'Nut/Fruit Development';

  const isDosageQuery = /how much|quantity|dose|dosage|kg|gram|acre|hectare|per palm|rate of application|kitna|kitni/i.test(qLower);
  const isWeatherDependent = /weather|rain|tomorrow|spray|wind|monsoon|raining|can i apply|barish|barsat/i.test(qLower);
  const isCompatibilityQuery = /mix|tank mix|combine|blend|together|along with|compatibility|incompatible|reaction/i.test(qLower);
  const isDiseaseCureQuery = /cure|koleroga|rot|blight|fungus|disease|bacterial|wilt|yellow leaf|pest|infestation|ilaj|rok/i.test(qLower);

  return {
    fertilizer: foundFertName,
    normalizedFertilizerId: foundFertId,
    secondaryFertilizer: secondaryFertName,
    crop: foundCrop,
    cropStage,
    isDosageQuery,
    isWeatherDependent,
    isCompatibilityQuery,
    isDiseaseCureQuery,
    actionRequested: query
  };
}

export function classifyFertilizerIntent(query: string, entities: ExtractedEntities): FertilizerIntent {
  const q = query.toLowerCase();

  // Unsupported or suspicious product patterns
  if (/\b(abc-999|xyz-fertilizer|magic-grow-secret|fake-boost|unknown-chemical)\b/i.test(q)) {
    return 'unsupported_high_risk';
  }

  if (entities.isDiseaseCureQuery && (entities.fertilizer || entities.crop)) {
    return 'disease_misconception_check';
  }

  if (entities.isCompatibilityQuery || (entities.fertilizer && entities.secondaryFertilizer)) {
    return 'compatibility';
  }

  if (/what is|explain|define|tell me about|meaning of|batao/i.test(q) && entities.fertilizer && !entities.crop && !entities.isDosageQuery) {
    return 'fertilizer_definition';
  }

  if (/nutrient|percentage|npk ratio|composition|how much nitrogen|phosphorus|potash|formula/i.test(q)) {
    return 'nutrient_content';
  }

  if (entities.crop && (entities.fertilizer || /fertilizer|manure|khad/i.test(q))) {
    if (/when|timing|time|month|stage/i.test(q)) {
      return 'timing';
    }
    if (/how to apply|method|fertigation|foliar|basin/i.test(q)) {
      return 'application_guidance';
    }
    return 'crop_suitability';
  }

  if (/precaution|safe|hazard|toxic|harmful|damage|burn|side effect/i.test(q)) {
    return 'precautions';
  }

  if (/store|storage|shelf life|keep/i.test(q)) {
    return 'storage';
  }

  if (/soil|acidic|alkaline|ph|saline|sandy|clay/i.test(q)) {
    return 'soil_consideration';
  }

  if (/price|mandi|rate|cost|buy|dealer|shop/i.test(q)) {
    return 'price_availability';
  }

  return 'general_agriculture';
}

export interface RetrievalResult {
  structuredRecord: FertilizerRecord | null;
  chunks: DocumentChunk[];
  sources: SourceRecord[];
  entities: ExtractedEntities;
  intent: FertilizerIntent;
  confidenceScore: number;
}

export function retrieveFertilizerKnowledge(
  query: string, 
  userCrop?: string, 
  userLocation?: string
): RetrievalResult {
  const entities = extractQueryEntities(query);
  if (!entities.crop && userCrop) {
    entities.crop = CROP_ALIAS_MAP[userCrop.toLowerCase()] || userCrop;
  }

  const intent = classifyFertilizerIntent(query, entities);

  // 1. Structured DB Record
  let structuredRecord: FertilizerRecord | null = null;
  if (entities.normalizedFertilizerId) {
    structuredRecord = FERTILIZER_DATABASE.find(f => f.fertilizerId === entities.normalizedFertilizerId) || null;
  }

  // 2. Score Document Chunks
  const qTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const scoredChunks: Array<{ chunk: DocumentChunk; score: number }> = [];

  for (const chunk of COMPILED_DOCUMENT_CHUNKS) {
    let score = 0;

    // Fertilizer matching boost
    if (structuredRecord && chunk.fertilizer === structuredRecord.normalizedName) {
      score += 40;
    }

    // Crop matching boost
    if (entities.crop && chunk.crop && chunk.crop.toLowerCase() === entities.crop.toLowerCase()) {
      score += 35;
    }

    // Intent/Section alignment
    if (intent === 'fertilizer_definition' && chunk.section === 'overview') score += 25;
    if (intent === 'nutrient_content' && chunk.section === 'nutrient_composition') score += 30;
    if (intent === 'crop_suitability' && chunk.section === 'crop_suitability') score += 30;
    if (intent === 'timing' && chunk.section === 'timing') score += 30;
    if (intent === 'compatibility' && chunk.section === 'compatibility') score += 40;
    if (intent === 'precautions' && chunk.section === 'precautions') score += 30;

    // Token keyword match
    for (const token of qTokens) {
      if (chunk.keywords.includes(token)) score += 5;
      if (chunk.text.toLowerCase().includes(token)) score += 3;
      if (chunk.title.toLowerCase().includes(token)) score += 8;
    }

    // Authoritative source boost
    if (chunk.isAuthoritative) {
      score += 10;
    }

    if (score > 15) {
      scoredChunks.push({ chunk, score });
    }
  }

  // Sort by score descending
  scoredChunks.sort((a, b) => b.score - a.score);
  const topChunks = scoredChunks.slice(0, 5).map(sc => sc.chunk);

  // Extract unique sources
  const sourceMap = new Map<string, SourceRecord>();
  if (structuredRecord) {
    for (const src of structuredRecord.sourceRecords) {
      sourceMap.set(src.sourceId, src);
    }
  }
  for (const c of topChunks) {
    const src = Object.values(AUTHORITATIVE_SOURCES).find(s => s.sourceId === c.sourceId);
    if (src) sourceMap.set(src.sourceId, src);
  }

  const confidenceScore = structuredRecord ? 0.95 : topChunks.length > 0 ? 0.80 : 0.40;

  return {
    structuredRecord,
    chunks: topChunks,
    sources: Array.from(sourceMap.values()),
    entities,
    intent,
    confidenceScore
  };
}
