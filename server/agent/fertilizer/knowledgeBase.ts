import { FertilizerRecord, SourceRecord } from './types';

// Canonical Authoritative Agricultural Sources
export const AUTHORITATIVE_SOURCES: Record<string, SourceRecord> = {
  FCO_1985: {
    sourceId: 'SRC-FCO-1985',
    title: 'Fertiliser (Inorganic, Organic or Mixed) (Control) Order, 1985 & Standards Schedule',
    organization: 'Department of Agriculture and Farmers Welfare, Ministry of Agriculture, Govt. of India',
    sourceType: 'fertilizer_control_order',
    publishedDate: '1985-09-25',
    accessedDate: '2026-01-15',
    url: 'https://agricoop.nic.in/en/Fertilizer-Control-Order-1985',
    authorityLevel: 'official_statutory',
  },
  ICAR_ARECANUT: {
    sourceId: 'SRC-ICAR-CPCRI-2023',
    title: 'Package of Practices for Arecanut (Areca catechu L.) & Nutrient Management Manual',
    organization: 'ICAR - Central Plantation Crops Research Institute (CPCRI), Kasaragod',
    sourceType: 'icar_research',
    publishedDate: '2023-04-10',
    accessedDate: '2026-02-01',
    url: 'https://cpcri.icar.gov.in/crop-management/arecanut',
    authorityLevel: 'national_research',
  },
  UAS_BANGALORE_POP: {
    sourceId: 'SRC-UASB-POP-2024',
    title: 'Package of Practices for Horticultural and Plantation Crops - Southern Dry and Coastal Zones',
    organization: 'University of Agricultural Sciences (UAS), Bangalore & Directorate of Extension',
    sourceType: 'university_package_of_practices',
    publishedDate: '2024-06-18',
    accessedDate: '2026-01-20',
    url: 'https://uasbangalore.edu.in/extension/package-of-practices',
    authorityLevel: 'university_extension',
  },
  TNAU_AGRITECH: {
    sourceId: 'SRC-TNAU-AGRI-2024',
    title: 'TNAU Agritech Portal: Nutrient Management, Fertilizer Compatibility & Deficiency Diagnosis',
    organization: 'Tamil Nadu Agricultural University (TNAU), Coimbatore',
    sourceType: 'university_package_of_practices',
    publishedDate: '2024-03-12',
    accessedDate: '2026-02-10',
    url: 'https://agritech.tnau.ac.in/agriculture/agri_nutrientmgt.html',
    authorityLevel: 'university_extension',
  },
  ICAR_CRIDA_FERT: {
    sourceId: 'SRC-ICAR-CRIDA-2023',
    title: 'Soil Nutrient Management and Foliar Fertilization Guidelines in Dryland and Rainfed Farming',
    organization: 'ICAR - Central Research Institute for Dryland Agriculture (CRIDA), Hyderabad',
    sourceType: 'icar_research',
    publishedDate: '2023-11-05',
    accessedDate: '2026-02-12',
    url: 'https://crida.icar.gov.in/technical-bulletins/nutrient-management',
    authorityLevel: 'national_research',
  },
  ICAR_IARI_BIO: {
    sourceId: 'SRC-ICAR-IARI-2024',
    title: 'Biofertilizers & Microbial Inoculants: Standards, Application Protocols and Incompatibility Rules',
    organization: 'ICAR - Indian Agricultural Research Institute (IARI), Division of Microbiology, New Delhi',
    sourceType: 'icar_research',
    publishedDate: '2024-01-22',
    accessedDate: '2026-02-15',
    url: 'https://iari.res.in/biofertilizer-guidelines',
    authorityLevel: 'national_research',
  }
};

// Canonical Fertilizer Records
export const FERTILIZER_DATABASE: FertilizerRecord[] = [
  {
    fertilizerId: 'FERT-UREA',
    fertilizerName: 'Urea (Neem Coated Urea - NCU)',
    normalizedName: 'urea',
    aliases: ['urea', 'neem coated urea', 'ncu', 'white gold', 'यूरिया', 'ಯೂರಿಯಾ', 'யூரியா', 'యూరియా'],
    type: 'synthetic',
    category: 'Nitrogenous',
    fcoStandard: 'FCO 1985 Schedule I Part A: 46% Total Nitrogen (min), max 1.5% Biuret by weight, 0.035% to 0.040% Neem oil coating',
    nutrientContent: {
      N: 46,
      P: 0,
      K: 0
    },
    formulation: '46-0-0',
    physicalForm: 'Prilled / Granular (Neem Coated)',
    suitableCrops: ['Arecanut', 'Paddy / Rice', 'Wheat', 'Maize', 'Tomato', 'Sugarcane', 'Cotton', 'Potato', 'Coconut'],
    cropStages: ['Vegetative Stage', 'Early Growth', 'Active Tillering', 'Pre-Flowering Flush'],
    applicationMethods: ['Soil Incorporation', 'Basal Application (Split)', 'Top Dressing', 'Fertigation (via Drip)'],
    applicationTiming: [
      'Split into 2 to 3 applications rather than a single heavy dose.',
      'For Arecanut: Apply in 2 split doses — 1st split in May-June (pre-monsoon/onset) and 2nd split in September-October (post-monsoon) in the root basin 50-100 cm away from palm base.',
      'Apply when soil has adequate moisture; never apply to bone-dry soil or waterlogged standing water without drainage.'
    ],
    soilConsiderations: [
      'Acidic soils: Continuous heavy urea use can contribute to soil acidification; balance with dolomite or lime if soil pH < 5.5.',
      'Light sandy soils: Nitrogen leaches rapidly; split doses into 3-4 smaller applications.',
      'Incorporate into moist soil (3-5 cm depth) within 24 hours to minimize ammonia volatilization loss.'
    ],
    compatibility: [
      'Can be blended immediately before application with Muriate of Potash (MOP) and Di-Ammonium Phosphate (DAP) if dry.',
      'Compatible with well-decomposed Farmyard Manure (FYM) or Vermicompost in the basin.'
    ],
    incompatibility: [
      'DO NOT mix urea with Calcium Ammonium Nitrate (CAN) or unconditioned Superphosphate in advance due to hygroscopic caking and moisture absorption.',
      'DO NOT mix directly with basic slag or unhydrated lime (causes immediate ammonia gas volatilization).',
      'Foliar spray concentration of urea must NOT exceed 1.0% to 1.5% to avoid leaf scorch and biuret toxicity.'
    ],
    precautions: [
      'Always wash hands and wear gloves during handling.',
      'Keep away from livestock feed and drinking water sources.',
      'Avoid high doses during late flowering/fruit ripening stage to prevent excessive vegetative growth and flower drop.'
    ],
    storage: [
      'Store in sealed bags in a cool, dry, well-ventilated warehouse elevated on wooden pallets.',
      'Hygroscopic material — avoid exposure to atmospheric humidity.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT,
      AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP,
      AUTHORITATIVE_SOURCES.TNAU_AGRITECH
    ]
  },
  {
    fertilizerId: 'FERT-DAP',
    fertilizerName: 'Di-Ammonium Phosphate (DAP 18:46:0)',
    normalizedName: 'dap',
    aliases: ['dap', 'diammonium phosphate', '18:46:0', '18-46-0', 'डीएपी', 'ಡಿಎಪಿ', 'டிஏபி', 'డిఎపి'],
    type: 'synthetic',
    category: 'Phosphatic',
    fcoStandard: 'FCO 1985 Schedule I Part A: 18.0% Ammoniacal Nitrogen (min), 46.0% Total Phosphate (min), 41.0% Water Soluble Phosphate (min)',
    nutrientContent: {
      N: 18,
      P: 46,
      K: 0
    },
    formulation: '18-46-0',
    physicalForm: 'Granular (Grey/Brownish)',
    suitableCrops: ['Arecanut', 'Paddy', 'Wheat', 'Tomato', 'Potato', 'Pulses', 'Oilseeds', 'Cotton', 'Maize'],
    cropStages: ['Basal Sowing / Transplanting', 'Root Establishment Stage', 'Pre-Monsoon Basin Dressing'],
    applicationMethods: ['Basal Placement (Placement near root zone)', 'Soil Banding', 'Ring Basin Application for Palms'],
    applicationTiming: [
      'Best applied as a basal dressing at sowing or transplanting stage because Phosphorus moves very slowly in soil.',
      'For Arecanut: Apply in the first split during May-June (pre-monsoon) incorporated into the top 10-15 cm soil in the palm basin.'
    ],
    soilConsiderations: [
      'Phosphorus gets fixed in strongly acidic (pH < 5.5) or strongly alkaline (pH > 8.0) soils.',
      'Place fertilizer 5 cm below and 5 cm away from seeds/seedlings to promote strong root elongation.'
    ],
    compatibility: [
      'Can be mixed with Muriate of Potash (MOP) and Urea immediately prior to field application.',
      'Safe to apply alongside organic manures (FYM/vermicompost).'
    ],
    incompatibility: [
      'CRITICAL INCOMPATIBILITY: NEVER mix DAP with Zinc Sulphate (ZnSO4) or Iron Sulphate (FeSO4) in the same tank mix or fertilizer hopper! It forms insoluble, unavailable Zinc Phosphate precipitate.',
      'Do not mix DAP with agricultural lime or basic fertilizers (causes loss of ammoniacal nitrogen).'
    ],
    precautions: [
      'Do not apply directly touching young tender seeds/seedlings to avoid salt injury.',
      'Ensure proper soil moisture at time of application.'
    ],
    storage: [
      'Store in dry shed on wooden platforms away from damp walls.',
      'Protect from direct sunlight and rain.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT,
      AUTHORITATIVE_SOURCES.TNAU_AGRITECH
    ]
  },
  {
    fertilizerId: 'FERT-MOP',
    fertilizerName: 'Muriate of Potash (Potassium Chloride - MOP 0:0:60)',
    normalizedName: 'mop',
    aliases: ['mop', 'muriate of potash', 'potash', 'potassium chloride', 'kcl', '0:0:60', 'पोटाश', 'ಪೊಟ್ಯಾಶ್', 'பொட்டாஷ்', 'పొటాష్'],
    type: 'synthetic',
    category: 'Potassic',
    fcoStandard: 'FCO 1985 Schedule I Part A: 60.0% Water Soluble Potash as K2O (min), 3.5% Sodium as NaCl (max)',
    nutrientContent: {
      N: 0,
      P: 0,
      K: 60
    },
    formulation: '0-0-60',
    physicalForm: 'Crystalline Granular (Reddish Pink / White)',
    suitableCrops: ['Arecanut', 'Coconut', 'Paddy', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Banana', 'Tomato'],
    cropStages: ['Vegetative Stage', 'Flowering', 'Nut Setting / Fruit Development', 'Pre-Harvest Maturity'],
    applicationMethods: ['Soil Incorporation', 'Basal Application', 'Split Top Dressing', 'Basin Application'],
    applicationTiming: [
      'For Arecanut: Essential for nut retention, preventing premature nut fall, and building drought resistance. Applied in 2 split doses (May-June and September-October).',
      'Split application is recommended in high-rainfall and sandy loam coastal tracts to prevent potassium leaching.'
    ],
    soilConsiderations: [
      'Potassium enhances plant disease resistance, stalk strength, and water regulation (stomata opening).',
      'In heavy clay soils, basal application is retained well; in sandy soils, split dosing is mandatory.'
    ],
    compatibility: [
      'Compatible with Urea, DAP, and Single Super Phosphate (SSP) for dry blending and immediate field application.',
      'Compatible with organic composts.'
    ],
    incompatibility: [
      'CAUTION for Chlorine-sensitive crops: Not recommended for Tobacco, Grapes, or high-sugar crops (Sulphate of Potash SOP is preferred for those). Fully safe for Arecanut, Coconut, Paddy, and Field Crops.'
    ],
    precautions: [
      'Ensure uniform spreading across the root feeding zone (50-100 cm circular radius around palm trunk for arecanut).'
    ],
    storage: [
      'Store in dry moisture-proof bags.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT,
      AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP
    ]
  },
  {
    fertilizerId: 'FERT-NPK-19-19-19',
    fertilizerName: '100% Water Soluble NPK 19:19:19',
    normalizedName: 'npk_19_19_19',
    aliases: ['npk 19 19 19', '19:19:19', '19-19-19', 'balanced npk', 'polyfeed', 'water soluble npk', '19 19 19'],
    type: 'water_soluble',
    category: 'Complex NPK',
    fcoStandard: 'FCO 1985 100% Water Soluble Complex: Total N 19.0% (min), Water Soluble P2O5 19.0% (min), Water Soluble K2O 19.0% (min)',
    nutrientContent: {
      N: 19,
      P: 19,
      K: 19
    },
    formulation: '19-19-19',
    physicalForm: 'Fine Crystalline Powder (100% Water Soluble)',
    suitableCrops: ['Arecanut', 'Tomato', 'Chilli', 'Paddy', 'Potato', 'Vegetables', 'Floriculture', 'Cardamom', 'Pepper'],
    cropStages: ['Vegetative Stage', 'Active Growth', 'Branching / Tillering', 'Pre-Flowering'],
    applicationMethods: ['Drip Fertigation', 'Foliar Spray (0.5% to 1.0% concentration)', 'Drenching'],
    applicationTiming: [
      'Foliar spray: Best applied during early morning (6:30 AM – 9:30 AM) or late afternoon (4:00 PM – 6:00 PM) on clear days.',
      'Fertigation: Applied weekly or bi-weekly according to crop fertigation schedule.'
    ],
    soilConsiderations: [
      'Completely water soluble; provides immediate nutrient uptake through leaves and active roots without soil fixation issues.'
    ],
    compatibility: [
      'Compatible with most neutral pH micronutrient chelates (EDTA Zinc, EDTA Fe, Boron).',
      'Can be mixed with most non-alkaline insecticides and fungicides if jar-test shows no precipitation.'
    ],
    incompatibility: [
      'DO NOT mix in concentrated stock solution with Calcium Nitrate or unchelated Sulphates (risk of gypsum / calcium sulphate precipitation).',
      'Do not mix with alkaline sprays like Bordeaux mixture or Lime Sulphur.'
    ],
    precautions: [
      'Do not exceed recommended foliar concentration (max 5-10g per Liter of water / 0.5-1.0%) to prevent leaf tip burn.',
      'Avoid spraying during peak midday sunlight (>32°C) or strong winds.'
    ],
    storage: [
      'Reseal pack tightly after opening to prevent moisture absorption and caking.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.TNAU_AGRITECH,
      AUTHORITATIVE_SOURCES.ICAR_CRIDA_FERT
    ]
  },
  {
    fertilizerId: 'FERT-SSP',
    fertilizerName: 'Single Super Phosphate (SSP 0:16:0 + 11% S + 19% Ca)',
    normalizedName: 'ssp',
    aliases: ['ssp', 'single super phosphate', 'super phosphate', 'एसएसपी', 'ಎಸ್ ಎಸ್ ಪಿ'],
    type: 'synthetic',
    category: 'Phosphatic',
    fcoStandard: 'FCO 1985 Schedule I: 16.0% Water Soluble P2O5 (min), 11.0% Available Sulphur (min), 19.0% Calcium',
    nutrientContent: {
      N: 0,
      P: 16,
      K: 0,
      secondary: {
        S: 11,
        Ca: 19
      }
    },
    formulation: '0-16-0 + 11%S + 19%Ca',
    physicalForm: 'Granular / Powdered (Greyish)',
    suitableCrops: ['Groundnut', 'Soybean', 'Pulses', 'Paddy', 'Arecanut', 'Sunflower', 'Mustard', 'Vegetables'],
    cropStages: ['Basal Application at Sowing / Planting'],
    applicationMethods: ['Basal Soil Incorporation', 'Deep Banding in Root Zone'],
    applicationTiming: [
      'Apply at land preparation / basal dressing before sowing or transplanting.',
      'Ideal for oilseeds and pulse crops because the 11% Sulphur content significantly improves oil synthesis and protein content.'
    ],
    soilConsiderations: [
      'Excellent for neutral, alkaline, and slightly acidic soils; Calcium and Sulphur improve soil aggregate structure.'
    ],
    compatibility: [
      'Can be mixed with MOP and Urea at time of field application.',
      'Blends well with Farmyard Manure (FYM) which helps solubilize rock phosphate components.'
    ],
    incompatibility: [
      'Do not mix with Calcium Nitrate or unhydrated Lime.',
      'Do not mix with Zinc Sulphate in the same hopper.'
    ],
    precautions: [
      'Always incorporate into soil rather than leaving on surface.'
    ],
    storage: [
      'Keep away from moisture.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_CRIDA_FERT
    ]
  },
  {
    fertilizerId: 'FERT-ZINC-SULPHATE',
    fertilizerName: 'Zinc Sulphate Heptahydrate (ZnSO4.7H2O 21% Zn) & Monohydrate (33% Zn)',
    normalizedName: 'zinc_sulphate',
    aliases: ['zinc sulphate', 'zinc sulfate', 'znso4', 'zinc 21%', 'zinc 33%', 'जिंक सल्फेट', 'ಜಿಂಕ್ ಸಲ್ಫೇಟ್', 'துத்தநாக சல்பேட்'],
    type: 'micronutrient',
    category: 'Micronutrient',
    fcoStandard: 'FCO 1985 Schedule I Part A: 21.0% Zinc (min) & 10.0% Sulphur (min) for Heptahydrate; 33.0% Zinc (min) & 15.0% Sulphur for Monohydrate',
    nutrientContent: {
      N: 0,
      P: 0,
      K: 0,
      secondary: {
        S: 10
      },
      micronutrients: {
        Zn: 21
      }
    },
    formulation: 'Zn 21% + S 10%',
    physicalForm: 'White Crystalline Powder / Granules',
    suitableCrops: ['Paddy (Khaira Disease prevention)', 'Maize (White bud)', 'Arecanut', 'Tomato', 'Citrus (Little leaf)', 'Cotton', 'Wheat'],
    cropStages: ['Basal Soil Application', 'Early Vegetative Stage Foliar Spray on visual deficiency'],
    applicationMethods: ['Soil Broadcasting with Sand/Soil (Basal)', 'Foliar Spray (0.5% neutralized with Lime)'],
    applicationTiming: [
      'Basal application: Apply once every 2-3 crop seasons (10-25 kg/ha based on Soil Health Card).',
      'Foliar spray for deficiency correction: 5g Zinc Sulphate + 2.5g Agricultural Lime per Liter of water.'
    ],
    soilConsiderations: [
      'Zinc deficiency is widespread in high-pH calcareous soils, waterlogged intensive paddy soils, and heavily phosphate-fertilized soils.'
    ],
    compatibility: [
      'Can be applied mixed with dry sand, dry compost, or urea at time of soil application.',
      'Chelated Zinc (Zinc EDTA 12%) is compatible with water soluble NPK foliar sprays.'
    ],
    incompatibility: [
      'CRITICAL INCOMPATIBILITY: NEVER mix Zinc Sulphate directly with Di-Ammonium Phosphate (DAP), SSP, or any high-phosphate fertilizer in the spray tank or soil mix! Zinc and Phosphate react immediately to form insoluble Zinc Phosphate (Zn3(PO4)2), causing BOTH nutrients to become completely locked and unavailable to plants.',
      'Maintain at least 7 to 10 days gap between soil application of phosphatic fertilizers and zinc sulphate if applied separately.'
    ],
    precautions: [
      'When spraying unchelated Zinc Sulphate on foliage, ALWAYS neutralize with half-quantity slaked lime / calcium carbonate (e.g. 5g ZnSO4 + 2.5g Lime/L) to prevent leaf burning.'
    ],
    storage: [
      'Store in sealed moisture-proof bags away from moisture.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.TNAU_AGRITECH,
      AUTHORITATIVE_SOURCES.ICAR_CRIDA_FERT
    ]
  },
  {
    fertilizerId: 'FERT-BORAX',
    fertilizerName: 'Boron Fertilizer (Borax 10.5% B / Di-Sodium Octaborate Solubor 20% B)',
    normalizedName: 'boron',
    aliases: ['boron', 'borax', 'solubor', 'disodium octaborate', 'suhaga', 'ಬೋರಾನ್', 'बोरोन', 'போரான்'],
    type: 'micronutrient',
    category: 'Micronutrient',
    fcoStandard: 'FCO 1985 Schedule I Part A: Borax 10.5% Boron (min); Di-Sodium Octaborate Tetrahydrate (Solubor) 20.0% Boron (min)',
    nutrientContent: {
      N: 0,
      P: 0,
      K: 0,
      micronutrients: {
        B: 20
      }
    },
    formulation: 'Boron 20% (Solubor) / 10.5% (Borax)',
    physicalForm: 'White Free-Flowing Fine Powder',
    suitableCrops: ['Arecanut (Crown choke & nut splitting prevention)', 'Tomato (Fruit cracking)', 'Cauliflower (Hollow stem)', 'Paddy', 'Mustard', 'Cotton', 'Coconut'],
    cropStages: ['Pre-Flowering', 'Flowering & Pollen Tube Elongation', 'Fruit / Nut Development'],
    applicationMethods: ['Foliar Spray (0.1% to 0.15% Solubor)', 'Soil Basin Application (Borax 20-25g per Arecanut palm per year)'],
    applicationTiming: [
      'For Arecanut: Apply 25g Borax per palm in basin once annually post-monsoon to prevent crown choke, stunted inflorescence, and premature nut cracking.',
      'Foliar spray: 1g to 1.5g Solubor (20% B) per Liter of water during flower bud emergence.'
    ],
    soilConsiderations: [
      'Boron is vital for calcium metabolism, pollen germination, pollen tube growth, and fruit set.',
      'High-rainfall leached laterite soils of Western Ghats / Coastal Karnataka are severely boron-deficient.'
    ],
    compatibility: [
      'Solubor (20% B) is compatible with most neutral water-soluble NPK fertilizers and mild fungicides.'
    ],
    incompatibility: [
      'Do not mix with alkaline solutions or heavy oil-based formulations.'
    ],
    precautions: [
      'CRITICAL SAFETY RANGE: The gap between Boron deficiency and Boron TOXICITY is extremely narrow. Never exceed 1.5g per Liter in foliar sprays or 25g/palm in soil basin application. Over-application causes leaf tip necrosis and leaf drop.'
    ],
    storage: [
      'Keep dry in airtight containers.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT,
      AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP
    ]
  },
  {
    fertilizerId: 'FERT-MAGNESIUM-SULPHATE',
    fertilizerName: 'Magnesium Sulphate (Epsom Salt - MgSO4 9.6% Mg, 12% S)',
    normalizedName: 'magnesium_sulphate',
    aliases: ['magnesium sulphate', 'epsom salt', 'mgso4', 'magnesium sulfate', 'मैग्नीशियम सल्फेट', 'ಮ್ಯಾಗ್ನೀಸಿಯಮ್ ಸಲ್ಫೇಟ್'],
    type: 'micronutrient',
    category: 'Secondary Nutrient',
    fcoStandard: 'FCO 1985 Schedule I Part A: 9.6% Magnesium as Mg (min), 12.0% Sulphur as S (min)',
    nutrientContent: {
      N: 0,
      P: 0,
      K: 0,
      secondary: {
        Mg: 9.6,
        S: 12.0
      }
    },
    formulation: 'Mg 9.6% + S 12%',
    physicalForm: 'White Needle Crystalline Powder',
    suitableCrops: ['Arecanut (Yellow Leaf Disease / Chlorosis mitigation)', 'Coconut', 'Tomato', 'Chilli', 'Ginger', 'Cardamom', 'Tea', 'Cotton'],
    cropStages: ['Vegetative & Active Photosynthesis Stage', 'Post-Monsoon Canopy Management'],
    applicationMethods: ['Soil Basin Application', 'Foliar Spray (1.0% to 2.0%)', 'Fertigation'],
    applicationTiming: [
      'For Arecanut: Essential in acidic laterite soils where Magnesium deficiency causes interveinal chlorosis (yellowing of older fronds while veins remain green). Apply 100g to 150g MgSO4 per palm per year in the basin.',
      'Foliar spray: 10g to 15g per Liter of water during morning hours.'
    ],
    soilConsiderations: [
      'Magnesium is the central atom of chlorophyll molecule; deficiency directly drops photosynthetic capacity.',
      'Heavy potassium application can suppress magnesium uptake (K:Mg antagonism); balance K and Mg inputs.'
    ],
    compatibility: [
      'Compatible with Urea, MOP, and Zinc Sulphate in soil applications.',
      'Can be foliar sprayed alongside micronutrient mixes.'
    ],
    incompatibility: [
      'Do not mix with concentrated Phosphate solutions (DAP/MAP) in stock tanks due to precipitation risk.'
    ],
    precautions: [
      'Always test soil pH before heavy application; in acidic soils, pair with Dolomite.'
    ],
    storage: [
      'Store in dry shed.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT,
      AUTHORITATIVE_SOURCES.UAS_BANGALORE_POP
    ]
  },
  {
    fertilizerId: 'FERT-NEEM-CAKE',
    fertilizerName: 'Neem Seed Cake / De-oiled Neem Cake (Organic Manure & Nitrification Inhibitor)',
    normalizedName: 'neem_cake',
    aliases: ['neem cake', 'neem seed cake', 'neem khali', 'de-oiled neem cake', 'नीम खली', 'ಬೇವಿನ ಹಿಂಡಿ', 'வேப்பம் புண்ணாக்கு', 'వేప పిండి'],
    type: 'organic',
    category: 'Organic Manure',
    fcoStandard: 'FCO 1985 Organic Fertilizer Schedule: Min 2.5-5.0% N, 1.0% P2O5, 1.5% K2O; Nimbin & Azadirachtin alkaloid active compounds',
    nutrientContent: {
      N: 4.5,
      P: 1.2,
      K: 1.5,
      organicMatterPercent: 65
    },
    formulation: '4.5-1.2-1.5 Organic',
    physicalForm: 'Flakes / Powder / Pellets',
    suitableCrops: ['Arecanut', 'Paddy', 'Tomato', 'Cardamom', 'Ginger', 'Turmeric', 'Coconut', 'Vegetables', 'Banana'],
    cropStages: ['Basal Dressing', 'Land Preparation', 'Basin Application for Palms'],
    applicationMethods: ['Soil Incorporation', 'Basin Application', 'Mixed with Chemical Fertilizers (Urea/DAP)'],
    applicationTiming: [
      'For Arecanut: Apply 1 to 2 kg neem cake per palm annually in the basin during May-June along with Farmyard Manure (FYM).',
      'Blended with Urea at 1:5 ratio (1 part Neem Cake : 5 parts Urea) 24 hours before application to coat urea and inhibit nitrifying bacteria (Nitrosomonas), reducing nitrogen loss by 25-30%.'
    ],
    soilConsiderations: [
      'Improves soil organic carbon, water holding capacity, and beneficial soil microbes.',
      'Acts as a natural bio-nematicide against root-knot nematodes and repels soil grubs/termites.'
    ],
    compatibility: [
      '100% compatible with all organic manures (vermicompost, FYM, jeevamrutha).',
      'Compatible with synthetic fertilizers (Urea, DAP, MOP, SSP).'
    ],
    incompatibility: [
      'None known. Excellent synergistic blending agent.'
    ],
    precautions: [
      'Ensure soil has adequate moisture after application to facilitate microbial decomposition.'
    ],
    storage: [
      'Store in dry well-ventilated area protected from rodents.'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT,
      AUTHORITATIVE_SOURCES.TNAU_AGRITECH
    ]
  },
  {
    fertilizerId: 'FERT-BIO-AZOTOBACTER-PSB',
    fertilizerName: 'Biofertilizers: Azotobacter / Azospirillum & Phosphate Solubilizing Bacteria (PSB)',
    normalizedName: 'biofertilizer',
    aliases: ['biofertilizer', 'azotobacter', 'azospirillum', 'psb', 'phosphate solubilizing bacteria', 'rhizobium', 'बायोफर्टिलाइजर', 'ಜೈವಿಕ ಗೊಬ್ಬರ'],
    type: 'bio_fertilizer',
    category: 'Bio-inoculant',
    fcoStandard: 'FCO 1985 Biofertilizer Schedule Part A: Viable microbial count min 1x10^8 CFU/g (carrier-based) or 1x10^8 CFU/ml (liquid); zero pathogenic contamination',
    nutrientContent: {
      N: 0,
      P: 0,
      K: 0,
      microbialCount: '1x10^8 CFU/g minimum'
    },
    formulation: 'Live Microbial Inoculant',
    physicalForm: 'Carrier Powder (Lignite/Charcoal) or Liquid Inoculant',
    suitableCrops: ['Arecanut', 'Paddy', 'Wheat', 'Tomato', 'Pulses', 'Sugarcane', 'Cotton', 'Maize', 'Vegetables'],
    cropStages: ['Seed Treatment', 'Seedling Root Dip', 'Soil Application with FYM', 'Post-Monsoon Basin Dressing'],
    applicationMethods: ['Soil Incorporation with FYM (50g per palm for Arecanut)', 'Seed Coating', 'Drip Fertigation (Liquid Formulation)'],
    applicationTiming: [
      'Apply with moist Farmyard Manure (FYM) or Vermicompost in early morning or late afternoon.',
      'For Arecanut: Apply 50g Azospirillum + 50g PSB + 50g Trichoderma per palm mixed with 5 kg FYM per palm annually.'
    ],
    soilConsiderations: [
      'Fixes 20-40 kg atmospheric Nitrogen/ha and secretes organic acids (gluconic/citric) to solubilize 30-50% of insoluble soil fixed phosphorus.',
      'Requires organic matter in soil (FYM/vermicompost) as food substrate to colonize active root rhizosphere.'
    ],
    compatibility: [
      'Fully compatible with Vermicompost, FYM, Jeevamrutha, Neem Cake, and VAM (Mycorrhiza).'
    ],
    incompatibility: [
      'CRITICAL BIO-INCOMPATIBILITY: NEVER mix Biofertilizers directly with Chemical Fungicides (e.g. Copper Oxychloride, Mancozeb, Carbendazim, Hexaconazole), Bactericides (Streptocycline), or concentrated chemical fertilizers!',
      'Maintain at least 10 to 14 days interval between chemical fungicide soil drenching and biofertilizer application.'
    ],
    precautions: [
      'Do not expose packets to direct sunlight or high temperatures (>35°C).',
      'Check expiration date (shelf life is 6 months for carrier-based, 12 months for liquid formulations).'
    ],
    storage: [
      'Store in a cool, dark, dry room at room temperature (<30°C).'
    ],
    sourceRecords: [
      AUTHORITATIVE_SOURCES.FCO_1985,
      AUTHORITATIVE_SOURCES.ICAR_IARI_BIO,
      AUTHORITATIVE_SOURCES.ICAR_ARECANUT
    ]
  }
];
