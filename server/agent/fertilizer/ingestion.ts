import { DocumentChunk, FertilizerRecord, SourceRecord } from './types';
import { FERTILIZER_DATABASE, AUTHORITATIVE_SOURCES } from './knowledgeBase';

/**
 * Ingestion and Document Chunker for Fertilizer Knowledge.
 * 
 * Implements:
 * 1. Text normalization & Prompt-injection cleaning (documents are treated as DATA, not instructions)
 * 2. Section extraction: Composition, Crop Suitability, Application Guidelines, Timing, Compatibility, Safety Limits
 * 3. Metadata enrichment: Source ID, Fertilizer, Crop, Authority level, Freshness dates
 * 4. Tokenization & Keyword extraction for hybrid search
 */

function sanitizeDocumentText(text: string): string {
  if (!text) return '';
  // Strip known prompt injection attempts embedded in document data
  let cleaned = text.replace(/ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, '[filtered]');
  cleaned = cleaned.replace(/system\s+prompt\s*:/gi, '[filtered]');
  cleaned = cleaned.replace(/reveal\s+(api\s+key|credentials|secret)/gi, '[filtered]');
  return cleaned.trim();
}

function extractKeywords(text: string, fertilizerName: string, crops: string[]): string[] {
  const words = text.toLowerCase().match(/\b[a-z0-9\-\:]{3,}\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'are', 'not', 'can', 'use', 'will', 'per']);
  const filtered = words.filter(w => !stopWords.has(w));
  
  const customSet = new Set<string>(filtered);
  customSet.add(fertilizerName.toLowerCase());
  for (const c of crops) {
    customSet.add(c.toLowerCase());
  }
  return Array.from(customSet).slice(0, 30);
}

export function buildDocumentChunks(): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 1;

  for (const fert of FERTILIZER_DATABASE) {
    const primarySource = fert.sourceRecords[0] || AUTHORITATIVE_SOURCES.FCO_1985;

    // 1. Overview & Definition Chunk
    const overviewText = sanitizeDocumentText(
      `${fert.fertilizerName} (${fert.formulation || fert.type}) is a standard ${fert.category} fertilizer regulated under ${fert.fcoStandard || 'FCO 1985'}. Physical form: ${fert.physicalForm || 'Granular/Prilled'}. Suitable for crops: ${fert.suitableCrops.join(', ')}.`
    );
    chunks.push({
      chunkId: `CHK-${String(chunkCounter++).padStart(4, '0')}`,
      documentId: `DOC-${fert.fertilizerId}`,
      sourceId: primarySource.sourceId,
      title: `${fert.fertilizerName} - Overview & FCO Standard`,
      organization: primarySource.organization,
      sourceType: primarySource.sourceType,
      fertilizer: fert.normalizedName,
      section: 'overview',
      text: overviewText,
      keywords: extractKeywords(overviewText, fert.fertilizerName, fert.suitableCrops),
      language: 'en',
      publishedDate: primarySource.publishedDate,
      accessedDate: primarySource.accessedDate,
      url: primarySource.url,
      isAuthoritative: true
    });

    // 2. Nutrient Composition Chunk
    const nutrientParts: string[] = [];
    if (fert.nutrientContent.N !== undefined) nutrientParts.push(`Total Nitrogen (N): ${fert.nutrientContent.N}%`);
    if (fert.nutrientContent.P !== undefined) nutrientParts.push(`Available Phosphate (P2O5): ${fert.nutrientContent.P}%`);
    if (fert.nutrientContent.K !== undefined) nutrientParts.push(`Water Soluble Potash (K2O): ${fert.nutrientContent.K}%`);
    if (fert.nutrientContent.secondary) {
      for (const [secKey, secVal] of Object.entries(fert.nutrientContent.secondary)) {
        nutrientParts.push(`${secKey}: ${secVal}%`);
      }
    }
    if (fert.nutrientContent.micronutrients) {
      for (const [microKey, microVal] of Object.entries(fert.nutrientContent.micronutrients)) {
        nutrientParts.push(`${microKey}: ${microVal}%`);
      }
    }
    if (fert.nutrientContent.microbialCount) {
      nutrientParts.push(`Microbial CFU Count: ${fert.nutrientContent.microbialCount}`);
    }

    const compositionText = sanitizeDocumentText(
      `Nutrient composition for ${fert.fertilizerName}: ${nutrientParts.join(', ')}. Official specification schedule: ${fert.fcoStandard || 'Government of India FCO schedule'}.`
    );
    chunks.push({
      chunkId: `CHK-${String(chunkCounter++).padStart(4, '0')}`,
      documentId: `DOC-${fert.fertilizerId}`,
      sourceId: AUTHORITATIVE_SOURCES.FCO_1985.sourceId,
      title: `${fert.fertilizerName} - Certified Nutrient Composition`,
      organization: AUTHORITATIVE_SOURCES.FCO_1985.organization,
      sourceType: AUTHORITATIVE_SOURCES.FCO_1985.sourceType,
      fertilizer: fert.normalizedName,
      section: 'nutrient_composition',
      text: compositionText,
      keywords: extractKeywords(compositionText, fert.fertilizerName, fert.suitableCrops),
      language: 'en',
      publishedDate: AUTHORITATIVE_SOURCES.FCO_1985.publishedDate,
      accessedDate: AUTHORITATIVE_SOURCES.FCO_1985.accessedDate,
      url: AUTHORITATIVE_SOURCES.FCO_1985.url,
      isAuthoritative: true
    });

    // 3. Crop Suitability & Package of Practices Chunk (Dedicated for each major crop like Arecanut)
    for (const crop of fert.suitableCrops) {
      let cropSource = primarySource;
      if (crop.toLowerCase().includes('arecanut') || crop.toLowerCase().includes('coconut')) {
        cropSource = AUTHORITATIVE_SOURCES.ICAR_ARECANUT;
      }

      const cropSpecificText = sanitizeDocumentText(
        `Crop Guidance for ${crop} with ${fert.fertilizerName}: Suitable crop stages include ${fert.cropStages.join(', ')}. Application methods: ${fert.applicationMethods.join(', ')}. Soil considerations: ${fert.soilConsiderations.join(' ')}.`
      );
      chunks.push({
        chunkId: `CHK-${String(chunkCounter++).padStart(4, '0')}`,
        documentId: `DOC-${fert.fertilizerId}-${crop.toLowerCase()}`,
        sourceId: cropSource.sourceId,
        title: `${fert.fertilizerName} for ${crop} - ICAR Package of Practices`,
        organization: cropSource.organization,
        sourceType: cropSource.sourceType,
        fertilizer: fert.normalizedName,
        crop: crop.toLowerCase(),
        section: 'crop_suitability',
        text: cropSpecificText,
        keywords: extractKeywords(cropSpecificText, fert.fertilizerName, [crop]),
        language: 'en',
        publishedDate: cropSource.publishedDate,
        accessedDate: cropSource.accessedDate,
        url: cropSource.url,
        isAuthoritative: true
      });
    }

    // 4. Timing & Application Guidelines Chunk
    const timingText = sanitizeDocumentText(
      `Application Timing & Methods for ${fert.fertilizerName}: ${fert.applicationTiming.join(' ')} Methods: ${fert.applicationMethods.join(', ')}.`
    );
    chunks.push({
      chunkId: `CHK-${String(chunkCounter++).padStart(4, '0')}`,
      documentId: `DOC-${fert.fertilizerId}-timing`,
      sourceId: AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP.sourceId,
      title: `${fert.fertilizerName} - Application Timing & Method Guidelines`,
      organization: AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP.organization,
      sourceType: AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP.sourceType,
      fertilizer: fert.normalizedName,
      section: 'timing',
      text: timingText,
      keywords: extractKeywords(timingText, fert.fertilizerName, fert.suitableCrops),
      language: 'en',
      publishedDate: AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP.publishedDate,
      accessedDate: AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP.accessedDate,
      url: AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP.url,
      isAuthoritative: true
    });

    // 5. Compatibility & Tank-Mix Rules Chunk
    const compatText = sanitizeDocumentText(
      `Compatibility Rules for ${fert.fertilizerName}: Compatible with: ${fert.compatibility.join(' ')} INCOMPATIBILITY WARNINGS: ${fert.incompatibility.join(' ')}.`
    );
    chunks.push({
      chunkId: `CHK-${String(chunkCounter++).padStart(4, '0')}`,
      documentId: `DOC-${fert.fertilizerId}-compatibility`,
      sourceId: AUTHORITATIVE_SOURCES.TNAU_AGRITECH.sourceId,
      title: `${fert.fertilizerName} - Tank-Mix Compatibility & Incompatibility Ledger`,
      organization: AUTHORITATIVE_SOURCES.TNAU_AGRITECH.organization,
      sourceType: AUTHORITATIVE_SOURCES.TNAU_AGRITECH.sourceType,
      fertilizer: fert.normalizedName,
      section: 'compatibility',
      text: compatText,
      keywords: extractKeywords(compatText, fert.fertilizerName, fert.suitableCrops),
      language: 'en',
      publishedDate: AUTHORITATIVE_SOURCES.TNAU_AGRITECH.publishedDate,
      accessedDate: AUTHORITATIVE_SOURCES.TNAU_AGRITECH.accessedDate,
      url: AUTHORITATIVE_SOURCES.TNAU_AGRITECH.url,
      isAuthoritative: true
    });

    // 6. Safety Precautions & Storage Chunk
    const safetyText = sanitizeDocumentText(
      `Handling Precautions & Safe Storage for ${fert.fertilizerName}: Precautions: ${fert.precautions.join(' ')} Storage requirements: ${fert.storage.join(' ')}.`
    );
    chunks.push({
      chunkId: `CHK-${String(chunkCounter++).padStart(4, '0')}`,
      documentId: `DOC-${fert.fertilizerId}-safety`,
      sourceId: primarySource.sourceId,
      title: `${fert.fertilizerName} - Safe Handling & Storage Directives`,
      organization: primarySource.organization,
      sourceType: primarySource.sourceType,
      fertilizer: fert.normalizedName,
      section: 'precautions',
      text: safetyText,
      keywords: extractKeywords(safetyText, fert.fertilizerName, fert.suitableCrops),
      language: 'en',
      publishedDate: primarySource.publishedDate,
      accessedDate: primarySource.accessedDate,
      url: primarySource.url,
      isAuthoritative: true
    });
  }

  return chunks;
}

// In-Memory Cached Chunks
export const COMPILED_DOCUMENT_CHUNKS: DocumentChunk[] = buildDocumentChunks();
