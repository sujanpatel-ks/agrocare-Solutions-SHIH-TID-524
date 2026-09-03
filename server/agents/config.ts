// Centralized AgroCare Agent Configuration
export const AGROCARE_CONFIG = {
  // Escalation & Confidence Thresholds
  escalation: {
    defaultThreshold: 0.70, // >= 0.70 proceeds; < 0.70 triggers human expert escalation
    minAcceptableConfidence: 0.40, // < 0.40 is uncertain/rejection
    criticalSeverityConfidence: 0.80,
  },

  // Weather Gate Thresholds
  weather: {
    rainProbabilityBlockPercent: 50, // >= 50% blocks chemical spray
    rainVolumeBlockMm: 2.5, // >= 2.5mm blocks foliar spray
    windSpeedBlockKph: 20, // >= 20 km/h drift hazard
    highHumidityRiskPercent: 85, // >= 85% high humidity fungal spread / phytotoxicity
    treatmentSafeWindowHours: 8, // Requires min 8 hours of clear window
  },

  // Supplier Search Defaults
  suppliers: {
    defaultRadiusKm: 15,
    maxRadiusKm: 50,
    minVerifiedRequired: 1,
  },

  // Latency & Timeout Budgets (in ms)
  timeouts: {
    weatherApiMs: 4000,
    placesApiMs: 3500,
    geminiCallMs: 8000,
  },

  // Standard Expert KVK Centers
  kvkDirectory: {
    karnataka: {
      center: 'Krishi Vigyan Kendra (KVK), Hirehalli, Tumakuru - ICAR IIHR',
      phone: '+91 816-2243214',
      email: 'iihrkvk.tumakuru@icar.gov.in',
    },
    default: {
      center: 'National Farmer Kisan Call Center (KCC) - ICAR Government of India',
      phone: '1800-180-1551 (Toll Free)',
      email: 'agri-portal@gov.in',
    }
  }
};
