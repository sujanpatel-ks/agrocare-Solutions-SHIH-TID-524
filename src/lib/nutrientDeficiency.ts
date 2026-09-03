export interface NutrientDeficiency {
  id: string;
  nutrient: string;
  symbol: string;
  category: 'primary' | 'secondary' | 'micronutrient';
  nameHi: string;
  nameKn: string;
  affectedCrops: string[];
  keySymptoms: string[];
  leafLocation: 'older_leaves' | 'younger_leaves' | 'whole_plant' | 'fruits_buds';
  soilRiskFactors: string[];
  organicRemedy: {
    name: string;
    nameHi: string;
    dosage: string;
    method: string;
    timing: string;
    preparationNotes: string;
  };
  chemicalRemedy: {
    name: string;
    nameHi: string;
    dosage: string;
    method: string;
    timing: string;
    safetyNotes: string;
  };
  diagnosticTip: string;
}

export const NUTRIENT_DEFICIENCIES: NutrientDeficiency[] = [
  {
    id: 'nitrogen-deficiency',
    nutrient: 'Nitrogen Deficiency',
    symbol: 'N',
    category: 'primary',
    nameHi: 'नाइट्रोजन की कमी (Nitrogen Deficiency)',
    nameKn: 'ಸಾರಜನಕದ ಕೊರತೆ (Nitrogen Deficiency)',
    affectedCrops: ['Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Cotton', 'Sugarcane', 'Mustard'],
    keySymptoms: [
      'Uniform pale light green to general yellowing (chlorosis) starting on older lower leaves',
      'V-shaped yellowing starting at leaf tips and advancing along the midrib',
      'Stunted vegetative growth, thin spindly stems, and reduced tillering/branching',
      'Premature leaf senescence and dropping from bottom up'
    ],
    leafLocation: 'older_leaves',
    soilRiskFactors: ['Sandy low-organic soils', 'Heavy leaching from excessive rains/flooding', 'Waterlogged conditions causing denitrification'],
    organicRemedy: {
      name: 'Well-Rotted Vermicompost + Fermented Jeevamrutha Foliar Spray',
      nameHi: 'केंचुआ खाद (वर्मीकम्पोस्ट) + जीवामृत स्प्रे',
      dosage: 'Vermicompost @ 2-3 tons/acre soil application + 10% Jeevamrutha spray (20L/acre)',
      method: 'Soil side-dressing at base of plants followed by light watering, with bi-weekly foliar Jeevamrutha',
      timing: 'Apply at vegetative growth stage and active tillering/branching',
      preparationNotes: 'Enrich vermicompost with Azotobacter or Azospirillum bio-fertilizers @ 2kg/acre for enhanced biological nitrogen fixation.'
    },
    chemicalRemedy: {
      name: 'Neem-Coated Urea (46% N) / Ammonium Sulphate',
      nameHi: 'नीम लेपित यूरिया (46% N)',
      dosage: 'Soil: 40-50 kg/acre split into 2-3 doses; OR Foliar: 1-2% Urea spray (10-20 g/L water)',
      method: 'Top-dressing in moist soil after weeding, or fine foliar mist for instant leaf absorption',
      timing: 'Early morning or late afternoon when soil is adequately moist',
      safetyNotes: 'Never broadcast urea in dry cracked soil or standing deep floodwater to prevent ammonia volatilization losses.'
    },
    diagnosticTip: 'Chlorosis starts strictly on older lower leaves first because Nitrogen is highly mobile and remobilizes to younger growing tips.'
  },
  {
    id: 'phosphorus-deficiency',
    nutrient: 'Phosphorus Deficiency',
    symbol: 'P',
    category: 'primary',
    nameHi: 'फास्फोरस की कमी (Phosphorus Deficiency)',
    nameKn: 'ರಂಜಕದ ಕೊರತೆ (Phosphorus Deficiency)',
    affectedCrops: ['Maize', 'Wheat', 'Rice', 'Soybean', 'Chickpea', 'Tomato', 'Groundnut'],
    keySymptoms: [
      'Distinct dark green foliage with reddish-purple or bronze pigmentation on leaf margins and undersides',
      'Severely stunted root elongation and poor secondary feeder root development',
      'Delayed flowering, poor seed setting, and small shriveled grains/fruits',
      'Stems remain abnormally thin and erect'
    ],
    leafLocation: 'older_leaves',
    soilRiskFactors: ['Highly acidic soils (pH < 5.5) where P is fixed by iron/aluminium', 'Highly alkaline calcareous soils (pH > 7.8) with calcium fixation', 'Cold wet soils during sowing'],
    organicRemedy: {
      name: 'Steamed Bone Meal (18-20% P2O5) + Phosphate Solubilizing Bacteria (PSB)',
      nameHi: 'स्टीम्ड बोन मील + फास्फेट घुलनशील जीवाणु (PSB)',
      dosage: 'Bone meal @ 100-150 kg/acre + PSB bio-inoculant @ 2 kg/acre mixed in FYM',
      method: 'Basal soil placement directly into planting furrow/root zone',
      timing: 'Pre-sowing or at transplanting stage',
      preparationNotes: 'Mix PSB bio-fertilizer with 100kg moist farmyard manure for 7 days before applying to activate phosphorus mobilization.'
    },
    chemicalRemedy: {
      name: 'Di-Ammonium Phosphate (DAP 18:46:0) / Single Super Phosphate (SSP 16% P2O5)',
      nameHi: 'डीएपी (DAP 18:46:0) या सिंगल सुपर फास्फेट (SSP)',
      dosage: 'DAP @ 40-50 kg/acre OR SSP @ 100-125 kg/acre (basal placement)',
      method: 'Band placement 4-5 cm below and to the side of seed furrow',
      timing: 'Entire phosphorus dose must be applied as basal at sowing (P is immobile in soil)',
      safetyNotes: 'Do not broadcast P fertilizers on soil surface; place deep near root zone for root interception.'
    },
    diagnosticTip: 'Purplish anthocyanin accumulation on maize seedling leaves and tomato leaf undersides is the textbook indicator of P starvation.'
  },
  {
    id: 'potassium-deficiency',
    nutrient: 'Potassium Deficiency',
    symbol: 'K',
    category: 'primary',
    nameHi: 'पोटाश की कमी (Potassium Deficiency)',
    nameKn: 'ಪೊಟ್ಯಾಶ್ ಕೊರತೆ (Potassium Deficiency)',
    affectedCrops: ['Potato', 'Banana', 'Tomato', 'Sugarcane', 'Cotton', 'Paddy', 'Chilli'],
    keySymptoms: [
      'Marginal chlorosis turning into scorched, burnt-brown necrosis along the outer edges of older leaves ("edge scorch")',
      'Leaf tips curl downward or cup upward with necrosis spreading inward',
      'Weak lodging-prone stems, reduced drought tolerance, and poor disease resistance',
      'Uneven fruit ripening, poor sugar content, and hollow potato cores'
    ],
    leafLocation: 'older_leaves',
    soilRiskFactors: ['Light sandy soils with low cation exchange capacity (CEC)', 'Heavy soil magnesium/calcium competition'],
    organicRemedy: {
      name: 'Hardwood Biomass Ash + Fermented Banana Pseudostem Extract + Potash Mobilizing Bacteria (KMB)',
      nameHi: 'लकड़ी की छनी राख + केला तना अर्क + केएमबी जीवाणु',
      dosage: 'Wood ash @ 100-200 kg/acre OR KMB bio-fertilizer @ 2 kg/acre in 100kg compost',
      method: 'Broadcasting and shallow hoeing around plant root zone',
      timing: 'At vegetative and flowering stages',
      preparationNotes: 'Wood ash contains 5-7% natural bio-potash and raises soil pH beneficial for acidic soils.'
    },
    chemicalRemedy: {
      name: 'Muriate of Potash (MOP 60% K2O) / Potassium Nitrate (13:0:45) Foliar',
      nameHi: 'म्यूरिएट ऑफ पोटाश (MOP 60%) / पोटेशियम नाइट्रेट स्प्रे',
      dosage: 'Soil: MOP @ 25-35 kg/acre split into basal and top-dressing; Foliar: 13:0:45 @ 5-10 g/L (0.5-1%)',
      method: 'Soil application at active growth & fruit swelling, or foliar spray during boll/tuber/fruit expansion',
      timing: 'Apply half at planting, remaining half at tuber initiation or fruit set',
      safetyNotes: 'For chlorine-sensitive crops like potato and tobacco, use Sulphate of Potash (SOP 0:0:50) instead of MOP.'
    },
    diagnosticTip: 'Burnt "firing" along outer leaf margins of older leaves while center stays green indicates acute K shortage.'
  },
  {
    id: 'zinc-deficiency',
    nutrient: 'Zinc Deficiency (Khaira Disease)',
    symbol: 'Zn',
    category: 'micronutrient',
    nameHi: 'जिंक की कमी / खैरा रोग (Zinc Deficiency)',
    nameKn: 'ಸತುವಿನ ಕೊರತೆ / ಖೈರಾ ರೋಗ (Zinc Deficiency)',
    affectedCrops: ['Rice (Khaira disease)', 'Maize (White bud)', 'Wheat', 'Citrus (Little leaf)', 'Cotton'],
    keySymptoms: [
      'Rice: Rusty reddish-brown pigmentation/bronzing patches appearing on third leaf 2-3 weeks after transplanting (Khaira disease)',
      'Maize: Broad white/bleached bands on both sides of midrib on emerging young whorl leaves ("White Bud")',
      'Shortened internodes resulting in severely stunted rosetted "little leaf" appearance',
      'Delayed maturity and uneven flowering'
    ],
    leafLocation: 'younger_leaves',
    soilRiskFactors: ['High soil pH (> 7.5) calcareous sodic soils', 'Continuous submergence in intensive rice-wheat rotations', 'Excessive heavy phosphorus fertilization'],
    organicRemedy: {
      name: 'Zinc Enriched Farmyard Manure + Zinc Solubilizing Bio-Inoculant (ZSB)',
      nameHi: 'जिंक समृद्ध गोबर खाद + जिंक घुलनशील बायो-एजेंट (ZSB)',
      dosage: 'ZSB @ 2 kg/acre mixed with 200 kg decomposed FYM',
      method: 'Soil furrow incorporation prior to sowing/transplanting',
      timing: 'Basal application at land preparation',
      preparationNotes: 'ZSB produces organic gluconic acids that chelate insoluble soil zinc minerals into plant-absorbable Zn2+.'
    },
    chemicalRemedy: {
      name: 'Zinc Sulphate Heptahydrate (21% Zn) / Chelated Zinc EDTA (12% Zn)',
      nameHi: 'जिंक सल्फेट 21% / कीलेटेड जिंक EDTA 12%',
      dosage: 'Soil: ZnSO4 @ 10-15 kg/acre basal; OR Emergency Foliar: 5 g ZnSO4 + 2.5 g Slaked Lime per L water (or EDTA Zn @ 1 g/L)',
      method: 'Foliar spray with lime neutralizer to prevent leaf scorching',
      timing: 'Spray at 15-20 days after transplanting in paddy upon first rusty spotting',
      safetyNotes: 'Always mix slaked lime (quicklime) when spraying Zinc Sulphate heptahydrate to neutralize acidity.'
    },
    diagnosticTip: 'Paddy plants turning rusty reddish-brown within 15-20 days of transplanting that recovers after drainage/Zn spray is classic Khaira.'
  },
  {
    id: 'iron-deficiency',
    nutrient: 'Iron Deficiency (Iron Chlorosis)',
    symbol: 'Fe',
    category: 'micronutrient',
    nameHi: 'आयरन / लोहे की कमी (Iron Deficiency)',
    nameKn: 'ಕಬ್ಬಿಣದ ಕೊರತೆ (Iron Deficiency)',
    affectedCrops: ['Groundnut', 'Sugarcane', 'Citrus', 'Apple', 'Tomato', 'Soybean', 'Rose'],
    keySymptoms: [
      'Sharp interveinal chlorosis strictly on the youngest emerging leaves',
      'Leaf veins remain vividly dark green while the interveinal tissue turns pale yellow to ivory white',
      'In acute deficiency, entire young leaves turn completely bleached paper-white with necrotic brown tips',
      'Shoot dieback and failure of fruit set in orchard crops'
    ],
    leafLocation: 'younger_leaves',
    soilRiskFactors: ['High free calcium carbonate (> 5% CaCO3) in soil', 'High soil pH (> 8.0)', 'Waterlogged compacted soils with poor aeration'],
    organicRemedy: {
      name: 'Fermented Green Manure + Iron-Solubilizing Microbial Drench + Bio-Chelates',
      nameHi: 'हरी खाद (धैंचा/सनई) + बायो-आयरन ड्रेन्च',
      dosage: 'Incorporate Sesbania (Daincha) green manure @ 5 tons/acre + 500g citric acid bio-mix',
      method: 'Soil incorporation 3 weeks before planting',
      timing: 'Pre-sowing green manuring',
      preparationNotes: 'Decomposing green manure releases organic acids and natural siderophores that release immobilized iron.'
    },
    chemicalRemedy: {
      name: 'Ferrous Sulphate (FeSO4 19% Fe) + Citric Acid / Chelated Iron (Fe-EDDHA / Fe-EDTA 12%)',
      nameHi: 'फेरस सल्फेट 0.5% + साइट्रिक एसिड 0.1% या Fe-EDDHA',
      dosage: 'Foliar: 5 g FeSO4 + 1 g Citric Acid per L water (spray 200L/acre); OR Fe-EDDHA 6% @ 1-2 kg/acre soil for calcareous soils',
      method: 'Foliar mist spray directly on pale young leaves',
      timing: 'Apply in morning upon seeing young leaf whitening; repeat after 7-10 days',
      safetyNotes: 'Adding 1g citric acid per liter prevents iron precipitation into unavailable ferric hydroxide in the spray tank.'
    },
    diagnosticTip: 'Sharp dark green network of veins on ivory-white young leaves at the very top of the plant is diagnostic for Iron chlorosis.'
  },
  {
    id: 'magnesium-deficiency',
    nutrient: 'Magnesium Deficiency',
    symbol: 'Mg',
    category: 'secondary',
    nameHi: 'मैग्नीशियम की कमी (Magnesium Deficiency)',
    nameKn: 'ಮೆಗ್ನೀಸಿಯಮ್ ಕೊರತೆ (Magnesium Deficiency)',
    affectedCrops: ['Tomato', 'Cotton', 'Citrus', 'Coffee', 'Chilli', 'Grapes'],
    keySymptoms: [
      'Interveinal chlorosis on mature older leaves while main veins remain prominently green',
      'Cotton: Reddish-purple to bronze pigmentation in interveinal areas ("Red leaf disease of cotton")',
      'Leaf margins curl upward with inverted "V" green wedge at leaf base',
      'Brittle leaves that drop prematurely during heavy fruit load'
    ],
    leafLocation: 'older_leaves',
    soilRiskFactors: ['Acidic sandy leached soils (pH < 5.2)', 'Excessive high potassium or ammonium fertilization suppressing Mg uptake'],
    organicRemedy: {
      name: 'Dolomitic Limestone (MgCO3 + CaCO3) / Epsom Bio-Extract',
      nameHi: 'डोलोमाइट चूना + एप्सम बायो-घोल',
      dosage: 'Agricultural Dolomite @ 100-200 kg/acre broadcasted before monsoon',
      method: 'Soil incorporation during land preparation',
      timing: 'Basal application at plowing',
      preparationNotes: 'Dolomite corrects soil acidity and supplies both Calcium and Magnesium in balanced ratio.'
    },
    chemicalRemedy: {
      name: 'Magnesium Sulphate (Epsom Salt - 9.6% Mg, 12% S)',
      nameHi: 'मैग्नीशियम सल्फेट (एप्सम साल्ट) 1%',
      dosage: 'Soil: 10-15 kg/acre basal; Foliar: 10 g Magnesium Sulphate per L water (1% spray)',
      method: 'Foliar spray targeting older and middle canopy leaves',
      timing: 'Apply at fruit development and heavy boll formation stages',
      safetyNotes: 'Compatible with most fungicides; spray during cool morning hours.'
    },
    diagnosticTip: 'Magnesium is the central atom of the chlorophyll molecule; its deficiency causes older leaves to bleach between veins while veins remain green.'
  },
  {
    id: 'calcium-deficiency',
    nutrient: 'Calcium Deficiency (Blossom End Rot / Tip Burn)',
    symbol: 'Ca',
    category: 'secondary',
    nameHi: 'कैल्शियम की कमी / ब्लॉसम एंड रॉट (Calcium Deficiency)',
    nameKn: 'ಕ್ಯಾಲ್ಸಿಯಂ ಕೊರತೆ (Calcium Deficiency)',
    affectedCrops: ['Tomato (Blossom End Rot)', 'Capsicum / Pepper', 'Cabbage (Tip burn)', 'Groundnut (Pops)', 'Apple (Bitter pit)'],
    keySymptoms: [
      'Tomato / Pepper: Water-soaked sunken dark brown to black leathery rot on the blossom end (bottom) of fruit',
      'Cabbage / Lettuce: Browning and death of inner leaf margins ("Tipburn")',
      'Groundnut: Empty shell pods with no kernels inside ("Pops")',
      'Growing tips and young shoot meristems hook downward and die'
    ],
    leafLocation: 'fruits_buds',
    soilRiskFactors: ['Irregular erratic watering cycles (drought followed by flood)', 'High nitrogen and potassium competition', 'Acidic soils with low base saturation'],
    organicRemedy: {
      name: 'Eggshell Bio-Calcium Vinegar Extract + Slaked Lime (Chuna) Soil Conditioning',
      nameHi: 'अंडे के छिलके का सिरका अर्क + बुझा चूना',
      dosage: 'Water-soluble Calcium (WSCa) from crushed eggshells @ 5 ml/L foliar + Chuna 50 kg/acre soil',
      method: 'Foliar spray on young flower clusters and developing fruitlets',
      timing: 'Start at early flowering and continue until fruit set',
      preparationNotes: 'Roast clean eggshells lightly and dissolve in natural vinegar (1:10 ratio) for 7 days to create fast-acting soluble calcium acetate.'
    },
    chemicalRemedy: {
      name: 'Calcium Nitrate (18.8% Ca, 15.5% N) / Chelated Calcium EDTA',
      nameHi: 'कैल्शियम नाइट्रेट (18.8% Ca) स्प्रे',
      dosage: 'Foliar: 5 g Calcium Nitrate per L water (spray 200L/acre); OR Soil drench: 10 kg/acre through drip irrigation',
      method: 'Targeted spray onto developing fruits, flowers, and young shoots',
      timing: 'Apply at 10-day intervals from flowering to harvest',
      safetyNotes: 'Do not mix Calcium Nitrate with phosphates or sulphates in concentrated stock tanks to prevent insoluble gypsum precipitation.'
    },
    diagnosticTip: 'Black sunken bottom on green/ripening tomato fruit with healthy green upper plant is guaranteed Calcium translocation deficiency.'
  },
  {
    id: 'boron-deficiency',
    nutrient: 'Boron Deficiency (Fruit Cracking / Hollow Stem)',
    symbol: 'B',
    category: 'micronutrient',
    nameHi: 'बोरॉन की कमी / फल फटना (Boron Deficiency)',
    nameKn: 'ಬೋರಾನ್ ಕೊರತೆ / ಹಣ್ಣು ಬಿರಿಯುವಿಕೆ (Boron Deficiency)',
    affectedCrops: ['Pomegranate', 'Tomato', 'Cauliflower (Browning)', 'Papaya', 'Mustard', 'Sunflower'],
    keySymptoms: [
      'Severe radial and concentric fruit cracking / splitting with rough brown corky rind',
      'Cauliflower: Water-soaked brown curds and hollow brown-lined stems ("Brown rot / Hollow stem")',
      'Sunflower: Chaffy seed heads with empty unfilled central seeds',
      'Brittle distorted terminal shoot tips that curl and die back'
    ],
    leafLocation: 'fruits_buds',
    soilRiskFactors: ['High soil pH (> 7.5) and dry drought periods', 'Leached sandy soils low in organic matter'],
    organicRemedy: {
      name: 'Borax Enriched Compost + Fermented Seaweed Kelp Extract',
      nameHi: 'बोरेक्स समृद्ध कम्पोस्ट + समुद्री शैवाल अर्क',
      dosage: 'Borax @ 2 kg/acre thoroughly blended in 100 kg compost + 2 ml/L Seaweed spray',
      method: 'Basal soil broadcasting & foliar seaweed application during budding',
      timing: 'Before sowing/planting and at flower bud emergence',
      preparationNotes: 'Seaweed kelp contains natural polyols (mannitol) that enhance boron complexation and phloem mobility.'
    },
    chemicalRemedy: {
      name: 'Disodium Octaborate Tetrahydrate (Solubor 20% B) / Borax (10.5% B)',
      nameHi: 'घुलनशील बोरॉन (सॉलीबोर 20% B)',
      dosage: 'Foliar: 1-1.5 g Solubor per L water (200-300 g/acre); OR Soil: Borax @ 4-5 kg/acre basal',
      method: 'Foliar spray at pre-flowering and fruit development stages',
      timing: 'Early morning spray on flower panicles and young fruits',
      safetyNotes: 'Boron has a very narrow safety margin. Do NOT exceed 2 g/L to prevent boron toxicity (leaf tip scorch).'
    },
    diagnosticTip: 'Splitting fruits on pomegranate/tomato and hollow brownish cavities inside cauliflower stems indicates severe Boron shortage.'
  }
];

export function detectNutrientDeficiencyFromSymptoms(symptoms: string[], crop?: string): NutrientDeficiency | null {
  const text = symptoms.join(' ').toLowerCase();
  
  if (text.includes('nitrogen') || (text.includes('yellow') && text.includes('older') && text.includes('v-shaped'))) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'nitrogen-deficiency') || null;
  }
  if (text.includes('phosphorus') || text.includes('purple') || text.includes('bronze') || text.includes('anthocyanin')) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'phosphorus-deficiency') || null;
  }
  if (text.includes('potassium') || text.includes('potash') || text.includes('scorch') || text.includes('burnt edge') || text.includes('firing')) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'potassium-deficiency') || null;
  }
  if (text.includes('zinc') || text.includes('khaira') || text.includes('white bud') || text.includes('little leaf')) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'zinc-deficiency') || null;
  }
  if (text.includes('iron') || (text.includes('interveinal') && text.includes('young') && text.includes('white'))) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'iron-deficiency') || null;
  }
  if (text.includes('magnesium') || (text.includes('interveinal') && text.includes('older')) || text.includes('red leaf')) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'magnesium-deficiency') || null;
  }
  if (text.includes('calcium') || text.includes('blossom end') || text.includes('tip burn') || text.includes('pops')) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'calcium-deficiency') || null;
  }
  if (text.includes('boron') || text.includes('cracking') || text.includes('hollow stem') || text.includes('splitting')) {
    return NUTRIENT_DEFICIENCIES.find(n => n.id === 'boron-deficiency') || null;
  }
  
  return null;
}

export function getNutrientDeficiencyById(id: string): NutrientDeficiency | undefined {
  return NUTRIENT_DEFICIENCIES.find(n => n.id === id || n.symbol.toLowerCase() === id.toLowerCase());
}
