// agentTools.ts — Gemini Function Calling Declarations
import { Type, FunctionDeclaration } from '@google/genai';

export const AGROCARE_TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'get_crop_diagnosis',
    description: 'Get AI diagnosis for a crop disease from image or symptom description.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        crop: { type: Type.STRING, description: 'Crop name e.g. Tomato, Potato, Paddy, Cotton' },
        symptoms: { type: Type.STRING, description: 'Observed visible symptoms on leaves, stem or fruits' },
        severity: { type: Type.STRING, description: 'Estimated severity (Low, Medium, High)' }
      },
      required: ['crop', 'symptoms']
    }
  },
  {
    name: 'get_weather',
    description: 'Get current and 3-day forecast weather for farmer location. Mandatory check before recommending any spraying.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER, description: 'Latitude coordinate of the farm' },
        lng: { type: Type.NUMBER, description: 'Longitude coordinate of the farm' },
        district: { type: Type.STRING, description: 'District or town name' }
      },
      required: ['lat', 'lng']
    }
  },
  {
    name: 'search_itk_knowledge',
    description: 'Search Indigenous Technical Knowledge (ITK) database for organic and traditional herbal remedies verified by ICAR. Always call before recommending synthetic chemical intervention.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        crop: { type: Type.STRING, description: 'Crop name' },
        disease: { type: Type.STRING, description: 'Disease, pest, or problem' },
        region: { type: Type.STRING, description: 'Geographic region or state (e.g. Karnataka, South India)' }
      },
      required: ['crop', 'disease']
    }
  },
  {
    name: 'check_scheme_eligibility',
    description: 'Check Indian central and state government agricultural scheme eligibility (PM-KISAN, PMFBY, KUSUM, Soil Health Card, Raitha Siri).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        state: { type: Type.STRING, description: 'State name e.g. Karnataka' },
        crop: { type: Type.STRING, description: 'Primary crop' },
        farmSizeHectares: { type: Type.NUMBER, description: 'Farm landholding in hectares or acres' }
      },
      required: ['state', 'crop']
    }
  },
  {
    name: 'find_nearby_supplier',
    description: 'Find nearby verified agro-input suppliers for organic or chemical inputs and fertilizers.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER, description: 'Farmer latitude' },
        lng: { type: Type.NUMBER, description: 'Farmer longitude' },
        inputType: { 
          type: Type.STRING, 
          description: 'Type of input needed: organic, chemical, or both',
          enum: ['organic', 'chemical', 'both']
        },
        radiusKm: { type: Type.NUMBER, description: 'Search radius in km (default 25)' }
      },
      required: ['lat', 'lng', 'inputType']
    }
  },
  {
    name: 'get_mandi_prices',
    description: 'Get current mandi (APMC market) live commodity modal prices, minimum, and maximum prices for the crop.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        crop: { type: Type.STRING, description: 'Commodity or crop name' },
        state: { type: Type.STRING, description: 'State name e.g. Karnataka, Maharashtra' }
      },
      required: ['crop', 'state']
    }
  },
  {
    name: 'get_sensor_data',
    description: 'Get IoT soil sensor readings (moisture %, NPK, pH, soil temperature) for the farmer field.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        farmerId: { type: Type.STRING, description: 'Farmer or field sensor ID' }
      },
      required: ['farmerId']
    }
  },
  {
    name: 'create_alert',
    description: 'Create a proactive field alert, schedule task, or high-priority warning for the farmer in Firestore.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        farmerId: { type: Type.STRING, description: 'Farmer ID' },
        alertType: { type: Type.STRING, description: 'Type of alert e.g. WEATHER_SPRAY_BLOCK, HIGH_SEVERITY_ALERT, HARVEST_READY' },
        message: { type: Type.STRING, description: 'Clear message for the farmer' },
        severity: { type: Type.STRING, description: 'Alert severity', enum: ['low', 'medium', 'high'] }
      },
      required: ['farmerId', 'alertType', 'message', 'severity']
    }
  },
  {
    name: 'request_human_review',
    description: 'Escalate to a human agricultural officer (Krishi Vigyan Kendra / KVK scientist) when diagnostic confidence is too low or severe multi-pathogen risk is detected.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        farmerId: { type: Type.STRING, description: 'Farmer identifier' },
        diagnosis: { type: Type.STRING, description: 'Suspected disease or ambiguous symptoms' },
        confidence: { type: Type.NUMBER, description: 'Current model confidence score (0.0 - 1.0)' },
        questionsForExpert: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Key questions requiring human agronomist verification' 
        }
      },
      required: ['farmerId', 'diagnosis', 'confidence']
    }
  },
  {
    name: 'search_fertilizer_rag',
    description: 'Query authoritative Indian fertilizer knowledge (FCO 1985, ICAR Package of Practices) for exact NPK ratios, crop suitability, application timing, and tank-mix safety warnings.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Farmer fertilizer query e.g. "Can I apply urea in arecanut?", "DAP zinc compatibility"' },
        crop: { type: Type.STRING, description: 'Crop name e.g. Arecanut, Tomato, Paddy' }
      },
      required: ['query']
    }
  },
  {
    name: 'check_fertilizer_compatibility',
    description: 'Verify chemical and biological tank-mix compatibility between two or more fertilizers or agrochemicals (e.g. Zinc Sulphate + DAP precipitate hazard).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fertilizerA: { type: Type.STRING, description: 'First input name e.g. Zinc Sulphate' },
        fertilizerB: { type: Type.STRING, description: 'Second input name e.g. DAP' }
      },
      required: ['fertilizerA', 'fertilizerB']
    }
  }
];
