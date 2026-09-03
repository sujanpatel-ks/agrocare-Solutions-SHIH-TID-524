// AGENT 8: GOVERNMENT SCHEME SERVICE — Direct Agricultural Benefits & Subsidy Matching
import { SchemeMatchItem, FarmerProfileInput } from './types';

export interface SchemeDefinition {
  id: string;
  name: string;
  officialName: string;
  ministry: string;
  description: string;
  benefit: string;
  targetCrops: string[]; // empty means all crops
  maxLandAcres?: number;
  minLandAcres?: number;
  applicableStates: string[]; // empty means pan-India
  applicationUrl: string;
  sourceType: 'OFFICIAL_REGISTRY' | 'STATE_PORTAL';
}

export const CENTRAL_STATE_SCHEMES: SchemeDefinition[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    officialName: 'Pradhan Mantri Kisan Samman Nidhi',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    description: 'Direct cash benefit transfer of ₹6,000 annually provided in three equal 4-monthly installments.',
    benefit: '₹6,000 / year direct cash transfer',
    targetCrops: [],
    applicableStates: [],
    applicationUrl: 'https://pmkisan.gov.in',
    sourceType: 'OFFICIAL_REGISTRY'
  },
  {
    id: 'pmfby',
    name: 'PMFBY Crop Insurance',
    officialName: 'Pradhan Mantri Fasal Bima Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    description: 'Comprehensive financial protection against non-preventable natural risks, pests, and post-harvest losses.',
    benefit: 'Subsidized crop insurance (1.5% premium for Rabi, 2% for Kharif, 5% for Horticultural crops)',
    targetCrops: ['Tomato', 'Potato', 'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Chili'],
    applicableStates: [],
    applicationUrl: 'https://pmfby.gov.in',
    sourceType: 'OFFICIAL_REGISTRY'
  },
  {
    id: 'smam-subsidy',
    name: 'SMAM Farm Equipment Subsidy',
    officialName: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    ministry: 'Department of Agriculture & Farmers Welfare',
    description: 'Financial subsidy on purchasing precision battery knapsack sprayers, power sprayers, rotavators, and tools.',
    benefit: '40% to 50% capital subsidy on sprayers and farm machinery',
    targetCrops: [],
    maxLandAcres: 12,
    applicableStates: [],
    applicationUrl: 'https://agrimachinery.nic.in',
    sourceType: 'OFFICIAL_REGISTRY'
  },
  {
    id: 'pmksy-drip',
    name: 'PMKSY Micro-Irrigation',
    officialName: 'Pradhan Mantri Krishi Sinchayee Yojana (Per Drop More Crop)',
    ministry: 'Ministry of Jal Shakti & Ministry of Agriculture',
    description: 'Direct subsidy for installation of precision drip and sprinkler systems to optimize water and nutrient foliar delivery.',
    benefit: '45% to 55% subsidy on Drip/Sprinkler systems for small & marginal farmers',
    targetCrops: ['Tomato', 'Potato', 'Sugarcane', 'Cotton', 'Vegetables', 'Banana'],
    applicableStates: [],
    applicationUrl: 'https://pmksy.gov.in',
    sourceType: 'OFFICIAL_REGISTRY'
  },
  {
    id: 'pkvy-organic',
    name: 'PKVY Bio-Inputs & Organic Certification',
    officialName: 'Paramparagat Krishi Vikas Yojana',
    ministry: 'National Centre of Organic and Natural Farming (NCONF)',
    description: 'Cluster-based financial support for adoption of bio-fertilizers, bio-pesticides (Neem, Trichoderma), and PGS-India organic certification.',
    benefit: '₹50,000 per hectare financial assistance over 3 years for inputs and certification',
    targetCrops: [],
    applicableStates: [],
    applicationUrl: 'https://pgsindia-ncof.gov.in',
    sourceType: 'OFFICIAL_REGISTRY'
  },
  {
    id: 'raitha-siri-ka',
    name: 'Karnataka Raitha Siri & Krishi Bhagya',
    officialName: 'Karnataka State Department of Agriculture (KSDA) Incentive Scheme',
    ministry: 'Government of Karnataka',
    description: 'Direct financial incentive of ₹10,000 per hectare for growing millets, pulses, and organic horticulture crops in Karnataka.',
    benefit: '₹10,000 / hectare direct bank incentive + 80% farm pond subsidy',
    targetCrops: ['Millet', 'Ragi', 'Tomato', 'Vegetables', 'Pulses'],
    applicableStates: ['Karnataka'],
    applicationUrl: 'https://raitamitra.karnataka.gov.in',
    sourceType: 'STATE_PORTAL'
  }
];

/**
 * Matches eligible government schemes based on farmer profile, state, crop, and land size.
 */
export function matchEligibleSchemes(profile?: FarmerProfileInput): SchemeMatchItem[] {
  const farmerState = profile?.state?.toLowerCase() || 'karnataka';
  const farmerCrop = profile?.crop?.toLowerCase() || '';
  const landSize = profile?.landSize ?? 3;

  return CENTRAL_STATE_SCHEMES.map(scheme => {
    let eligible = true;
    const reasons: string[] = [];

    // State check
    if (scheme.applicableStates.length > 0) {
      const stateMatch = scheme.applicableStates.some(s => s.toLowerCase() === farmerState);
      if (!stateMatch) {
        eligible = false;
        reasons.push(`Restricted to ${scheme.applicableStates.join(', ')}`);
      } else {
        reasons.push(`Applicable for registered farmers in ${farmerState}`);
      }
    }

    // Land size check
    if (scheme.maxLandAcres && landSize > scheme.maxLandAcres) {
      eligible = false;
      reasons.push(`Land size (${landSize} acres) exceeds max threshold (${scheme.maxLandAcres} acres)`);
    }

    // Crop match
    if (scheme.targetCrops.length > 0 && farmerCrop) {
      const cropMatch = scheme.targetCrops.some(c => c.toLowerCase() === farmerCrop || farmerCrop.includes(c.toLowerCase()));
      if (cropMatch) {
        reasons.push(`Direct coverage for ${farmerCrop}`);
      }
    }

    if (eligible && reasons.length === 0) {
      reasons.push('Eligible for all agricultural landholding farmers');
    }

    return {
      id: scheme.id,
      name: scheme.name,
      officialName: scheme.officialName,
      ministry: scheme.ministry,
      benefit: scheme.benefit,
      eligibility: eligible,
      reason: reasons.join('. '),
      applicationUrl: scheme.applicationUrl,
      sourceType: scheme.sourceType
    };
  }).sort((a, b) => (b.eligibility ? 1 : 0) - (a.eligibility ? 1 : 0));
}

/**
 * Returns a specific scheme by ID.
 */
export function getSchemeById(id: string): SchemeDefinition | null {
  return CENTRAL_STATE_SCHEMES.find(s => s.id === id) || null;
}
