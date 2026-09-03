import { GoogleGenAI } from '@google/genai';
import { 
  FertilizerAgentRequest, 
  FertilizerAgentResponse, 
  FertilizerRecord, 
  DocumentChunk, 
  SourceRecord 
} from './types';
import { retrieveFertilizerKnowledge } from './retriever';
import { evaluateFertilizerSafety } from './safetyEngine';
import { logAgentDecision, startTrace, finalizeTrace } from '../trace';

const AGENT_MODEL = 'gemini-2.5-flash';

/**
 * Builds grounded fallback answer when offline or Gemini API is not available.
 */
function buildGroundedFallback(
  request: FertilizerAgentRequest,
  record: FertilizerRecord | null,
  chunks: DocumentChunk[],
  sources: SourceRecord[],
  safety: any,
  lang: string
): FertilizerAgentResponse {
  const isHindi = lang === 'hi';
  const isKannada = lang === 'kn';

  let answerText = '';
  const directlySupportedFacts: string[] = [];
  const derivedInterpretation: string[] = [];
  const unknowns: string[] = [];

  if (safety.outcome === 'DEFER') {
    answerText = isHindi 
      ? `चेतावनी: यह उत्पाद आधिकारिक उर्वरक नियंत्रण आदेश (FCO 1985) के तहत पंजीकृत नहीं है। अज्ञात रसायनों का उपयोग करने से फसल को नुकसान हो सकता है। कृपया अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।`
      : isKannada
      ? `ಎಚ್ಚರಿಕೆ: ಈ ಉತ್ಪನ್ನವು ರಸಗೊಬ್ಬರ ನಿಯಂತ್ರಣ ಆದೇಶ (FCO 1985) ಅಡಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿಲ್ಲ. ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.`
      : `Warning: This product is not verified under the official Fertilizer (Control) Order (FCO 1985). Using unregistered agricultural chemicals poses severe crop burning and soil health risks. Please consult your local Krishi Vigyan Kendra (KVK).`;
  } else if (record) {
    // 1. Facts from record
    if (record.nutrientContent.N !== undefined && record.nutrientContent.P !== undefined && record.nutrientContent.K !== undefined) {
      directlySupportedFacts.push(`Official Nutrient Ratio: ${record.nutrientContent.N}% Nitrogen (N), ${record.nutrientContent.P}% Phosphorus (P2O5), ${record.nutrientContent.K}% Potash (K2O).`);
    }
    if (record.fcoStandard) {
      directlySupportedFacts.push(`Regulatory Standard: ${record.fcoStandard}`);
    }
    if (record.suitableCrops.length > 0) {
      directlySupportedFacts.push(`Registered Crop Suitability: ${record.suitableCrops.join(', ')}.`);
    }

    // 2. Application & Incompatibilities
    if (record.incompatibility.length > 0) {
      derivedInterpretation.push(`Incompatibility Notice: ${record.incompatibility.join(' ')}`);
    }
    if (record.applicationTiming.length > 0) {
      derivedInterpretation.push(`Timing Guidance: ${record.applicationTiming.join(' ')}`);
    }

    // Compose primary answer
    const cropMention = request.crop ? ` for ${request.crop}` : '';
    answerText = `${record.fertilizerName}${cropMention} is a certified ${record.category} fertilizer.\n\n` +
      `• Nutrient Composition: ${directlySupportedFacts[0] || 'Standard FCO Grade'}\n` +
      `• Application Protocol: ${record.applicationMethods.join(', ')}.\n` +
      `• Best Timing: ${record.applicationTiming[0] || 'Apply in split doses during active growth.'}\n` +
      (record.incompatibility.length > 0 ? `\n⚠️ Safety & Compatibility: ${record.incompatibility[0]}\n` : '');

    if (safety.warnings.length > 0) {
      answerText += `\nAdvisory Notes:\n` + safety.warnings.map((w: string) => `• ${w}`).join('\n');
    }
  } else if (chunks.length > 0) {
    answerText = `Based on ICAR & Agriculture Extension records:\n\n${chunks[0].text}\n\n${chunks.length > 1 ? chunks[1].text : ''}`;
    directlySupportedFacts.push(chunks[0].title);
  } else {
    answerText = isHindi
      ? `माफ़ कीजिये, इस प्रश्न के लिए आधिकारिक कृषि रिकॉर्ड में पर्याप्त विवरण नहीं मिला। कृपया अपने फसल और उर्वरक का नाम स्पष्ट रूप से बताएं।`
      : isKannada
      ? `ಕ್ಷಮಿಸಿ, ಈ ಪ್ರಶ್ನೆಗೆ ಅಧಿಕೃತ ಕೃಷಿ ದಾಖಲೆಗಳಲ್ಲಿ ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಸಿಕ್ಕಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಗೊಬ್ಬರದ ಹೆಸರನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ.`
      : `I could not find a confirmed authoritative match in the ICAR/FCO database for this query. Please specify the exact crop and fertilizer name (e.g. Urea, DAP, MOP, NPK 19:19:19, Zinc Sulphate) or consult your local KVK extension officer.`;
    unknowns.push('Fertilizer active formulation');
  }

  if (safety.missingContextFields && safety.missingContextFields.length > 0) {
    unknowns.push(...safety.missingContextFields);
  }

  return {
    status: safety.outcome === 'DEFER' ? 'deferred' : safety.warnings.length > 0 ? 'safety_warning' : 'success',
    intent: 'general_agriculture',
    fertilizer: record,
    crop: request.crop || null,
    answer: answerText,
    directlySupportedFacts,
    derivedInterpretation,
    unknowns,
    evidence: chunks,
    sources,
    confidence: record ? 0.95 : chunks.length > 0 ? 0.85 : 0.40,
    safety,
    needsClarification: safety.missingContextFields && safety.missingContextFields.length > 0,
    clarificationPrompt: safety.missingContextFields && safety.missingContextFields.length > 0 
      ? `To provide a more accurate recommendation, please specify: ${safety.missingContextFields.join(', ')}.`
      : undefined,
    traceId: 'trace-fallback-' + Date.now(),
    latencyMs: 15,
    suggestedFollowUps: record ? [
      `How to apply ${record.fertilizerName} in Arecanut?`,
      `What are the compatibility rules for ${record.fertilizerName}?`,
      `Find nearby verified suppliers for ${record.fertilizerName}`
    ] : [
      'Urea application timing for Arecanut',
      'Can I mix Zinc Sulphate with DAP?',
      'Best NPK fertilizer schedule for Tomato'
    ]
  };
}

export async function askFertilizerAgent(
  request: FertilizerAgentRequest,
  weatherContext?: any
): Promise<FertilizerAgentResponse> {
  const startTime = Date.now();
  const traceId = startTrace(request.conversationId || 'fertilizer-session');
  const lang = request.language || 'en';
  const langName = lang === 'hi' ? 'Hindi' : lang === 'kn' ? 'Kannada' : 'English';
  const queryText = request.message || request.query || (request.fertilizerName ? `Information and dosage for ${request.fertilizerName}` : 'fertilizer advisory');

  logAgentDecision(traceId, 'FERTILIZER_AGENT_INPUT', { message: queryText, crop: request.crop });

  // 1. Hybrid Retrieval
  const retrieval = retrieveFertilizerKnowledge(queryText, request.crop, request.location);
  logAgentDecision(traceId, 'FERTILIZER_RETRIEVAL_COMPLETE', { 
    matchedFertilizer: retrieval.structuredRecord?.fertilizerName, 
    chunkCount: retrieval.chunks.length,
    intent: retrieval.intent
  });

  // 2. Deterministic Safety Policy Execution
  const effectiveWeather = weatherContext || request.weather;
  const safety = evaluateFertilizerSafety(
    queryText,
    retrieval.entities,
    retrieval.intent,
    retrieval.structuredRecord,
    effectiveWeather
  );
  logAgentDecision(traceId, 'FERTILIZER_SAFETY_EVALUATION', safety);

  // If safety engine requires immediate deferral (e.g. unverified/dangerous chemical), return immediately
  if (safety.outcome === 'DEFER') {
    finalizeTrace(traceId, 'BLOCKED_BY_SAFETY_POLICY');
    return buildGroundedFallback(
      request,
      retrieval.structuredRecord,
      retrieval.chunks,
      retrieval.sources,
      safety,
      lang
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    finalizeTrace(traceId, 'COMPLETED_OFFLINE_RAG');
    const result = buildGroundedFallback(
      request,
      retrieval.structuredRecord,
      retrieval.chunks,
      retrieval.sources,
      safety,
      lang
    );
    result.latencyMs = Date.now() - startTime;
    return result;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-agrocare-fertilizer-agent',
        },
      },
    });

    const groundingContext = `
AUTHORITATIVE KNOWLEDGE BASE RETRIEVAL:
${retrieval.structuredRecord ? `
[STRUCTURED FCO/ICAR FERTILIZER RECORD]:
- Name: ${retrieval.structuredRecord.fertilizerName}
- Category: ${retrieval.structuredRecord.category} (${retrieval.structuredRecord.type})
- FCO Specification: ${retrieval.structuredRecord.fcoStandard || 'Standard'}
- Nutrient Content: N: ${retrieval.structuredRecord.nutrientContent.N ?? 0}%, P2O5: ${retrieval.structuredRecord.nutrientContent.P ?? 0}%, K2O: ${retrieval.structuredRecord.nutrientContent.K ?? 0}%
- Suitable Crops: ${retrieval.structuredRecord.suitableCrops.join(', ')}
- Application Timing: ${retrieval.structuredRecord.applicationTiming.join(' ')}
- Compatibility: ${retrieval.structuredRecord.compatibility.join(' ')}
- INCOMPATIBILITY WARNINGS: ${retrieval.structuredRecord.incompatibility.join(' ')}
- Precautions: ${retrieval.structuredRecord.precautions.join(' ')}
` : '[No single exact fertilizer record match in structured catalog]'}

[DOCUMENT EXCERPTS & RESEARCH BULLETINS]:
${retrieval.chunks.map((c, i) => `--- Chunk ${i + 1} (${c.title} | ${c.organization}) ---
${c.text}
`).join('\n')}

[DETERMINISTIC SAFETY POLICY RESULTS]:
- Outcome: ${safety.outcome}
- Safety Warnings to Mandate: ${JSON.stringify(safety.warnings)}
- Dosage Guidance Constraint: ${safety.dosageSafetyNotice || 'Provide standard reference ranges with mandatory Soil Health Card disclaimer'}
${safety.weatherGate?.blocked ? `- Weather Gate Blocked: ${safety.weatherGate.reason}` : ''}
`;

    const systemPrompt = `You are the AgroCare Fertilizer Intelligence RAG Specialist for Indian Agriculture.
Your responsibility is to provide precise, evidence-grounded agronomic answers based ONLY on the provided ICAR, FCO 1985, and University Package of Practices evidence.

STRICT OPERATIONAL RULES:
1. Grounding & Anti-Hallucination: Answer ONLY using facts present in the Grounding Context. If a fact or dosage is not in the context, explicitly state that it is unknown.
2. Incompatibilities: Emphasize all chemical tank-mix incompatibilities (e.g. Zinc Sulphate + DAP precipitate, Biofertilizers + Chemical Fungicides).
3. Disease Trap: Fertilizers provide plant nutrition, NOT direct fungicidal cure for active disease outbreaks (e.g. Koleroga/Fruit rot in Arecanut).
4. Dosage Safety: State that standard ICAR package-of-practices rates are reference baselines, but precise field application requires calibration with a Soil Health Card test.
5. Language: Deliver your primary response in ${langName}.
6. Output JSON: You MUST respond ONLY with a valid JSON object matching this schema:
{
  "answer": "Clear, grounded, professional explanation in ${langName} with bullet points for readability",
  "directlySupportedFacts": ["Fact directly backed by source document 1", "Fact directly backed by source document 2"],
  "derivedInterpretation": ["Agronomic interpretation for user crop/condition"],
  "unknowns": ["Any missing parameters such as soil pH, palm age, test report"],
  "suggestedFollowUps": ["Follow up question 1", "Follow up question 2", "Follow up question 3"]
}`;

    const userPrompt = `Farmer Query: "${request.message}"
User Context:
- Target Crop: ${request.crop || 'Not specified'}
- Location: ${request.location || 'India'}
- Farmer Context: ${JSON.stringify(request.farmerContext || {})}

${groundingContext}`;

    const response = await ai.models.generateContent({
      model: AGENT_MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '';
    let parsed: any = {};
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch {}
      }
    }

    const answer = parsed.answer || responseText || buildGroundedFallback(request, retrieval.structuredRecord, retrieval.chunks, retrieval.sources, safety, lang).answer;
    const directlySupportedFacts = Array.isArray(parsed.directlySupportedFacts) ? parsed.directlySupportedFacts : [];
    const derivedInterpretation = Array.isArray(parsed.derivedInterpretation) ? parsed.derivedInterpretation : [];
    const unknowns = Array.isArray(parsed.unknowns) ? parsed.unknowns : [];
    const suggestedFollowUps = Array.isArray(parsed.suggestedFollowUps) ? parsed.suggestedFollowUps : [];

    finalizeTrace(traceId, 'SUCCESS');

    return {
      status: safety.warnings.length > 0 ? 'safety_warning' : 'success',
      intent: retrieval.intent,
      fertilizer: retrieval.structuredRecord,
      crop: request.crop || retrieval.entities.crop || null,
      answer,
      directlySupportedFacts,
      derivedInterpretation,
      unknowns,
      evidence: retrieval.chunks,
      sources: retrieval.sources,
      confidence: retrieval.confidenceScore,
      safety,
      needsClarification: unknowns.length > 0 || (safety.missingContextFields && safety.missingContextFields.length > 0),
      clarificationPrompt: unknowns.length > 0 ? `For a tailored dose, please provide: ${unknowns.join(', ')}.` : undefined,
      traceId,
      latencyMs: Date.now() - startTime,
      suggestedFollowUps
    };
  } catch (err) {
    console.error('[FERTILIZER_AGENT] Gemini call failed, falling back to grounded rule engine:', err);
    finalizeTrace(traceId, 'FALLBACK_TRIGGERED');
    const fallbackResult = buildGroundedFallback(
      request,
      retrieval.structuredRecord,
      retrieval.chunks,
      retrieval.sources,
      safety,
      lang
    );
    fallbackResult.latencyMs = Date.now() - startTime;
    return fallbackResult;
  }
}
