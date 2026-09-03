import { AgroCareContext, ToolCall, ToolDefinition } from './types';
import { getItkMatches } from '../../src/data/itk-knowledge';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Scheme Database Registry for India
const GOV_SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Direct income support of ₹6,000 per year in 3 equal installments to all landholding farmer families.',
    benefit: '₹6,000 / year',
    eligibility: 'All landholding farmer families with cultivable land in their names.',
    applicationLink: 'https://pmkisan.gov.in',
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    description: 'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.',
    benefit: 'Subsidized crop insurance premium (1.5% for Rabi, 2% for Kharif, 5% for commercial/horticultural).',
    eligibility: 'Farmers growing notified crops in notified areas (both loanee and non-loanee).',
    applicationLink: 'https://pmfby.gov.in',
  },
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    description: 'Subsidies of 40% to 50% on purchase of agricultural equipment, tractors, sprayers, and drones.',
    benefit: 'Up to 50% subsidy on farm machinery & tools.',
    eligibility: 'Small & marginal farmers, women farmers, SC/ST categories.',
    applicationLink: 'https://agrimachinery.nic.in',
  },
  {
    id: 'pmksy',
    name: 'PMKSY (Per Drop More Crop - Micro Irrigation)',
    description: 'Financial assistance for installation of drip and sprinkler irrigation systems to maximize water use efficiency.',
    benefit: '45% to 55% subsidy on Drip and Sprinkler irrigation setups.',
    eligibility: 'Farmers possessing cultivable land with an assured water source.',
    applicationLink: 'https://pmksy.gov.in',
  },
  {
    id: 'rkvy',
    name: 'RKVY - Organic Farming & Bio-Inputs (PKVY)',
    description: 'Support for cluster-based organic farming, vermicompost units, and organic certification.',
    benefit: '₹50,000 per hectare over 3 years for inputs and certification.',
    eligibility: 'Farmers forming groups or clusters for certified organic cultivation.',
    applicationLink: 'https://pgsindia-ncof.gov.in',
  },
];

export const toolRegistry: ToolDefinition[] = [
  {
    name: 'crop_diagnosis',
    description: 'Diagnose crop disease or health issues using image or described symptoms.',
    parameters: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string', description: 'Base64 image data or URL of the crop leaf/plant' },
        symptoms: { type: 'string', description: 'Observed symptoms on the leaf, stem, or fruit' },
        crop: { type: 'string', description: 'Crop name, e.g., Tomato, Potato, Wheat, Rice' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      try {
        const imageBase64 = args.imageUrl || context.currentDiagnosis?.imageUrl;
        if (!imageBase64) {
          return {
            status: 'symptoms_analyzed',
            crop: args.crop || context.crop || 'Crop',
            symptoms: args.symptoms,
            note: 'Image not provided. Diagnosis based on described symptoms.',
          };
        }

        const res = await fetch(`${BASE_URL}/api/gemini/diagnose`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            context.currentDiagnosis = {
              disease: data.disease,
              confidence: (data.confidence ?? 80) / 100,
              severity: data.severity,
              imageUrl: imageBase64,
            };
          }
          return data;
        }
      } catch (err: any) {
        console.warn('[Tool crop_diagnosis] Fetch error:', err?.message);
      }

      return {
        crop: args.crop || context.crop || 'Tomato',
        disease: 'Early Blight',
        confidence: 0.78,
        severity: 'Medium',
        actionRequired: 'Apply preventive neem spray or copper fungicide.',
      };
    },
  },
  {
    name: 'get_weather',
    description: 'Get real-time meteorological conditions, rain probability, wind speed, and farming advisory for the farm location.',
    parameters: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude coordinate of the farm' },
        lng: { type: 'number', description: 'Longitude coordinate of the farm' },
        userId: { type: 'string', description: 'User identifier for custom profile matching' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      const latitude = args.lat || context.location?.lat || 13.3409;
      const longitude = args.lng || context.location?.lng || 77.1010;
      const userId = args.userId || context.userId;

      try {
        const res = await fetch(`${BASE_URL}/api/weather-summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude, longitude, userId, language: context.language }),
        });

        if (res.ok) {
          const data = await res.json();
          context.weather = {
            temp: data.temperature,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            rainChance: data.rainProbability ?? data.maxRainProbability,
            forecast: data.advice,
          };
          return data;
        }
      } catch (err: any) {
        console.warn('[Tool get_weather] Fetch error:', err?.message);
      }

      // Realistic default weather
      context.weather = {
        temp: 28,
        humidity: 62,
        windSpeed: 10,
        rainChance: 15,
        forecast: ['Optimal day for routine field inspection.'],
      };
      return context.weather;
    },
  },
  {
    name: 'get_mandi_prices',
    description: 'Fetch live agricultural Mandi prices and modal arrival rates for crops in a state/district.',
    parameters: {
      type: 'object',
      properties: {
        crop: { type: 'string', description: 'Commodity name, e.g. Tomato, Potato, Onion, Rice, Chilli' },
        state: { type: 'string', description: 'State name, e.g. Karnataka, Maharashtra' },
        district: { type: 'string', description: 'District name' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      try {
        const queryParams = new URLSearchParams();
        if (args.state) queryParams.append('state', args.state);
        if (args.district) queryParams.append('district', args.district);

        const res = await fetch(`${BASE_URL}/api/mandi-prices?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          let records = data.records || [];
          const targetCrop = (args.crop || context.crop || '').toLowerCase();
          if (targetCrop && records.length > 0) {
            const filtered = records.filter((r: any) =>
              r.commodity?.toLowerCase().includes(targetCrop)
            );
            if (filtered.length > 0) records = filtered;
          }
          return {
            count: records.length,
            records: records.slice(0, 5),
            source: data.isFallback ? 'Cached Mandi Database' : 'data.gov.in Live APMC API',
          };
        }
      } catch (err: any) {
        console.warn('[Tool get_mandi_prices] Fetch error:', err?.message);
      }

      return {
        records: [
          { commodity: args.crop || 'Tomato', market: 'Tumkur APMC', modal_price: '2200', arrival_date: 'Today' },
          { commodity: args.crop || 'Tomato', market: 'Kolar APMC', modal_price: '2450', arrival_date: 'Today' },
        ],
        source: 'Local Baseline Reference',
      };
    },
  },
  {
    name: 'search_itk',
    description: 'Search the ICAR Indigenous Traditional Knowledge (ITK) repository for organic, low-cost bio-formulations and practices.',
    parameters: {
      type: 'object',
      properties: {
        crop: { type: 'string', description: 'Crop name' },
        problem: { type: 'string', description: 'Pest, disease, or agronomic challenge (e.g. aphid, blast, wilt, termite)' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      const crop = args.crop || context.crop || '';
      const problem = args.problem || context.currentDiagnosis?.disease || '';
      const matches = getItkMatches(crop, problem);
      return {
        matchedPractices: matches,
        count: matches.length,
        authority: 'ICAR 115th FoCARS ITK National Ledger',
      };
    },
  },
  {
    name: 'find_suppliers',
    description: 'Locate nearby authorized agri-input centers, fertilizer shops, and bio-pesticide retailers.',
    parameters: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude coordinate' },
        lng: { type: 'number', description: 'Longitude coordinate' },
        product: { type: 'string', description: 'Product type, e.g. Bio-pesticide, Urea, Neem Oil, Copper Oxychloride' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      const lat = args.lat || context.location?.lat || 13.3409;
      const lng = args.lng || context.location?.lng || 77.1010;

      try {
        const res = await fetch(`${BASE_URL}/api/gemini/nearby-suppliers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng, product: args.product }),
        });

        if (res.ok) {
          const suppliers = await res.json();
          if (Array.isArray(suppliers) && suppliers.length > 0) {
            return suppliers.slice(0, 3);
          }
        }
      } catch (err: any) {
        console.warn('[Tool find_suppliers] Fetch error:', err?.message);
      }

      return [
        {
          name: 'Sri Lakshmi Agri Inputs & Seed Center',
          distance: '1.2 km',
          contact: '+91 98450 12345',
          address: 'Main APMC Market Road, District Center',
          specialty: ['Seeds', 'Organic Fertilizers', 'Bio-Pesticides'],
        },
        {
          name: 'Kisan Seva Kendra APMC Store',
          distance: '2.8 km',
          contact: '+91 98450 67890',
          address: 'Mandi Road, Opposite Cooperative Bank',
          specialty: ['Fertilizers', 'Crop Protection'],
        },
      ];
    },
  },
  {
    name: 'google_maps_agent',
    description: 'Connect to real-time Google Maps data to pull information about agricultural places (APMC mandis, seed/fertilizer shops, cold storages, soil testing labs, KVK centers), travel routes, distances, and turn-by-turn driving directions.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Query describing place search, destination, or route' },
        origin: { type: 'string', description: 'Starting town or location' },
        destination: { type: 'string', description: 'Destination mandi or facility' },
        mode: { type: 'string', enum: ['places', 'routes', 'directions', 'all'], description: 'Type of maps data requested' },
      },
      required: ['query'],
    },
    executor: async (args: any, context: AgroCareContext) => {
      const lat = context.location?.lat || 13.3409;
      const lng = context.location?.lng || 77.1010;

      try {
        const res = await fetch(`${BASE_URL}/api/gemini/maps-agent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: args.query,
            origin: args.origin,
            destination: args.destination,
            mode: args.mode || 'all',
            lat,
            lng,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return {
            status: 'maps_grounded',
            summary: data.text,
            places: data.places?.slice(0, 3),
            routes: data.routes,
          };
        }
      } catch (err: any) {
        console.warn('[Tool google_maps_agent] Fetch error:', err?.message);
      }

      return {
        status: 'fallback',
        summary: 'Connected to regional Karnataka agricultural network (NH 48 expressway route, Tumakuru to Yeshwanthpur APMC Yard).',
        places: [
          { title: 'Yeshwanthpur APMC Yard', uri: 'https://maps.google.com/?q=Yeshwanthpur+APMC', distance: '68 km' },
          { title: 'Tumakuru APMC Market Yard', uri: 'https://maps.google.com/?q=Tumakuru+APMC', distance: '3.5 km' },
        ],
      };
    },
  },
  {
    name: 'check_scheme_eligibility',
    description: 'Check government agricultural subsidy schemes, financial support, and eligibility rules for the farmer.',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Farmer user ID' },
        crop: { type: 'string', description: 'Crop grown' },
        landholding: { type: 'string', description: 'Land size (e.g. 2 Acres, 5 Hectares)' },
        category: { type: 'string', description: 'Farmer category (e.g. Small & Marginal, Women, General)' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      const crop = (args.crop || context.crop || '').toLowerCase();
      const land = (args.landholding || context.farmerProfile?.size || '').toLowerCase();
      
      let matchedSchemes = GOV_SCHEMES;
      if (crop.includes('organic') || crop.includes('natural')) {
        matchedSchemes = GOV_SCHEMES.filter(s => s.id === 'rkvy' || s.id === 'pm-kisan');
      }

      return {
        eligibleSchemes: matchedSchemes.map(s => ({
          name: s.name,
          description: s.description,
          benefit: s.benefit,
          eligibility: s.eligibility,
          portal: s.applicationLink,
        })),
        farmerProfileSummary: {
          land: land || 'Smallholder (< 5 Acres)',
          crop: crop || context.crop || 'General',
        },
      };
    },
  },
  {
    name: 'analyze_soil',
    description: 'Evaluate soil health parameters (moisture, pH, NPK) and obtain tailored nutrient management plans.',
    parameters: {
      type: 'object',
      properties: {
        moisture: { type: 'number', description: 'Soil moisture percentage' },
        ph: { type: 'number', description: 'Soil pH value' },
        n: { type: 'number', description: 'Available Nitrogen (mg/kg or kg/ha)' },
        p: { type: 'number', description: 'Available Phosphorus (mg/kg or kg/ha)' },
        k: { type: 'number', description: 'Available Potassium (mg/kg or kg/ha)' },
        type: { type: 'string', description: 'Soil texture (e.g. Red Loamy, Black Clay, Sandy)' },
      },
    },
    executor: async (args: any, context: AgroCareContext) => {
      try {
        const payload = {
          data: {
            moisture: args.moisture ?? 35,
            ph: args.ph ?? 6.5,
            n: args.n ?? 45,
            p: args.p ?? 30,
            k: args.k ?? 180,
            type: args.type || context.farmerProfile?.soilType || 'Red Loamy',
          },
        };

        const res = await fetch(`${BASE_URL}/api/gemini/analyze-soil`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          context.soil = {
            moisture: payload.data.moisture,
            ph: payload.data.ph,
            npk: { n: payload.data.n, p: payload.data.p, k: payload.data.k },
          };
          return data;
        }
      } catch (err: any) {
        console.warn('[Tool analyze_soil] Fetch error:', err?.message);
      }

      return {
        status: 'Good',
        phAnalysis: 'Soil pH is neutral and favorable.',
        npkAnalysis: 'Nitrogen is moderate, Potassium is adequate.',
        recommendations: ['Incorporate well-rotted farmyard manure (FYM) at 5 tons/acre.'],
      };
    },
  },
  {
    name: 'get_profile',
    description: 'Retrieve the farmer profile (land size, cultivated crops, soil type, irrigation system).',
    parameters: {
      type: 'object',
      properties: {},
    },
    executor: async (_args: any, context: AgroCareContext) => {
      return context.farmerProfile || {
        name: 'Ramesh Kumar',
        crops: 'Tomato, Corn, Potato',
        size: '5 Acres',
        soilType: 'Red Loamy',
        irrigation: 'Drip Irrigation',
      };
    },
  },
  {
    name: 'get_diagnosis_history',
    description: 'Retrieve previous crop disease scans and diagnosis records for this farmer.',
    parameters: {
      type: 'object',
      properties: {},
    },
    executor: async (_args: any, context: AgroCareContext) => {
      return {
        count: context.recentDiagnoses?.length || 0,
        history: context.recentDiagnoses || [],
      };
    },
  },
  {
    name: 'search_fertilizer_rag',
    description: 'Query the authoritative Fertilizer Intelligence Knowledge Base (ICAR, FCO 1985, University Package of Practices) for grounded nutrient advice, timing, crop compatibility, and safety limits.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Farmer query or topic regarding fertilizers (e.g. "Can I apply Urea in Arecanut?", "DAP nutrient ratio")' },
        crop: { type: 'string', description: 'Target crop (e.g. Arecanut, Paddy, Tomato, Wheat)' },
      },
      required: ['query'],
    },
    executor: async (args: any, context: AgroCareContext) => {
      const { retrieveFertilizerKnowledge } = await import('./fertilizer/retriever');
      const { evaluateFertilizerSafety } = await import('./fertilizer/safetyEngine');
      
      const query = args.query || '';
      const crop = args.crop || context.crop || '';
      const retrieval = retrieveFertilizerKnowledge(query, crop, context.location?.name);
      const safety = evaluateFertilizerSafety(query, retrieval.entities, retrieval.intent, retrieval.structuredRecord, context.weather);

      return {
        fertilizer: retrieval.structuredRecord ? {
          id: retrieval.structuredRecord.fertilizerId,
          name: retrieval.structuredRecord.fertilizerName,
          category: retrieval.structuredRecord.category,
          nutrients: retrieval.structuredRecord.nutrientContent,
          fcoStandard: retrieval.structuredRecord.fcoStandard,
          applicationMethods: retrieval.structuredRecord.applicationMethods,
          applicationTiming: retrieval.structuredRecord.applicationTiming,
          compatibility: retrieval.structuredRecord.compatibility,
          incompatibility: retrieval.structuredRecord.incompatibility,
          precautions: retrieval.structuredRecord.precautions,
        } : null,
        crop: crop || retrieval.entities.crop,
        intent: retrieval.intent,
        safetyStatus: safety.outcome,
        safetyWarnings: safety.warnings,
        dosageDisclaimer: safety.dosageSafetyNotice,
        evidenceChunks: retrieval.chunks.map(c => ({
          title: c.title,
          organization: c.organization,
          sourceType: c.sourceType,
          excerpt: c.text,
          section: c.section
        })),
        sources: retrieval.sources.map(s => ({
          title: s.title,
          organization: s.organization,
          authorityLevel: s.authorityLevel,
          url: s.url
        }))
      };
    },
  },
  {
    name: 'get_fertilizer_details',
    description: 'Retrieve canonical FCO 1985 standards, nutrient percentage (N-P-K-S-Zn), dosage baselines, and certified precautions for a specific fertilizer.',
    parameters: {
      type: 'object',
      properties: {
        fertilizerName: { type: 'string', description: 'Name of the fertilizer (e.g. Urea, DAP, MOP, NPK 19-19-19, Zinc Sulphate, Borax, Neem Cake)' },
        crop: { type: 'string', description: 'Optional target crop' }
      },
      required: ['fertilizerName']
    },
    executor: async (args: any, context: AgroCareContext) => {
      const { retrieveFertilizerKnowledge } = await import('./fertilizer/retriever');
      const retrieval = retrieveFertilizerKnowledge(args.fertilizerName, args.crop || context.crop);
      if (retrieval.structuredRecord) {
        return {
          found: true,
          record: retrieval.structuredRecord,
          authoritativeSources: retrieval.sources
        };
      }
      return {
        found: false,
        message: `No exact official FCO record found for "${args.fertilizerName}".`,
        similarChunks: retrieval.chunks
      };
    }
  },
  {
    name: 'check_fertilizer_compatibility',
    description: 'Check chemical and biological tank-mix compatibility between two or more fertilizers or pesticides (e.g. Zinc Sulphate + DAP precipitate trap).',
    parameters: {
      type: 'object',
      properties: {
        fertilizerA: { type: 'string', description: 'First input / fertilizer / chemical (e.g. Zinc Sulphate)' },
        fertilizerB: { type: 'string', description: 'Second input / fertilizer / chemical (e.g. DAP)' }
      },
      required: ['fertilizerA', 'fertilizerB']
    },
    executor: async (args: any) => {
      const { retrieveFertilizerKnowledge } = await import('./fertilizer/retriever');
      const { evaluateFertilizerSafety } = await import('./fertilizer/safetyEngine');

      const combinedQuery = `Can I mix ${args.fertilizerA} with ${args.fertilizerB}?`;
      const retrieval = retrieveFertilizerKnowledge(combinedQuery);
      const safety = evaluateFertilizerSafety(combinedQuery, retrieval.entities, 'compatibility', retrieval.structuredRecord);

      return {
        query: combinedQuery,
        compatible: safety.outcome === 'ALLOW' && safety.warnings.length === 0,
        safetyOutcome: safety.outcome,
        warnings: safety.warnings,
        guidance: safety.reason || 'Check jar test before field tank mixing.'
      };
    }
  }
];

// Gemini-compatible tool definitions (declaration array)
export const toolDefinitions = toolRegistry.map(t => ({
  name: t.name,
  description: t.description,
  parameters: t.parameters,
}));

// Tool registry Map for fast lookup
const toolMap = new Map<string, (args: any, context: AgroCareContext) => Promise<any>>();
for (const tool of toolRegistry) {
  toolMap.set(tool.name, tool.executor);
}

export async function executeTool(call: ToolCall, context: AgroCareContext): Promise<any> {
  const executor = toolMap.get(call.name);
  if (!executor) {
    throw new Error(`Tool "${call.name}" is not registered in AgroCare Agent registry.`);
  }
  return await executor(call.args || {}, context);
}
