export interface DiseaseEntry {
  id: string;
  name: string;
  nameHi: string;
  nameKn: string;
  scientificName: string;
  affectedCrops: string[];
  category: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'nutrient_deficiency' | 'physiological';
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  symptoms: string[];
  symptomsHi?: string[];
  symptomsKn?: string[];
  differentialDiagnosis?: string;
  organicTreatment: {
    name: string;
    nameHi: string;
    nameKn: string;
    formulation: string;
    applicationRate: string;
    method: string;
    timing: string;
    withholdingPeriod: string;
    costEstimate: string;
    itkSource?: string;
    modeOfAction: string;
    safetyPrecautions: string;
  };
  chemicalTreatment: {
    name: string;
    nameHi: string;
    nameKn: string;
    activeIngredient: string;
    applicationRate: string;
    method: string;
    frequency: string;
    withholdingPeriod: string;
    costEstimate: string;
    modeOfAction: string;
    safetyPrecautions: string;
  };
  prevention: {
    immediate: string[];
    longTerm: string[];
  };
  weatherSensitivity: {
    highHumidityRisk: boolean;
    rainWashoutRisk: boolean;
    optimalTempRange: string;
    sprayConditions: string;
  };
}

export const DISEASE_DATABASE: DiseaseEntry[] = [
  {
    id: 'late-blight',
    name: 'Late Blight',
    nameHi: 'पछेती झुलसा (Late Blight)',
    nameKn: 'ತಡವಾದ ಅಂಗಮಾರಿ ರೋಗ (Late Blight)',
    scientificName: 'Phytophthora infestans',
    affectedCrops: ['Potato', 'Tomato', 'Eggplant'],
    category: 'fungal',
    severity: 'Severe',
    symptoms: [
      'Water-soaked dark green/brown lesions starting from leaf tips and margins',
      'White cottony fungal mildew on leaf undersides in high humidity',
      'Rapid brown necrosis spreading to petioles and stems',
      'Foul-smelling dark rotting of potato tubers / tomato fruit'
    ],
    differentialDiagnosis: 'Unlike Early Blight which produces concentric target rings, Late Blight has irregular water-soaked spots with white fuzzy mold on underside.',
    organicTreatment: {
      name: 'Bordeaux Mixture (1%) / Copper Hydroxide Bio-Spray',
      nameHi: 'बोर्डो मिश्रण (1%) या कॉपर हाइड्रोक्साइड बायो-स्प्रे',
      nameKn: 'ಬೋರ್ಡೋ ದ್ರಾವಣ (1%) / ತಾಮ್ರದ ಜೈವಿಕ ಸಿಂಪಡಣೆ',
      formulation: 'Copper Sulphate 1kg + Quick Lime 1kg + 100L Water',
      applicationRate: '1000 L/ha (400 L/acre)',
      method: 'Foliar spray ensuring complete coverage of leaf undersides',
      timing: 'Apply early morning before dew dries or late evening',
      withholdingPeriod: '1 day',
      costEstimate: '₹ 280 - ₹ 350 / acre',
      itkSource: 'ICAR ITK Bulletin #14: Fermented butter-milk (chaas) 5L + 100L water spray acts as natural bio-fungicide against oomycetes.',
      modeOfAction: 'Copper ions disrupt fungal enzyme systems and prevent spore germination.',
      safetyPrecautions: 'Wear eye protection. Avoid metallic containers when mixing copper sulphate.'
    },
    chemicalTreatment: {
      name: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ)',
      nameHi: 'मेटालेक्सिल 8% + मैंकोज़ेब 64% डब्ल्यूपी',
      nameKn: 'ಮೆಟಾಲಾಕ್ಸಿಲ್ + ಮ್ಯಾಂಕೋಜೆಬ್ ಕೀಟನಾಶಕ',
      activeIngredient: 'Metalaxyl 8% + Mancozeb 64% WP',
      applicationRate: '2.5 g / L water (500 g / acre in 200L water)',
      method: 'High-volume knapsack foliar spray',
      frequency: '2 sprays at 10-12 days interval on symptom appearance',
      withholdingPeriod: '14 days before harvest',
      costEstimate: '₹ 450 - ₹ 550 / acre',
      modeOfAction: 'Systemic (Metalaxyl) inhibits ribosomal RNA synthesis; contact (Mancozeb) disrupts multi-site enzyme activity.',
      safetyPrecautions: 'Use protective mask and nitrile gloves. Do not allow livestock grazing for 14 days.'
    },
    prevention: {
      immediate: ['Rogue out and bury or burn heavily infected plants immediately', 'Cease overhead sprinkler irrigation to keep canopy dry'],
      longTerm: ['Use certified disease-free seed tubers (e.g., Kufri Girdhari)', 'Maintain 3-year crop rotation with non-solanaceous crops']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '12°C - 22°C with RH > 85%',
      sprayConditions: 'Never spray within 24 hours of anticipated rain.'
    }
  },
  {
    id: 'early-blight',
    name: 'Early Blight',
    nameHi: 'अगेती झुलसा (Early Blight)',
    nameKn: 'ಮುಂಚಿನ ಅಂಗಮಾರಿ ರೋಗ (Early Blight)',
    scientificName: 'Alternaria solani',
    affectedCrops: ['Tomato', 'Potato', 'Chilli', 'Eggplant'],
    category: 'fungal',
    severity: 'Medium',
    symptoms: [
      'Concentric dark brown rings forming a distinctive "target board" pattern on older leaves',
      'Yellow chlorotic halos surrounding brown spots',
      'Premature defoliation of lower leaves moving upward',
      'Dark sunken leathery cankers on stems and fruit calyx'
    ],
    differentialDiagnosis: 'Target-like concentric rings on older lower leaves differentiate it from Late Blight and Septoria leaf spot.',
    organicTreatment: {
      name: 'Neem Kernel Extract 5% + Trichoderma viride Foliar Spray',
      nameHi: 'नीम बीज अर्क 5% + ट्राइकोडर्मा विरिडे',
      nameKn: 'ಬೇವಿನ ಬೀಜದ ಕಷಾಯ 5% + ಟ್ರೈಕೋಡರ್ಮಾ',
      formulation: '50g neem seed powder per L + Trichoderma 5g/L',
      applicationRate: '3-5 kg neem seed extract per acre (200L water)',
      method: 'Thorough spray covering both upper and lower leaf surfaces',
      timing: 'Apply at first sign of lower leaf spotting in early morning',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 220 - ₹ 300 / acre',
      itkSource: 'ICAR ITK Vol 2: Cow urine (10%) + Fermented Asafoetida (Hing 50g) spray inhibits Alternaria spore germination.',
      modeOfAction: 'Azadirachtin and Trichoderma bio-antagonism suppress fungal mycelial penetration.',
      safetyPrecautions: 'Filter solution thoroughly through muslin cloth to prevent nozzle clogging.'
    },
    chemicalTreatment: {
      name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
      nameHi: 'एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल',
      nameKn: 'ಅಜಾಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ + ಡೈಫೆನೊಕೊನಾಜೋಲ್',
      activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
      applicationRate: '1 ml / L water (200 ml / acre)',
      method: 'Fine mist foliar spray with flat fan nozzle',
      frequency: 'Repeat after 12-15 days if conditions persist',
      withholdingPeriod: '5 days for tomato',
      costEstimate: '₹ 580 - ₹ 700 / acre',
      modeOfAction: 'Inhibits fungal mitochondrial respiration and ergosterol biosynthesis.',
      safetyPrecautions: 'Do not spray during peak pollinator foraging hours (mid-day).'
    },
    prevention: {
      immediate: ['Prune lowest 12 inches of foliage touching soil to eliminate splash inoculum', 'Mulch soil with clean straw'],
      longTerm: ['Drip irrigation instead of flood irrigation', 'Destroy crop residue post-harvest']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '24°C - 30°C with alternating wet/dry cycles',
      sprayConditions: 'Apply when foliage is dry; ensure 3 hours drying time.'
    }
  },
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    nameHi: 'धान का झोंका रोग (Rice Blast)',
    nameKn: 'ಭತ್ತದ ಕುತ್ತಿಗೆ ಬೆಂಕಿ ರೋಗ (Rice Blast)',
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    affectedCrops: ['Rice', 'Paddy', 'Finger Millet (Ragi)', 'Wheat'],
    category: 'fungal',
    severity: 'Severe',
    symptoms: [
      'Spindle/diamond-shaped lesions with grey or whitish centers and reddish-brown margins',
      'Nodes turn blackish-brown and break easily (Nodal Blast)',
      'Panicle neck turns dark brown with incomplete grain filling (Neck Blast / Rotten Neck)',
      'Severe lodging of paddy tillers'
    ],
    differentialDiagnosis: 'Diamond/eye-shaped lesions on leaves and black rot at panicle neck differentiate it from Brown Spot.',
    organicTreatment: {
      name: 'Vitex negundo (Nirgundi) Leaf Extract + Pseudomonas fluorescens',
      nameHi: 'निर्गुंडी पत्ती अर्क 10% + स्यूडोमोनास फ्लोरेसेन्स',
      nameKn: 'ಲಕ್ಕಿ ಗಿಡದ ಕಷಾಯ + ಸೂಡೋಮೊನಾಸ್',
      formulation: '10kg fresh Vitex leaves crushed in 100L water + 1kg Pseudomonas',
      applicationRate: '2.5 kg Pseudomonas / ha as foliar spray in 500L water',
      method: 'Foliar spray during tillering and panicle emergence stages',
      timing: 'Late afternoon spray (4 PM onwards)',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 250 - ₹ 320 / acre',
      itkSource: 'ICAR National Research Centre on Rice: 10% boiled Vitex negundo leaf extract provides 74% blast mycelium inhibition.',
      modeOfAction: 'Phenolic secondary metabolites disrupt fungal cell walls; Pseudomonas produces antifungal phenazines.',
      safetyPrecautions: 'Store bio-agent in cool shade; do not mix with chemical copper or bactericides.'
    },
    chemicalTreatment: {
      name: 'Tricyclazole 75% WP (Beam / Baan)',
      nameHi: 'ट्राइसाइक्लाज़ोल 75% डब्ल्यूपी',
      nameKn: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% ಡಬ್ಲ್ಯೂಪಿ',
      activeIngredient: 'Tricyclazole 75% WP',
      applicationRate: '0.6 g / L water (120 g / acre in 200L water)',
      method: 'Foliar spray at boot leaf stage and 10% panicle emergence',
      frequency: '1-2 sprays depending on neck blast severity',
      withholdingPeriod: '21 days',
      costEstimate: '₹ 420 - ₹ 500 / acre',
      modeOfAction: 'Specific melanin biosynthesis inhibitor (MBI) preventing appressorium penetration into leaf epidermis.',
      safetyPrecautions: 'Wear full protective gear. Avoid spraying against wind direction.'
    },
    prevention: {
      immediate: ['Drain standing water for 2 days to reduce humidity', 'Avoid excess split doses of Nitrogenous fertilizers'],
      longTerm: ['Seed treatment with Pseudomonas @ 10g/kg seed', 'Cultivate blast-tolerant varieties like IR-64, Sahbhagi Dhan']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '20°C - 28°C with night dew > 10 hours',
      sprayConditions: 'Spray immediately upon noticing diamond spots; systemic action resists moderate rain after 2 hours.'
    }
  },
  {
    id: 'bacterial-leaf-blight',
    name: 'Bacterial Leaf Blight (BLB)',
    nameHi: 'धान का जीवाणु झुलसा (Bacterial Leaf Blight)',
    nameKn: 'ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಎಲೆ ರೋಗ (BLB)',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    affectedCrops: ['Rice', 'Paddy'],
    category: 'bacterial',
    severity: 'High',
    symptoms: [
      'Water-soaked to yellowish-green wavy stripes starting from leaf tips and margins',
      'Lesions turn straw-yellow or bleached white as leaves dry up',
      'Milky bacterial ooze drops visible on young lesions in early morning',
      'Kresek stage: Complete wilting and death of young seedlings within 3-4 weeks of transplanting'
    ],
    differentialDiagnosis: 'Wavy translucent margins with bacterial oozing distinguishes BLB from fungal blast and physiological drying.',
    organicTreatment: {
      name: 'Fresh Cow Dung Slurry Supernatant (20%) + Bleaching Powder',
      nameHi: 'गोबर का निथरा हुआ घोल 20% + ब्लीचिंग पाउडर 5 ग्राम/लीटर',
      nameKn: 'ಹಸುವಿನ ಸಗಣಿ ತಿಳಿ ನೀರು + ಬ್ಲೀಚಿಂಗ್ ಪೌಡರ್',
      formulation: '20kg fresh cow dung mixed in 100L water, filtered through muslin cloth',
      applicationRate: '200 L / acre',
      method: 'Foliar spray in late morning',
      timing: 'Apply at first detection of wavy edge chlorosis',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 120 - ₹ 180 / acre',
      itkSource: 'ICAR ITK Documentation #08: Supernatant of fresh cow dung slurry contains antagonistic Bacillus & Pseudomonas strains reducing bacterial blight by 62%.',
      modeOfAction: 'Competitive bio-exclusion and bacteriocin production suppressing Xanthomonas.',
      safetyPrecautions: 'Ensure double filtration to avoid nozzle blockages in sprayers.'
    },
    chemicalTreatment: {
      name: 'Streptocycline 90:10 (Streptomycin Sulphate + Tetracycline) + Copper Oxychloride',
      nameHi: 'स्ट्रेप्टोसाइक्लिन + कॉपर ऑक्सीक्लोराइड',
      nameKn: 'ಸ್ಟ್ರೆಪ್ಟೋಸೈಕ್ಲಿನ್ + ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್',
      activeIngredient: 'Streptomycin sulphate 90% + Tetracycline hydrochloride 10% (6g) + COC 50% WP (500g)',
      applicationRate: '6 g Streptocycline + 500 g COC in 200 L water per acre',
      method: 'Fine spray targeting leaves and collar regions',
      frequency: 'Two sprays at 10-day intervals',
      withholdingPeriod: '15 days',
      costEstimate: '₹ 380 - ₹ 460 / acre',
      modeOfAction: 'Bactericidal antibiotic inhibits bacterial 30S ribosomal protein synthesis; copper denatures cell proteins.',
      safetyPrecautions: 'Wear gloves and mask. Avoid skin and eye contact.'
    },
    prevention: {
      immediate: ['Stop top-dressing of urea/nitrogen immediately', 'Maintain optimal field drainage'],
      longTerm: ['Balanced NPK application (follow 100:50:50 ratio with split potash application)', 'Hot water seed treatment at 52°C-54°C for 10 min']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '25°C - 34°C during monsoon storms and strong winds',
      sprayConditions: 'Do not spray when plants are mechanically injured by high winds; wait for dry spell.'
    }
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    nameHi: 'छाछिया / चूर्णिल आसिता (Powdery Mildew)',
    nameKn: 'ಬೂದಿ ರೋಗ (Powdery Mildew)',
    scientificName: 'Erysiphe cichoracearum / Leveillula taurica',
    affectedCrops: ['Chilli', 'Tomato', 'Pea', 'Cucurbits', 'Mango', 'Mustard', 'Grapes'],
    category: 'fungal',
    severity: 'Medium',
    symptoms: [
      'White to greyish powdery talc-like patches on upper and lower leaf surfaces',
      'Leaves curl upward, turn chlorotic yellow and prematurely drop',
      'Distorted young shoots and buds coated in white mycelium',
      'Stunted flowering and shriveled fruit development'
    ],
    differentialDiagnosis: 'Superficial white powdery coating easily wiped off with finger distinguishes Powdery Mildew from Downy Mildew.',
    organicTreatment: {
      name: 'Sour Buttermilk (Chaas 5%) + Wettable Sulphur (Bio-Grade) / Milk Spray',
      nameHi: 'खट्टी छाछ (5%) + जैविक सल्फर या दूध का छिड़काव',
      nameKn: 'ಹುಳಿ ಮಜ್ಜಿಗೆ (5%) + ಜೈವಿಕ ಗಂಧಕ ಸಿಂಪಡಣೆ',
      formulation: '5L fermented sour buttermilk + 100L water + 200g bio-wettable sulphur',
      applicationRate: '200 L / acre',
      method: 'Foliar mist covering both foliage sides thoroughly',
      timing: 'Apply in morning when temperatures are below 30°C',
      withholdingPeriod: '1 day',
      costEstimate: '₹ 180 - ₹ 260 / acre',
      itkSource: 'ICAR ITK Compendium: Lactic acid in fermented buttermilk creates an acidic surface pH that degrades powdery mildew mycelial walls.',
      modeOfAction: 'Lactic acid and sulfur vapor disrupt fungal respiratory electron transport.',
      safetyPrecautions: 'Do not apply sulphur formulations if ambient temperature exceeds 35°C (risk of phytotoxicity).'
    },
    chemicalTreatment: {
      name: 'Hexaconazole 5% SC / Penconazole 10% EC',
      nameHi: 'हेक्साकोनाज़ोल 5% एससी',
      nameKn: 'ಹೆಕ್ಸಾಕೊನಾಜೋಲ್ 5% ಎಸ್ಸಿ',
      activeIngredient: 'Hexaconazole 5% SC',
      applicationRate: '2 ml / L water (400 ml / acre in 200L water)',
      method: 'Foliar spray at 15-day intervals',
      frequency: '2 sprays on appearance of white patches',
      withholdingPeriod: '7 days',
      costEstimate: '₹ 320 - ₹ 420 / acre',
      modeOfAction: 'Triazole ergosterol biosynthesis inhibitor providing systemic preventive and curative action.',
      safetyPrecautions: 'Wear protective goggles and respirator during preparation.'
    },
    prevention: {
      immediate: ['Remove heavily coated lower leaves and dispose away from field', 'Improve spacing for ventilation'],
      longTerm: ['Maintain adequate potassium nutrition to strengthen leaf cuticle', 'Plant mildew-resistant hybrids']
    },
    weatherSensitivity: {
      highHumidityRisk: false,
      rainWashoutRisk: false,
      optimalTempRange: '20°C - 28°C with dry sunny days and humid nights',
      sprayConditions: 'Ideal for early morning calm weather; do not spray in high wind.'
    }
  },
  {
    id: 'downy-mildew',
    name: 'Downy Mildew',
    nameHi: 'मृदुरोमिल आसिता (Downy Mildew)',
    nameKn: 'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ (ಕೆಳ ಮುಖದ ಬೂದಿ ರೋಗ)',
    scientificName: 'Pseudoperonospora cubensis / Plasmopara viticola',
    affectedCrops: ['Grapes', 'Cucumber', 'Bitter Gourd', 'Onion', 'Bajra (Pearl Millet)', 'Mustard'],
    category: 'fungal',
    severity: 'High',
    symptoms: [
      'Angular chlorotic yellow patches restricted by leaf veins on upper leaf surface',
      'Purplish-grey to brown downy felt-like growth on the underside corresponding to yellow patches',
      'Rapid leaf browning and crisping as if scorched by fire',
      'Distorted yellow inflorescence ("Green Ear" in Bajra)'
    ],
    differentialDiagnosis: 'Angular yellow lesions strictly bordered by veins with purplish-grey fungal growth on underside separates it from Powdery Mildew.',
    organicTreatment: {
      name: 'Panchagavya (3%) + Copper Oxychloride (0.2%) Organic Blend',
      nameHi: 'पंचगव्य 3% + कॉपर ऑक्सीक्लोराइड 0.2%',
      nameKn: 'ಪಂಚಗವ್ಯ 3% + ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್',
      formulation: '3L Panchagavya + 200g Copper Oxychloride in 100L water',
      applicationRate: '200 L / acre',
      method: 'Under-canopy foliar spray directed upward',
      timing: 'Early morning or cloudy weather',
      withholdingPeriod: '1 day',
      costEstimate: '₹ 290 - ₹ 380 / acre',
      itkSource: 'ICAR Traditional Agricultural Knowledge (Tamil Nadu): Panchagavya foliar spray triggers systemic acquired resistance (SAR) against downy mildew.',
      modeOfAction: 'Enhances phytoalexin synthesis and bio-copper contact spore disruption.',
      safetyPrecautions: 'Stir well before loading spray tank. Avoid hot sunlight hours.'
    },
    chemicalTreatment: {
      name: 'Dimethomorph 50% WP + Mancozeb 75% WP / Cymoxanil 8% + Mancozeb 64% WP',
      nameHi: 'डाइमेथोमोर्फ + मैंकोज़ेब',
      nameKn: 'ಡೈಮೆಥೊಮಾರ್ಫ್ + ಮ್ಯಾಂಕೋಜೆಬ್',
      activeIngredient: 'Dimethomorph 50% WP (1g/L) + Mancozeb (2g/L)',
      applicationRate: '1 g Dimethomorph + 2 g Mancozeb per L water',
      method: 'Fine droplet spray on canopy undersides',
      frequency: 'Repeat after 10 days if rainy overcast conditions continue',
      withholdingPeriod: '10 days',
      costEstimate: '₹ 620 - ₹ 750 / acre',
      modeOfAction: 'Inhibits oospore cell wall formation and multi-site respiratory inhibition.',
      safetyPrecautions: 'Ensure chemical protective clothing; avoid drift into neighboring water bodies.'
    },
    prevention: {
      immediate: ['Tie vines onto trellises to avoid leaf contact with damp soil', 'Thin dense canopy for airflow'],
      longTerm: ['Use resistant cultivars', 'Avoid sprinkler or overhead misting']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '15°C - 22°C with persistent free moisture / dew',
      sprayConditions: 'Do not spray when rain is imminent; ensure 4 hours rain-free window.'
    }
  },
  {
    id: 'wheat-rust',
    name: 'Wheat Rust (Stripe & Leaf Rust)',
    nameHi: 'गेहूं का रतुआ / गेरुआ रोग (Wheat Rust)',
    nameKn: 'ಗೋಧಿ ತುಕ್ಕು ರೋಗ (Wheat Rust)',
    scientificName: 'Puccinia striiformis / Puccinia triticina',
    affectedCrops: ['Wheat', 'Barley'],
    category: 'fungal',
    severity: 'Severe',
    symptoms: [
      'Yellow/orange linear pustules arranged in narrow stripes along leaf veins (Yellow/Stripe Rust)',
      'Scattered reddish-brown oval pustules on leaf blade surfaces (Brown/Leaf Rust)',
      'Orange powder rubs off easily onto hands and clothes when walking through field',
      'Premature shriveling and yellowing of flag leaf leading to severely pinched grains'
    ],
    differentialDiagnosis: 'Bright yellow stripes or scattered orange powdery pustules that wipe off on fingers are diagnostic for rust fungi.',
    organicTreatment: {
      name: 'Fermented Garlic-Chilli Extract + Dashaparni Ark (5%)',
      nameHi: 'लहसुन-मिर्च अर्क + दशपर्णी अर्क (5%)',
      nameKn: 'ಬೆಳ್ಳುಳ್ಳಿ-ಮೆಣಸಿನಕಾಯಿ ಕಷಾಯ + ದಶಪರ್ಣಿ ಅರ್ಕ',
      formulation: '500g crushed garlic + 500g green chilli steeped in 5L Dashaparni Ark + 100L water',
      applicationRate: '200 L / acre',
      method: 'Uniform foliar spray on flag leaves and canopy',
      timing: 'Morning or calm evening',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 210 - ₹ 290 / acre',
      itkSource: 'ICAR Directorate of Wheat Research ITK: Allicin in garlic acts as a potent rust uredospore germination suppressor.',
      modeOfAction: 'Allicin thiosulfinates inhibit thiol-containing enzymes in rust fungal spores.',
      safetyPrecautions: 'Wear gloves during preparation to prevent skin irritation from capsaicin.'
    },
    chemicalTreatment: {
      name: 'Propiconazole 25% EC (Tilt)',
      nameHi: 'प्रोपिकोनाज़ोल 25% ईसी (टिल्ट)',
      nameKn: 'ಪ್ರೊಪಿಕೊನಾಜೋಲ್ 25% ಇಸಿ',
      activeIngredient: 'Propiconazole 25% EC',
      applicationRate: '1 ml / L water (200 ml in 200L water per acre)',
      method: 'Foliar spray at initial pustule detection stage',
      frequency: 'Single spray usually controls; repeat once after 15 days if stripe rust spreads',
      withholdingPeriod: '30 days',
      costEstimate: '₹ 450 - ₹ 540 / acre',
      modeOfAction: 'Systemic DMI fungicide stopping haustorial growth inside wheat leaf mesophyll.',
      safetyPrecautions: 'Do not harvest forage for dairy animals within 20 days of application.'
    },
    prevention: {
      immediate: ['Inspect field borders facing north/west for early foci of yellow rust', 'Apply spot treatment immediately'],
      longTerm: ['Sow rust-resistant varieties like HD-2967, PBW-550, DBW-187', 'Timely sowing before mid-November in NWPZ']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '10°C - 18°C for Yellow Rust; 18°C - 25°C for Brown Rust',
      sprayConditions: 'Spray on sunny mornings with no rain in 6-hour forecast.'
    }
  },
  {
    id: 'cotton-bollworm',
    name: 'Cotton Bollworm (American / Pink Bollworm)',
    nameHi: 'कपास का सुंडी / बॉलवर्म रोग (Bollworm)',
    nameKn: 'ಹತ್ತಿಯ ಕಾಯಿಕೊರಕ ಹುಳು (Cotton Bollworm)',
    scientificName: 'Helicoverpa armigera / Pectinophora gossypiella',
    affectedCrops: ['Cotton', 'Pigeon Pea', 'Chickpea', 'Tomato'],
    category: 'pest',
    severity: 'Severe',
    symptoms: [
      'Circular entrance bore holes on developing squares and cotton bolls with frass accumulation',
      'Flared squares ("Rosetted flowers") that fail to open properly',
      'Premature dropping of squares and young bolls',
      'Interiors of green bolls completely hollowed out and stained brown'
    ],
    differentialDiagnosis: 'Bored entry holes plugged with frass and rosetted pinkish flower buds are unmistakable bollworm damage.',
    organicTreatment: {
      name: 'Neem Oil 10,000 PPM (3ml/L) + HaNPV (Helicoverpa Nuclear Polyhedrosis Virus) + Pheromone Traps',
      nameHi: 'नीम तेल 10,000 पीपीएम + एचएएनपीवी बायो-पेस्टीसाइड + फेरोमोन ट्रैप',
      nameKn: 'ಬೇವಿನ ಎಣ್ಣೆ 10,000 PPM + ಹಎನ್‌ಪಿವಿ + ಫೆರೋಮೋನ್ ಬಲೆಗಳು',
      formulation: 'Neem oil 3ml/L + HaNPV 250 LE/ha in 200L water + 8 Pheromone traps/acre',
      applicationRate: '200 L / acre',
      method: 'Foliar spray targeting squares and young bolls',
      timing: 'Evening application (5 PM) to protect HaNPV virus from UV breakdown',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 380 - ₹ 480 / acre',
      itkSource: 'ICAR Central Institute for Cotton Research (CICR): Castor / Marigold trap cropping with fermented neem cake spray reduces bollworm egg oviposition by 68%.',
      modeOfAction: 'HaNPV infects midgut epithelium of larvae causing viral polyhedrosis; Neem acts as oviposition deterrent and antifeedant.',
      safetyPrecautions: 'Handle HaNPV in dark/cool conditions. Install pheromone traps 30cm above crop canopy.'
    },
    chemicalTreatment: {
      name: 'Emamectin Benzoate 5% SG / Chlorantraniliprole 18.5% SC (Coragen)',
      nameHi: 'इमामेक्टिन बेंजोएट 5% एसजी या कोराजेन',
      nameKn: 'ಇಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೊಯೇಟ್ / ಕೊರಾಜೆನ್',
      activeIngredient: 'Emamectin Benzoate 5% SG (80g/acre) OR Chlorantraniliprole 18.5% SC (60ml/acre)',
      applicationRate: '0.4 g / L water (Emamectin) OR 0.3 ml / L (Coragen)',
      method: 'Directed spray on squares, flowers, and bolls',
      frequency: 'Apply once Economic Threshold Level (ETL: 1 larva/plant or 5% damaged bolls) is breached',
      withholdingPeriod: '14 days',
      costEstimate: '₹ 650 - ₹ 850 / acre',
      modeOfAction: 'Activates ryanodine receptors causing muscle paralysis and feeding cessation within 2 hours.',
      safetyPrecautions: 'Highly toxic to bees; avoid spraying during active pollination window.'
    },
    prevention: {
      immediate: ['Erect bird perches (15-20 per acre) for predatory insectivorous birds', 'Handpick and destroy flared squares'],
      longTerm: ['Destroy cotton stubble immediately after final pick', 'Refugium planting with non-Bt cotton around border']
    },
    weatherSensitivity: {
      highHumidityRisk: false,
      rainWashoutRisk: true,
      optimalTempRange: '26°C - 35°C',
      sprayConditions: 'Spray in late afternoon when wind speeds are < 10 km/h.'
    }
  },
  {
    id: 'trunk-borer',
    name: 'Trunk Borer / Red Palm Weevil',
    nameHi: 'सुपारी/नारियल तना छेदक (Trunk Borer)',
    nameKn: 'ಅಡಿಕೆ / ತೆಂಗಿನ ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು (Trunk Borer)',
    scientificName: 'Rhynchophorus ferrugineus / Batocera rufomaculata',
    affectedCrops: ['Areca Nut', 'Coconut', 'Date Palm', 'Mango'],
    category: 'pest',
    severity: 'Severe',
    symptoms: [
      'Small holes on palm trunk exuding viscous reddish-brown liquid or gummy sap',
      'Chewed fibrous frass extruding from bore holes with a characteristic fermented smell',
      'Dull gnawing/crunching sound audible inside trunk when putting ear to tree',
      'Central crown leaves turn yellow, wilt, and entire crown may topple over in advanced stage'
    ],
    differentialDiagnosis: 'Thick reddish sap exudation with expelled fibrous frass and gnawing sound inside trunk is diagnostic of weevil/borer infestation.',
    organicTreatment: {
      name: 'Metarhizium anisopliae (Bio-Fungus) Trunk Swabbing + Fermented Yeast-Banana Traps',
      nameHi: 'मेटाराइजियम एनिसोप्ली कवक लेप + किण्वित केला ट्रैप',
      nameKn: 'ಮೆಟಾರೈಜಿಯಮ್ ಜೈವಿಕ ಶಿಲೀಂಧ್ರ ಲೇಪನ + ಬಾಳೆಹಣ್ಣಿನ ಬಲೆ',
      formulation: 'Metarhizium paste (20g/L) mixed with coal tar / neem oil paste',
      applicationRate: '50-100 ml paste swabbed into trunk cavity + root feeding',
      method: 'Plug bore holes with cotton soaked in neem oil (5%) and seal with clay/mud',
      timing: 'Treat immediately upon discovering frass extrusion',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 150 - ₹ 220 / tree',
      itkSource: 'ICAR CPCRI Kasaragod ITK: Invert crushed sugarcane or toddy fermented banana in clay pot with holes to trap adult weevils effectively.',
      modeOfAction: 'Entomopathogenic fungus Metarhizium penetrates weevil cuticle and sporulates inside body.',
      safetyPrecautions: 'Ensure holes are sealed airtight with clay to asphyxiate internal grubs.'
    },
    chemicalTreatment: {
      name: 'Chlorpyrifos 20% EC (Trunk Injection / Root Feeding) + Aluminium Phosphide Pellets',
      nameHi: 'क्लोरपायरीफॉस 20% ईसी तना इंजेक्शन',
      nameKn: 'ಕ್ಲೋರ್‌ಪೈರಿಫಾಸ್ ಕಾಂಡದ ಚುಚ್ಚುಮದ್ದು / ಬೇರು ಪೋಷಣೆ',
      activeIngredient: 'Chlorpyrifos 20% EC (10ml in 10ml water for root feeding)',
      applicationRate: 'Inject 10ml solution into downward-slanted trunk hole drilled 1m above ground and plug with cement/wax',
      method: 'Trunk injection using tree syringe or absorbed through active pencil-thick feeder roots',
      frequency: 'Single curative treatment; repeat after 45 days if frass continues',
      withholdingPeriod: '45 days before harvesting nuts',
      costEstimate: '₹ 80 - ₹ 140 / tree',
      modeOfAction: 'Organophosphate acetylcholinesterase inhibitor killing burrowing grubs systemically.',
      safetyPrecautions: 'Wear chemical chemical respirator and gloves. Never use on young palms under 3 years.'
    },
    prevention: {
      immediate: ['Avoid cutting green fronds leaving petiole stumps; cut at least 30cm away from trunk', 'Seal mechanical trunk wounds with Bordeaux paste'],
      longTerm: ['Clean palm crowns regularly during post-monsoon months', 'Install aggregation pheromone (Ferrolure+) traps @ 1 trap/2 acres']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '25°C - 35°C',
      sprayConditions: 'Trunk injection can be executed regardless of light rain since medicine is delivered internally.'
    }
  },
  {
    id: 'bacterial-wilt',
    name: 'Bacterial Wilt',
    nameHi: 'जीवाणु उकठा रोग (Bacterial Wilt)',
    nameKn: 'ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಸೊರಗು ರೋಗ (Bacterial Wilt)',
    scientificName: 'Ralstonia solanacearum',
    affectedCrops: ['Brinjal / Eggplant', 'Tomato', 'Chilli', 'Potato', 'Ginger'],
    category: 'bacterial',
    severity: 'Severe',
    symptoms: [
      'Rapid daytime wilting and drooping of foliage while leaves remain green (green wilt)',
      'Plants appear to recover at night initially, then permanently collapse within 3-5 days',
      'Vascular ring in stem cross-section turns dark brown/black',
      'Diagnostic Stream Test: Clean stem cut suspended in clear water exudes milky white bacterial streaming threads within 2 minutes'
    ],
    differentialDiagnosis: 'Leaves remain green while collapsing (unlike Fusarium yellowing) and positive milky bacterial streaming in water glass test confirms Bacterial Wilt.',
    organicTreatment: {
      name: 'Pseudomonas fluorescens (Soil Drench) + Bleaching Powder (5 kg/acre) + Mustard Cake',
      nameHi: 'स्यूडोमोनास फ्लोरेसेन्स 1% ड्रेंचिंग + ब्लीचिंग पाउडर',
      nameKn: 'ಸೂಡೋಮೊನಾಸ್ ದ್ರಾವಣ ಬುಡಕ್ಕೆ ಸುರಿಯುವುದು + ಬ್ಲೀಚಿಂಗ್ ಪೌಡರ್',
      formulation: 'Pseudomonas 20g / L water drenching at plant collar + 5g/L bleaching powder',
      applicationRate: '250 ml drench solution per plant collar zone',
      method: 'Soil root-zone drenching',
      timing: 'Apply in morning after light irrigation',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 320 - ₹ 420 / acre',
      itkSource: 'ICAR IIHR Bengaluru: Pre-planting soil application of mustard cake (150 kg/acre) releases bio-fumigating isothiocyanates killing Ralstonia bacteria.',
      modeOfAction: 'Rhizospheric colonizing bacteria produce siderophores and antibiotics depriving Ralstonia of iron.',
      safetyPrecautions: 'Do not mix bio-agents with copper drench or chemical bactericides.'
    },
    chemicalTreatment: {
      name: 'Copper Oxychloride 50% WP (3g/L) + Streptocycline (0.5g/L) Root Drench',
      nameHi: 'कॉपर ऑक्सीक्लोराइड + स्ट्रेप्टोसाइक्लिन रूट ड्रेंच',
      nameKn: 'ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ + ಸ್ಟ್ರೆಪ್ಟೋಸೈಕ್ಲಿನ್ ಬುಡಕ್ಕೆ ದ್ರಾವಣ',
      activeIngredient: 'Copper Oxychloride 50% WP (3g/L) + Streptocycline (0.5g/L)',
      applicationRate: '200 ml drench per affected and adjacent surrounding plants',
      method: 'Soil drenching around base of each plant',
      frequency: 'Repeat after 10 days to quarantine field focus',
      withholdingPeriod: '15 days',
      costEstimate: '₹ 450 - ₹ 580 / acre',
      modeOfAction: 'Contact bactericidal action denaturing bacterial cell membranes in root zone.',
      safetyPrecautions: 'Do not spray overhead on foliage during hot sun.'
    },
    prevention: {
      immediate: ['Uproot wilted plants with surrounding root soil, place in sealed bag, and destroy off-site', 'Bleach spot soil with 25g bleaching powder'],
      longTerm: ['Graft scions onto resistant wild brinjal rootstock (Solanum torvum)', 'Crop rotation with non-host maize, marigold, or paddy for 3 years']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '28°C - 35°C with high soil moisture',
      sprayConditions: 'Apply drench when soil is moist but not waterlogged.'
    }
  },
  {
    id: 'tikka-leaf-spot',
    name: 'Tikka Disease (Cercospora Leaf Spot)',
    nameHi: 'मूंगफली का टिक्का रोग (Tikka Disease)',
    nameKn: 'ಕಡಲೆಕಾಯಿ ಟಿಕ್ಕಾ ರೋಗ (Tikka Leaf Spot)',
    scientificName: 'Cercospora personata / Cercospora arachidicola',
    affectedCrops: ['Groundnut / Peanut', 'Soybean'],
    category: 'fungal',
    severity: 'High',
    symptoms: [
      'Early Leaf Spot: Circular reddish-brown to dark brown spots with prominent yellow halo',
      'Late Leaf Spot: Carbon-black circular spots without yellow halo on lower leaf surface',
      'Severe defoliation leaving stems bare and pods underdeveloped',
      'Black elongated lesions on petioles and stems'
    ],
    differentialDiagnosis: 'Circular black spots on groundnut foliage causing premature defoliation is characteristic of Tikka disease.',
    organicTreatment: {
      name: 'Cow Urine (10%) + Fermented Sour Butter Milk (5%) + Neem Oil',
      nameHi: 'गोमूत्र 10% + खट्टी छाछ 5% + नीम तेल',
      nameKn: 'ಗೋಮೂತ್ರ + ಹುಳಿ ಮಜ್ಜಿಗೆ + ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಣೆ',
      formulation: '10L cow urine + 5L buttermilk + 1L neem oil + 100L water',
      applicationRate: '200 L / acre',
      method: 'Foliar spray at 35-40 days after sowing',
      timing: 'Early morning spray',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 160 - ₹ 240 / acre',
      itkSource: 'ICAR NRCG Junagadh ITK: 10% Cow urine contains natural phenolic conjugates that suppress Cercospora sporulation by 60%.',
      modeOfAction: 'Alkaline microenvironment and volatile organic bio-acids inhibit spore germination.',
      safetyPrecautions: 'Use fresh cow urine; dilute properly to avoid leaf tip scorch.'
    },
    chemicalTreatment: {
      name: 'Tebuconazole 25.9% EC / Mancozeb 75% WP + Carbendazim 12% WP',
      nameHi: 'टेबुकोनाज़ोल 25.9% ईसी (फॉलिकुर)',
      nameKn: 'ಟೆಬುಕೊನಾಜೋಲ್ 25.9% ಇಸಿ',
      activeIngredient: 'Tebuconazole 25.9% EC (1ml/L) OR Carbendazim + Mancozeb (2g/L)',
      applicationRate: '1 ml / L water (200 ml / acre in 200L water)',
      method: 'Foliar spray with hollow cone nozzle',
      frequency: '2 sprays at 15-day intervals starting from 40 DAS',
      withholdingPeriod: '15 days',
      costEstimate: '₹ 420 - ₹ 520 / acre',
      modeOfAction: 'Inhibits fungal sterol demethylation (C14-demethylase inhibitor).',
      safetyPrecautions: 'Wear gloves and eye shield. Do not spray during windy conditions.'
    },
    prevention: {
      immediate: ['Spray immediately when 2-3 spots per leaf are spotted in field sample', 'Ensure good soil drainage'],
      longTerm: ['Seed treatment with Trichoderma viride @ 10g/kg seed or Thiram @ 3g/kg seed', 'Rotate with pearl millet, sorghum, or maize']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '25°C - 30°C with prolonged leaf wetness',
      sprayConditions: 'Ensure 3 hours of dry weather following foliar spray.'
    }
  },
  {
    id: 'purple-blotch',
    name: 'Purple Blotch',
    nameHi: 'प्याज का बैंगनी धब्बा रोग (Purple Blotch)',
    nameKn: 'ಈರುಳ್ಳಿ ನೇರಳೆ ಮಚ್ಚೆ ರೋಗ (Purple Blotch)',
    scientificName: 'Alternaria porri',
    affectedCrops: ['Onion', 'Garlic', 'Leek'],
    category: 'fungal',
    severity: 'High',
    symptoms: [
      'Small water-soaked sunken lesions on leaves and seed stalks that rapidly enlarge',
      'Lesion centers turn purplish to dark violet with yellowish borders',
      'Leaves break or collapse at the point of the lesion',
      'Bulbs rot from the neck downward in storage (Neck Rot)'
    ],
    differentialDiagnosis: 'Distinct violet/purple discoloration in the center of sunken leaf spots on allium species is uniquely diagnostic.',
    organicTreatment: {
      name: 'Pseudomonas fluorescens (1%) + Garlic Extract (5%) + Wetting Agent (Sandovit)',
      nameHi: 'स्यूडोमोनास 1% + लहसुन अर्क 5% + स्टीकर/स्प्रेडर',
      nameKn: 'ಸೂಡೋಮೊನಾಸ್ + ಬೆಳ್ಳುಳ್ಳಿ ಕಷಾಯ + ಅಂಟು ದ್ರಾವಣ',
      formulation: '10g Pseudomonas/L water + 50ml fresh garlic extract + 1ml spreader',
      applicationRate: '200 L / acre',
      method: 'Foliar spray with fine droplet mist',
      timing: 'Late morning spray once dew has evaporated',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 220 - ₹ 310 / acre',
      itkSource: 'ICAR Directorate of Onion & Garlic Research: Adding non-ionic soap (reetha extract 1%) is vital to break waxy onion cuticle tension.',
      modeOfAction: 'Allicin in garlic disrupts Alternaria porri mycelial respiration.',
      safetyPrecautions: 'Always mix with an agricultural surfactant/sticker due to waxy onion foliage.'
    },
    chemicalTreatment: {
      name: 'Difenoconazole 25% EC (Score) / Mancozeb 75% WP',
      nameHi: 'डिफेनोकोनाज़ोल 25% ईसी (स्कोर)',
      nameKn: 'ಡೈಫೆನೊಕೊನಾಜೋಲ್ 25% ಇಸಿ (ಸ್ಕೋರ್)',
      activeIngredient: 'Difenoconazole 25% EC (1 ml/L) + Sandovit/Sticker (0.5 ml/L)',
      applicationRate: '1 ml Difenoconazole + 0.5 ml sticker per L water',
      method: 'Foliar spray ensuring stickiness on waxy leaves',
      frequency: '2-3 sprays at 12-day intervals',
      withholdingPeriod: '10 days',
      costEstimate: '₹ 480 - ₹ 600 / acre',
      modeOfAction: 'Systemic triazole fungicide interrupting cell membrane synthesis.',
      safetyPrecautions: 'Use respirator; do not spray near apiaries.'
    },
    prevention: {
      immediate: ['Avoid overhead irrigation to minimize leaf moisture duration', 'Ensure proper field drainage'],
      longTerm: ['3-year crop rotation without allium crops', 'Dip seedlings in Pseudomonas @ 5g/L before transplanting']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '22°C - 28°C with RH > 80%',
      sprayConditions: 'Sticker/spreader is mandatory due to slippery leaf wax.'
    }
  },
  {
    id: 'yellow-vein-mosaic',
    name: 'Yellow Vein Mosaic Virus (YVMV)',
    nameHi: 'भिंडी का पीला शिरा मोज़ेक रोग (YVMV)',
    nameKn: 'ಬೆಂಡೆಕಾಯಿ ಹಳದಿ ಎಲೆ ರೋಗ (YVMV)',
    scientificName: 'Bhendi Yellow Vein Mosaic Virus (Transmitted by Whitefly: Bemisia tabaci)',
    affectedCrops: ['Okra / Ladyfinger', 'Cotton', 'Hibiscus'],
    category: 'viral',
    severity: 'Severe',
    symptoms: [
      'Alternating network of bright yellow veins against green leaf tissue (mosaic pattern)',
      'Veins swell and thicken, causing leaves to become stiff, brittle, and leathery',
      'Entire canopy turns bleached golden-yellow in severe infection',
      'Fruits turn pale yellow-white, hard, fibrous, and unmarketable'
    ],
    differentialDiagnosis: 'Bright yellow vein clearance network across okra leaves with presence of tiny whiteflies under leaves confirms YVMV.',
    organicTreatment: {
      name: 'Neem Oil 10,000 PPM (3ml/L) + Yellow Sticky Traps (15 traps/acre) + Agniastra',
      nameHi: 'नीम तेल 10,000 पीपीएम + पीले चिपचिपे जाल + अग्न्यास्त्र',
      nameKn: 'ಬೇವಿನ ಎಣ್ಣೆ + ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳು + ಅಗ್ನ್ಯಾಸ್ತ್ರ',
      formulation: 'Neem oil 3ml + Agniastra 20ml per L water + 15 yellow sticky traps',
      applicationRate: '200 L / acre',
      method: 'Under-leaf spray to target whitefly nymphs and adults',
      timing: 'Early morning or dusk when whiteflies are stationary',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 320 - ₹ 420 / acre',
      itkSource: 'ICAR IIVR Varanasi ITK: Agniastra (decoction of cow urine, neem, green chilli, garlic, tobacco) suppresses vector whitefly by 82%.',
      modeOfAction: 'Controls insect vector (whitefly) preventing viral transmission.',
      safetyPrecautions: 'Install yellow sticky traps just above crop canopy height.'
    },
    chemicalTreatment: {
      name: 'Acetamiprid 20% SP / Diafenthiuron 50% WP (Vector Control)',
      nameHi: 'एसिटामिप्रिड 20% एसपी / पोलो',
      nameKn: 'ಅಸಿಟಾಮಿಪ್ರಿಡ್ 20% ಎಸ್ಪಿ / ಡೈಯಾಫೆಂಥಿಯುರಾನ್',
      activeIngredient: 'Acetamiprid 20% SP (0.4g/L) OR Diafenthiuron 50% WP (1g/L)',
      applicationRate: '0.4 g / L water (80 g in 200L water per acre)',
      method: 'Fine spray directed at leaf undersides',
      frequency: 'Apply immediately upon seeing whiteflies (ETL: 4 whiteflies/leaf)',
      withholdingPeriod: '5 days',
      costEstimate: '₹ 380 - ₹ 480 / acre',
      modeOfAction: 'Neonicotinoid nicotinic acetylcholine receptor agonist paralyzing vector insects.',
      safetyPrecautions: 'Wear full protective gear. Avoid spraying during honeybee active hours.'
    },
    prevention: {
      immediate: ['Uproot and bury initial 1-2 infected plants before whiteflies spread virus to whole field', 'Maintain border barrier crop (2 rows of maize or sorghum)'],
      longTerm: ['Sow YVMV-resistant hybrids like Arka Anamika, Parbhani Kranti, Kashi Kranti', 'Synchronize sowing with community to break vector cycle']
    },
    weatherSensitivity: {
      highHumidityRisk: false,
      rainWashoutRisk: false,
      optimalTempRange: '30°C - 38°C (dry hot weather accelerates whitefly multiplication)',
      sprayConditions: 'Spray during windless mornings; avoid spraying before rain.'
    }
  },
  {
    id: 'anthracnose-dieback',
    name: 'Anthracnose & Dieback',
    nameHi: 'मिर्च/आम का एन्थ्रेक्नोज / डाईबैक रोग',
    nameKn: 'ಮೆಣಸಿನಕಾಯಿ ಕೊಳೆ ರೋಗ / ಆಂಥ್ರಾಕ್ನೋಸ್',
    scientificName: 'Colletotrichum capsici / Colletotrichum gloeosporioides',
    affectedCrops: ['Chilli', 'Mango', 'Papaya', 'Tomato', 'Beans'],
    category: 'fungal',
    severity: 'High',
    symptoms: [
      'Twigs and branches dry up from the tip downwards (Dieback effect)',
      'Circular sunken dark brown to black lesions with concentric rings of salmon-pink acervuli on ripe fruits',
      'Premature fruit drop and rotting of chilli pods',
      'Small dark brown spots on leaves that wither and drop'
    ],
    differentialDiagnosis: 'Sunken circular spots with black concentric rings and pinkish gelatinous spore masses on ripe pods is characteristic.',
    organicTreatment: {
      name: 'Trichoderma harzianum (Bio-Fungicide) + Cow Dung-Urine Extract (10%)',
      nameHi: 'ट्राइकोडर्मा हारज़ियानम + गोमूत्र-गोबर का अर्क 10%',
      nameKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ಹಾರ್ಜಿಯಾನಮ್ + ಗೋಮೂತ್ರ ಕಷಾಯ',
      formulation: 'Trichoderma 5g/L + filtered 10% cow urine extract in 100L water',
      applicationRate: '200 L / acre',
      method: 'Foliar spray on fruits and branches',
      timing: 'Apply at flowering and fruit set stages in late evening',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 220 - ₹ 300 / acre',
      itkSource: 'ICAR IIHR ITK: 10% fresh cow urine spray contains volatile phenols inhibiting Colletotrichum fungal conidia germination by 78%.',
      modeOfAction: 'Trichoderma hyperparasitizes pathogen hyphae; cow urine bio-enzymes disrupt spores.',
      safetyPrecautions: 'Store bio-agents out of direct sunlight in cool area.'
    },
    chemicalTreatment: {
      name: 'Azoxystrobin 23% SC / Copper Oxychloride 50% WP + Carbendazim 50% WP',
      nameHi: 'एज़ोक्सीस्ट्रोबिन 23% एससी (एमिस्टार)',
      nameKn: 'ಅಜಾಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ 23% ಎಸ್ಸಿ',
      activeIngredient: 'Azoxystrobin 23% SC (1ml/L) OR COC 50% WP (2.5g/L)',
      applicationRate: '1 ml / L water (200 ml / acre in 200L water)',
      method: 'High-pressure canopy and fruit wash spray',
      frequency: '2 sprays at 12-14 day intervals',
      withholdingPeriod: '5 days',
      costEstimate: '₹ 550 - ₹ 680 / acre',
      modeOfAction: 'Inhibits electron transport in fungal mitochondrial complex III.',
      safetyPrecautions: 'Do not harvest fruits within withholding period. Wear face mask.'
    },
    prevention: {
      immediate: ['Prune dried twigs 2 inches below infected dead wood and apply copper paste on cut surface', 'Collect and destroy dropped infected pods'],
      longTerm: ['Seed treatment with Thiram @ 3g/kg seed or Trichoderma @ 10g/kg seed', 'Avoid excessive nitrogen fertilization during fruit development']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '25°C - 30°C with high humidity (> 80%)',
      sprayConditions: 'Spray immediately after rains cease and foliage dries.'
    }
  },
  {
    id: 'white-rust',
    name: 'White Rust (Blister)',
    nameHi: 'सरसों का सफेद रतुआ (White Rust)',
    nameKn: 'ಸಾಸಿವೆ ಬಿಳಿ ತುಕ್ಕು ರೋಗ (White Rust)',
    scientificName: 'Albugo candida',
    affectedCrops: ['Mustard', 'Rapeseed', 'Radish', 'Cabbage'],
    category: 'fungal',
    severity: 'Medium',
    symptoms: [
      'Shiny white to cream-colored raised pustules (blisters) on leaf undersides',
      'Corresponding upper leaf surface shows pale yellow chlorotic patches',
      'Staghead abnormality: Floral parts become swollen, malformed, fleshy, and sterile',
      'Stem and floral hypertrophy with no seed formation'
    ],
    differentialDiagnosis: 'Prominent white porcelain-like blisters on leaf undersides and swollen staghead floral deformity are unique to Albugo candida.',
    organicTreatment: {
      name: 'Garlic Extract (5%) + Mustard Oil Emulsion (1%) + Bio-Copper Spray',
      nameHi: 'लहसुन अर्क 5% + सरसों तेल इमल्शन 1% + बायो कॉपर',
      nameKn: 'ಬೆಳ್ಳುಳ್ಳಿ ಕಷಾಯ + ಸಾಸಿವೆ ಎಣ್ಣೆ ಸಿಂಪಡಣೆ',
      formulation: '500g crushed garlic + 100ml mustard oil + 20g soap in 100L water',
      applicationRate: '200 L / acre',
      method: 'Foliar spray covering lower leaf surface',
      timing: 'Morning spray before 11 AM',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 190 - ₹ 270 / acre',
      itkSource: 'ICAR Directorate of Rapeseed-Mustard Research ITK: Dilute garlic-soap emulsion creates fatty acid barriers inhibiting Albugo zoospore mobility.',
      modeOfAction: 'Allicin compounds and lipid layer suffocate and lyse biflagellate zoospores.',
      safetyPrecautions: 'Ensure proper soap emulsification of oil so it mixes thoroughly with water.'
    },
    chemicalTreatment: {
      name: 'Metalaxyl 35% WS (Seed Treatment) & Mancozeb 75% WP (Foliar Spray)',
      nameHi: 'मेटालेक्सिल 35% डब्लूएस + मैंकोज़ेब 75% डब्ल्यूपी',
      nameKn: 'ಮೆಟಾಲಾಕ್ಸಿಲ್ + ಮ್ಯಾಂಕೋಜೆಬ್ ಕೀಟನಾಶಕ',
      activeIngredient: 'Mancozeb 75% WP (2 g/L) OR Ridomil MZ (2 g/L)',
      applicationRate: '2 g / L water (400 g in 200L water per acre)',
      method: 'Foliar spray at 50-60 days after sowing',
      frequency: '2 sprays at 15-day interval',
      withholdingPeriod: '20 days',
      costEstimate: '₹ 380 - ₹ 480 / acre',
      modeOfAction: 'Multi-site contact inhibitor disrupting fungal cellular respiration.',
      safetyPrecautions: 'Wear gloves and mask. Avoid skin contamination.'
    },
    prevention: {
      immediate: ['Clip and destroy malformed "staghead" floral heads to eliminate oospore reservoir', 'Avoid late irrigation'],
      longTerm: ['Sow early (between 10-25 October) to escape peak white rust pressure', 'Use resistant cultivars like DRMR-IJ 31 (Giriraj), NRCHB-101']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '12°C - 18°C with morning fog and heavy dew',
      sprayConditions: 'Spray after morning fog lifts and leaves are dry.'
    }
  },
  {
    id: 'citrus-canker',
    name: 'Citrus Canker',
    nameHi: 'नींबू का कैंकर रोग (Citrus Canker)',
    nameKn: 'ಲಿಂಬೆ ಗಿಡದ ಹುಣ್ಣು ರೋಗ (Citrus Canker)',
    scientificName: 'Xanthomonas axonopodis pv. citri',
    affectedCrops: ['Lemon', 'Acid Lime', 'Orange', 'Sweet Lime (Mosambi)', 'Grapefruit'],
    category: 'bacterial',
    severity: 'High',
    symptoms: [
      'Raised, corky, rough brownish eruptions/scabs on leaves, twigs, thorns, and fruits',
      'Lesions surrounded by a characteristic distinct oily yellow halo on leaves',
      'Crater-like rough center on mature fruit surface causing severe unmarketability',
      'Premature fruit drop and severe twig dieback'
    ],
    differentialDiagnosis: 'Raised corky eruptions with sunken crater-like centers and yellow translucent halos distinguish canker from citrus scab or scale insects.',
    organicTreatment: {
      name: 'Neem Cake Supernatant (5%) + Bordeaux Mixture (1%) + Bio-Bactericide',
      nameHi: 'नीम खली का पानी 5% + बोर्डो मिश्रण 1%',
      nameKn: 'ಬೇವಿನ ಹಿಂಡಿ ದ್ರಾವಣ 5% + ಬೋರ್ಡೋ ಮಿಶ್ರಣ 1%',
      formulation: '5kg neem cake soaked overnight in 100L water + 1% Bordeaux mixture',
      applicationRate: '500 L / acre (for orchard trees)',
      method: 'Orchard air-blast foliar spray covering branches and fruits',
      timing: 'Immediately after flushing and fruit set',
      withholdingPeriod: '1 day',
      costEstimate: '₹ 350 - ₹ 450 / acre',
      itkSource: 'ICAR CCRI Nagpur: Neem cake extract contains limonoids that suppress leaf miner caterpillars whose feeding wounds allow Xanthomonas entry.',
      modeOfAction: 'Reduces citrus leaf miner wounding while copper ions kill bacterial cells.',
      safetyPrecautions: 'Apply with wooden/plastic containers when handling copper.'
    },
    chemicalTreatment: {
      name: 'Streptocycline (1g in 10L) + Copper Oxychloride (30g in 10L water)',
      nameHi: 'स्ट्रेप्टोसाइक्लिन (1 ग्राम / 10 लीटर) + कॉपर ऑक्सीक्लोराइड (30 ग्राम / 10 लीटर)',
      nameKn: 'ಸ್ಟ್ರೆಪ್ಟೋಸೈಕ್ಲಿನ್ + ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಸಿಂಪಡಣೆ',
      activeIngredient: 'Streptomycin sulphate 90% + Tetracycline 10% (100 ppm) + COC (0.3%)',
      applicationRate: '1 g Streptocycline + 30 g COC per 10 L water',
      method: 'Thorough tree canopy wash spray',
      frequency: '3 sprays: before monsoon, after monsoon, and during new flush',
      withholdingPeriod: '14 days',
      costEstimate: '₹ 450 - ₹ 580 / acre',
      modeOfAction: 'Systemic antibiotic inhibiting bacterial protein synthesis combined with bactericidal copper.',
      safetyPrecautions: 'Wear protective clothing and mask during application.'
    },
    prevention: {
      immediate: ['Prune cankered twigs before monsoon rains and burn them', 'Spray 1% Bordeaux mixture on cut ends'],
      longTerm: ['Control Citrus Leaf Miner insect pest strictly during new flushes', 'Plant windbreaks (Casuarina / Sesbania) around orchard to stop wind-blown rain spread']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '20°C - 35°C during rainy windy spells',
      sprayConditions: 'Spray immediately after storm winds or heavy rains subside.'
    }
  },
  {
    id: 'red-rot',
    name: 'Red Rot of Sugarcane',
    nameHi: 'गन्ने का लाल सड़न / रेड रॉट रोग',
    nameKn: 'ಕಬ್ಬಿನ ಕೆಂಪು ಕೊಳೆ ರೋಗ (Red Rot)',
    scientificName: 'Colletotrichum falcatum',
    affectedCrops: ['Sugarcane'],
    category: 'fungal',
    severity: 'Severe',
    symptoms: [
      'Third or fourth leaf from top shows yellowing and withering along midrib',
      'Midrib lesions turn blood-red with dark centers and white patches',
      'Longitudinal splitting of stalk reveals red-stained pith with characteristic cross-wise white patches/bands',
      'Alcoholic / sour acidic smell emitted from split infected cane stalks'
    ],
    differentialDiagnosis: 'Internal blood-red stalk discoloration interrupted by horizontal white patches and sour wine odor is pathognomonic for red rot.',
    organicTreatment: {
      name: 'Trichoderma viride Sett Treatment + Jeevamrutha Soil Application',
      nameHi: 'ट्राइकोडर्मा सेट उपचार + जीवामृत मृदा प्रयोग',
      nameKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ಕಬ್ಬಿನ ಬೀಜೋಪಚಾರ + ಜೀವಾಮೃತ',
      formulation: 'Trichoderma 10g/L sett dip for 30 min + 200L Jeevamrutha/acre in irrigation channel',
      applicationRate: '200 L / acre',
      method: 'Pre-planting sett dip & root zone flooding',
      timing: 'At planting and earthing-up stage',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 250 - ₹ 350 / acre',
      itkSource: 'ICAR Sugarcane Breeding Institute Coimbatore ITK: Dipping cane setts in cow dung-urine slurry with Trichoderma builds systemic antifungal barrier in vascular bundles.',
      modeOfAction: 'Trichoderma colonizes sett cut ends preventing fungal hyphae penetration.',
      safetyPrecautions: 'Ensure treated setts are planted within 2 hours of dipping.'
    },
    chemicalTreatment: {
      name: 'Carbendazim 50% WP Sett Dip + Thiophanate Methyl 70% WP',
      nameHi: 'कार्बेन्डाजिम 50% डब्ल्यूपी सेट उपचार',
      nameKn: 'ಕಾರ್ಬೆಂಡಾಜಿಮ್ 50% ಡಬ್ಲ್ಯೂಪಿ ಕಬ್ಬಿನ ತುಂಡುಗಳ ಉಪಚಾರ',
      activeIngredient: 'Carbendazim 50% WP (1g/L water)',
      applicationRate: '100 g Carbendazim in 100 L water for 15-minute sett soaking',
      method: 'Pre-planting cane sett soaking for 15 minutes',
      frequency: 'Single application at planting',
      withholdingPeriod: '60 days',
      costEstimate: '₹ 320 - ₹ 420 / acre',
      modeOfAction: 'Systemic benzimidazole disrupting fungal beta-tubulin microtubule assembly.',
      safetyPrecautions: 'Wear heavy rubber gloves and apron during sett treatment.'
    },
    prevention: {
      immediate: ['Uproot and burn entire infected cane clumps along with underground root system', 'Avoid using ratoon crops from infected fields'],
      longTerm: ['Plant disease-free tissue-cultured seed cane (Co-0238, Co-86032)', 'Ensure laser land leveling and avoid water stagnation']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '27°C - 32°C with high soil moisture/waterlogging',
      sprayConditions: 'Sett treatment conducted pre-planting under shade.'
    }
  },
  {
    id: 'aphids-sucking-pests',
    name: 'Aphids / Sucking Pests',
    nameHi: 'माहू / चेपा / एफिड कीट (Aphids)',
    nameKn: 'ಗಿಡಹೇನು / ಸಸ್ಯಹೇನು (Aphids)',
    scientificName: 'Lipaphis erysimi / Aphis gossypii / Myzus persicae',
    affectedCrops: ['Mustard', 'Cotton', 'Chilli', 'Wheat', 'Vegetables', 'Pulses'],
    category: 'pest',
    severity: 'Medium',
    symptoms: [
      'Dense colonies of tiny green, yellow, or black soft-bodied insects clustering under leaves and shoot tips',
      'Sticky shiny honeydew droplets excreted on foliage',
      'Black sooty mold fungus growing over sticky honeydew-coated leaves',
      'Curling, puckering, yellowing, and stunted growth of young foliage'
    ],
    differentialDiagnosis: 'Visible clusters of tiny pear-shaped sap-sucking insects with black sooty mold on sticky leaves indicates aphid infestation.',
    organicTreatment: {
      name: 'Neemastra / Dashaparni Ark (5%) + Reetha (Soapnut) Water + Yellow Sticky Traps',
      nameHi: 'नीमास्त्र / दशपर्णी अर्क 5% + रीठा का पानी + पीले चिपचिपे कार्ड',
      nameKn: 'ನೀಮಾಸ್ತ್ರ / ದಶಪರ್ಣಿ ಅರ್ಕ + ಅಂಟುವಾಳ ಕಷಾಯ',
      formulation: '5L Neemastra + 200g boiled soapnut extract + 100L water + 10 yellow sticky traps/acre',
      applicationRate: '200 L / acre',
      method: 'Foliar spray targeting shoot tips and leaf undersides',
      timing: 'Morning or late afternoon',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 150 - ₹ 220 / acre',
      itkSource: 'ICAR National Centre for Integrated Pest Management: Soapnut saponins dissolve protective aphid wax cuticle, leading to rapid dehydration within 6 hours.',
      modeOfAction: 'Saponins break lipid wax coat; azadirachtin halts feeding and moulting.',
      safetyPrecautions: 'Conserve natural biocontrol predators (ladybird beetles, chrysoperla).'
    },
    chemicalTreatment: {
      name: 'Imidacloprid 17.8% SL / Thiamethoxam 25% WG',
      nameHi: 'इमिडाक्लोप्रिड 17.8% एसएल (कॉन्फिडोर)',
      nameKn: 'ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ 17.8% ಎಸ್ಎಲ್',
      activeIngredient: 'Imidacloprid 17.8% SL (0.3 ml/L) OR Thiamethoxam 25% WG (0.4 g/L)',
      applicationRate: '0.3 ml / L water (60 ml / acre in 200L water)',
      method: 'Foliar spray when ETL reaches 25-30 aphids / 10 cm terminal shoot',
      frequency: '1-2 sprays at 15-day intervals',
      withholdingPeriod: '15 days',
      costEstimate: '₹ 280 - ₹ 380 / acre',
      modeOfAction: 'Systemic neonicotinoid blocking postsynaptic nicotinic receptors in insect nervous system.',
      safetyPrecautions: 'Extremely hazardous to honeybees. NEVER spray during active bloom period.'
    },
    prevention: {
      immediate: ['Conserve ladybird beetle grubs and adults (Coccinella septempunctata)', 'Install yellow sticky cards (10/acre)'],
      longTerm: ['Intercrop mustard with chickpea or barley', 'Avoid excessive application of urea which promotes soft succulent growth']
    },
    weatherSensitivity: {
      highHumidityRisk: false,
      rainWashoutRisk: true,
      optimalTempRange: '15°C - 25°C in overcast cloudy weather',
      sprayConditions: 'Spray when wind speeds are < 8 km/h and no rain within 4 hours.'
    }
  },
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm (FAW)',
    nameHi: 'मक्का का फॉल आर्मीवर्म / सैनिक कीट',
    nameKn: 'ಮೆಕ್ಕೆಜೋಳದ ಸೈನಿಕ ಹುಳು (Fall Armyworm)',
    scientificName: 'Spodoptera frugiperda',
    affectedCrops: ['Maize / Corn', 'Sorghum', 'Sugarcane', 'Millets'],
    category: 'pest',
    severity: 'Severe',
    symptoms: [
      'Pin-holes and windowing on young whorl leaves caused by early instar larvae',
      'Extensive ragged ragged chewing damage on central whorl resembling hailstone damage',
      'Abundant coarse yellowish-brown sawdust-like frass packed tightly inside the central leaf whorl',
      'Diagnostic Larval Marking: 4 dark spots arranged in a square on the 8th abdominal segment and an inverted Y-shape on the dark head capsule'
    ],
    differentialDiagnosis: 'Inverted "Y" marking on head, 4 square spots on 8th abdominal segment, and sawdust frass in maize whorl confirm Fall Armyworm.',
    organicTreatment: {
      name: 'Bacillus thuringiensis kurstaki (Bt) 2g/L + Metarhizium rileyi + Sand/Wood Ash Whorl Application',
      nameHi: 'बी.टी. (Bt) 2 ग्राम/लीटर + राख-रेत भराव + नीम अर्क',
      nameKn: 'ಬಿ.ಟಿ. ಜೈವಿಕ ಕೀಟನಾಶಕ + ಬೂದಿ ಮತ್ತು ಮರಳು ಸುರಿಯುವುದು',
      formulation: 'Bt 2g/L water spray OR Dry mixture of Wood Ash (9 parts) + Lime (1 part) placed directly into whorls',
      applicationRate: '200 L / acre spray OR 5 kg ash-lime mix per acre',
      method: 'Direct nozzle spray into leaf whorl funnel OR hand-pinch dry ash into whorl',
      timing: 'Late evening spray (larvae feed actively at night)',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 240 - ₹ 340 / acre',
      itkSource: 'ICAR Indian Institute of Maize Research: Dropping a pinch of fine sand or wood ash into whorls lacerates larval cuticle and prevents feeding.',
      modeOfAction: 'Bt delta-endotoxin crystals dissolve in alkaline larval midgut creating pore lysis.',
      safetyPrecautions: 'Apply Bt in evening to avoid solar UV degradation.'
    },
    chemicalTreatment: {
      name: 'Spinetoram 11.7% SC / Chlorantraniliprole 18.5% SC (Coragen)',
      nameHi: 'स्पिनेटोरम 11.7% एससी (डेलीगेट) या कोराजेन',
      nameKn: 'ಸ್ಪಿನೆಟೋರಮ್ 11.7% ಎಸ್ಸಿ / ಕೊರಾಜೆನ್',
      activeIngredient: 'Spinetoram 11.7% SC (0.5 ml/L) OR Chlorantraniliprole 18.5% SC (0.4 ml/L)',
      applicationRate: '0.5 ml / L water (100 ml / acre in 200L water)',
      method: 'Targeted nozzle directed straight down into each plant whorl funnel',
      frequency: 'Apply when 5-10% of maize seedlings show whorl damage (V3-V6 stage)',
      withholdingPeriod: '14 days',
      costEstimate: '₹ 680 - ₹ 880 / acre',
      modeOfAction: 'Spinosyn neurotoxin allosterically activating nicotinic acetylcholine and GABA receptors.',
      safetyPrecautions: 'Wear full protective gear. Avoid contaminating waterways.'
    },
    prevention: {
      immediate: ['Apply sand/ash whorl drop immediately on first notice of window-paning', 'Erect FAW pheromone traps @ 5/acre for monitoring'],
      longTerm: ['Intercrop maize with cowpea, desmodium, or pigeon pea', 'Deep summer ploughing to expose pupae to predatory birds']
    },
    weatherSensitivity: {
      highHumidityRisk: false,
      rainWashoutRisk: false,
      optimalTempRange: '25°C - 34°C',
      sprayConditions: 'Target whorl funnel where rain wash-off is minimized.'
    }
  },
  {
    id: 'sheath-blight-rice',
    name: 'Sheath Blight of Rice',
    nameHi: 'धान का शीथ ब्लाइट / पर्णच्छद झुलसा',
    nameKn: 'ಭತ್ತದ ಕವಚ ರೋಗ (Sheath Blight)',
    scientificName: 'Rhizoctonia solani',
    affectedCrops: ['Rice / Paddy'],
    category: 'fungal',
    severity: 'High',
    symptoms: [
      'Oval to oblong greenish-grey water-soaked lesions on leaf sheath near water level',
      'Spots enlarge and develop grey-white center with dark reddish-brown margins (snake-skin appearance)',
      'Lesions coalesce and spread upward to upper sheaths and flag leaf',
      'Brown sclerotial bodies (mustard-seed like) develop loosely on infected sheaths'
    ],
    differentialDiagnosis: 'Irregular banded or snake-skin lesions starting near water waterline on sheaths with hard brown sclerotia confirms Sheath Blight.',
    organicTreatment: {
      name: 'Pseudomonas fluorescens (1kg/acre) + Neem Oil Cake Soil Application',
      nameHi: 'स्यूडोमोनास फ्लोरेसेन्स + नीम खली',
      nameKn: 'ಸೂಡೋಮೊನಾಸ್ + ಬೇವಿನ ಹಿಂಡಿ ಬುಡಕ್ಕೆ ಹಾಕುವುದು',
      formulation: '1kg Pseudomonas in 100kg FYM broadcasted at tillering + 2.5g/L foliar spray',
      applicationRate: '200 L / acre foliar spray directed at base',
      method: 'Direct spray at the water-line / base of paddy hills',
      timing: 'Apply at maximum tillering to panicle initiation',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 260 - ₹ 350 / acre',
      itkSource: 'ICAR CRRI Cuttack ITK: Neem cake broadcast @ 150 kg/ha at maximum tillering reduces Rhizoctonia sclerotial floatation and germination by 65%.',
      modeOfAction: 'Pseudomonas synthesizes antibiotic 2,4-diacetylphloroglucinol suppressing Rhizoctonia mycelia.',
      safetyPrecautions: 'Target spray at the lower third of rice hill where humidity is highest.'
    },
    chemicalTreatment: {
      name: 'Validamycin 3% L / Hexaconazole 5% SC / Azoxystrobin + Difenoconazole',
      nameHi: 'वैलिडामाइसिन 3% एल या हेक्साकोनाज़ोल',
      nameKn: 'ವ್ಯಾಲಿಡಾಮೈಸಿನ್ 3% ಎಲ್ / ಹೆಕ್ಸಾಕೊನಾಜೋಲ್',
      activeIngredient: 'Validamycin 3% L (2 ml/L) OR Hexaconazole 5% SC (2 ml/L)',
      applicationRate: '2 ml / L water (400 ml / acre in 200L water)',
      method: 'Direct spray towards base of tillers and water line',
      frequency: 'Repeat after 12-15 days if lesion reaches flag leaf sheath',
      withholdingPeriod: '15 days',
      costEstimate: '₹ 390 - ₹ 510 / acre',
      modeOfAction: 'Validamycin inhibits trehalase enzyme disrupting fungal sugar transport in sheath tissues.',
      safetyPrecautions: 'Wear gloves and face shield. Do not spray during fish-farming in paddy.'
    },
    prevention: {
      immediate: ['Drain floodwater from field for 3-4 days to expose sheath base to air', 'Avoid excess nitrogen top-dressing'],
      longTerm: ['Maintain wider plant spacing (20cm x 15cm) to reduce canopy density', 'Skim and destroy floating sclerotia during final field puddling']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '28°C - 32°C with RH 85-100%',
      sprayConditions: 'Direct spray right onto lower tillers; systemic uptake occurs rapidly.'
    }
  },
  {
    id: 'fusarium-wilt',
    name: 'Fusarium Wilt',
    nameHi: 'फ्यूजेरियम उकठा रोग (Fusarium Wilt)',
    nameKn: 'ಫ್ಯುಸಾರಿಯಮ್ ಸೊರಗು ರೋಗ (Fusarium Wilt)',
    scientificName: 'Fusarium oxysporum',
    affectedCrops: ['Banana (Panama Disease)', 'Pigeon Pea (Arhar)', 'Cotton', 'Tomato', 'Chickpea'],
    category: 'fungal',
    severity: 'Severe',
    symptoms: [
      'Progressive yellowing of lower leaves moving upward along the stem',
      'One-sided leaf chlorosis or branch wilting (unilateral wilting)',
      'Vascular ring exhibits continuous dark brown/reddish discoloration when stem is split',
      'Plant wilts permanently and dies; banana pseudostem splits longitudinally at base'
    ],
    differentialDiagnosis: 'Gradual upward yellowing with dark continuous internal vascular ring browning (without bacterial streaming in water) confirms fungal Fusarium Wilt.',
    organicTreatment: {
      name: 'Trichoderma viride / harzianum (2 kg/acre) + Well-Rotted Farmyard Manure (FYM) + Neem Cake',
      nameHi: 'ट्राइकोडर्मा विरिडे + गोबर खाद + नीम खली',
      nameKn: 'ಟ್ರೈಕೋಡರ್ಮಾ + ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ + ಬೇವಿನ ಹಿಂಡಿ',
      formulation: '2kg Trichoderma multiplied in 100kg moist FYM for 7 days + 50kg Neem cake',
      applicationRate: '150 kg enriched bio-manure / acre broadcasted into furrow/root zone',
      method: 'Soil root-zone incorporation & plant basin drenching (5g/L)',
      timing: 'Apply at sowing/planting and repeat before monsoon',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 380 - ₹ 490 / acre',
      itkSource: 'ICAR NRCB Trichy ITK: Inoculating banana pits with Trichoderma-enriched neem compost reduces Panama disease incidence by 73%.',
      modeOfAction: 'Trichoderma hyperparasitizes Fusarium chlamydospores and secretes chitinase enzymes.',
      safetyPrecautions: 'Ensure soil is moist when applying bio-agents. Never mix with chemical fungicides.'
    },
    chemicalTreatment: {
      name: 'Carbendazim 50% WP Root Drench / Capsule Application',
      nameHi: 'कार्बेन्डाजिम 50% डब्ल्यूपी रूट ड्रेंच',
      nameKn: 'ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಬುಡಕ್ಕೆ ದ್ರಾವಣ ಸುರಿಯುವುದು',
      activeIngredient: 'Carbendazim 50% WP (2 g / L water)',
      applicationRate: '2 g / L water (1-2 L drench per plant basin or 50 mg carbendazim capsule inserted into banana corm)',
      method: 'Soil root drenching around plant basin',
      frequency: 'Repeat at 30-day intervals for infected foci',
      withholdingPeriod: '30 days',
      costEstimate: '₹ 450 - ₹ 580 / acre',
      modeOfAction: 'Systemic tubulin inhibitor preventing fungal hyphal growth inside xylem vessels.',
      safetyPrecautions: 'Wear protective rubber boots and gloves during soil drenching.'
    },
    prevention: {
      immediate: ['Isolate affected plant basin with trenches to stop irrigation water spread', 'Drench lime (500g/pit) to raise soil pH'],
      longTerm: ['Plant resistant cultivars (e.g., Grand Naine, G-9 banana; Asha pigeon pea)', 'Crop rotation with paddy or marigold for 3 seasons']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '25°C - 32°C in acidic, sandy-loam soils',
      sprayConditions: 'Apply soil drench during moist soil conditions.'
    }
  },
  {
    id: 'black-scurf',
    name: 'Black Scurf & Stem Canker',
    nameHi: 'आलू का चेचक / ब्लैक स्कर्फ रोग',
    nameKn: 'ಆಲೂಗಡ್ಡೆ ಕಪ್ಪು ಚುಕ್ಕೆ ರೋಗ (Black Scurf)',
    scientificName: 'Rhizoctonia solani',
    affectedCrops: ['Potato'],
    category: 'fungal',
    severity: 'Medium',
    symptoms: [
      'Hard, irregular black/dark brown crust-like sclerotial bodies adhering tightly to potato tuber skin',
      'Black crust looks like dirt but does not wash off with water ("the dirt that won\'t wash off")',
      'Brown sunken necrotic cankers on underground sprouts causing sprout death before emergence',
      'Aerial tubers formed in leaf axils due to disrupted vascular transport at stem base'
    ],
    differentialDiagnosis: 'Hard black sclerotia on tuber skin that cannot be washed off with water is diagnostic of Black Scurf.',
    organicTreatment: {
      name: 'Trichoderma viride Tuber Treatment + Mustard Bio-Fumigation',
      nameHi: 'ट्राइकोडर्मा बीज उपचार + सरसों हरी खाद',
      nameKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ಬೀಜೋಪಚಾರ + ಸಾಸಿವೆ ಹಸಿರೆಲೆ ಗೊಬ್ಬರ',
      formulation: '10g Trichoderma viride powder per kg seed tuber',
      applicationRate: '1 kg Trichoderma per 100 kg seed tubers',
      method: 'Slurry tuber dip for 20 minutes before air-drying in shade and planting',
      timing: 'Pre-planting seed tuber treatment',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 220 - ₹ 300 / acre',
      itkSource: 'ICAR CPRI Shimla ITK: Incorporating flowering mustard green manure releases allyl isothiocyanates reducing Rhizoctonia soil inoculum by 70%.',
      modeOfAction: 'Trichoderma bio-coating prevents Rhizoctonia sclerotia from infecting emerging sprout tips.',
      safetyPrecautions: 'Dry treated seed tubers in shade before planting; do not expose to direct sun.'
    },
    chemicalTreatment: {
      name: 'Pencycuron 250 SC (Monceren) / Azoxystrobin 23% SC Tuber Spray',
      nameHi: 'पेन्सीक्यूरोन 250 एससी (मॉन्सेरेन)',
      nameKn: 'ಪೆನ್ಸಿಕ್ಯುರಾನ್ 250 ಎಸ್ಸಿ (ಬೀಜೋಪಚಾರ)',
      activeIngredient: 'Pencycuron 250 SC (2.5 ml/L) OR Azoxystrobin (1 ml/L)',
      applicationRate: '2.5 ml Pencycuron per L water (spray 250 ml in 25L water per ton of seed tubers)',
      method: 'Direct fine spray onto seed tubers on conveyor or spread on tarpaulin',
      frequency: 'Single application before planting',
      withholdingPeriod: '75 days',
      costEstimate: '₹ 380 - ₹ 480 / acre',
      modeOfAction: 'Phenylurea fungicide specifically disrupting cell division in Rhizoctonia species.',
      safetyPrecautions: 'Wear gloves and mask. Treat tubers in well-ventilated space.'
    },
    prevention: {
      immediate: ['Avoid deep planting of tubers; plant shallow (5-7 cm) in warm soil to accelerate emergence'],
      longTerm: ['Use certified disease-free seed tubers', 'Adopt 3-year crop rotation with maize or millets']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: false,
      optimalTempRange: '15°C - 23°C in cold, damp soil',
      sprayConditions: 'Tuber treatment conducted indoors/under shade prior to sowing.'
    }
  },
  {
    id: 'bud-rot-coconut',
    name: 'Bud Rot of Coconut / Palm',
    nameHi: 'नारियल का कलिका सड़न / बड रॉट रोग',
    nameKn: 'ತೆಂಗಿನ ಮೊಗ್ಗು ಕೊಳೆ ರೋಗ (Bud Rot)',
    scientificName: 'Phytophthora palmivora',
    affectedCrops: ['Coconut', 'Areca Nut', 'Oil Palm', 'Palmyra'],
    category: 'fungal',
    severity: 'Severe',
    symptoms: [
      'Yellowing and drooping of the youngest spear leaf (central spindle leaf)',
      'Base of the central spindle rots into a soft, foul-smelling brown slimy mass',
      'The central shoot can be pulled out easily from the crown with a slight tug',
      'Outer fronds remain green initially, then drop successively as the palm decapitates'
    ],
    differentialDiagnosis: 'Central spear leaf rots with putrid foul smell and pulls out effortlessly from crown while outer whorls are still green.',
    organicTreatment: {
      name: 'Bordeaux Paste (10%) Crown Application + Trichoderma viride Talc Sachet in Leaf Axils',
      nameHi: 'बोर्डो लेप 10% मुकुट लेपन + ट्राइकोडर्मा पाउच',
      nameKn: 'ಬೋರ್ಡೋ ಪೇಸ್ಟ್ 10% ಸುರಿಯುವುದು + ಟ್ರೈಕೋಡರ್ಮಾ',
      formulation: '1kg Copper Sulphate + 1kg Quick Lime in 10L water (paste consistency)',
      applicationRate: '500g paste applied to cleaned crown cavity after removing rotting tissue',
      method: 'Surgical cleaning of infected bud tissue followed by liberal Bordeaux paste swabbing',
      timing: 'Pre-monsoon (May-June) and post-monsoon (October)',
      withholdingPeriod: '0 days',
      costEstimate: '₹ 120 - ₹ 180 / tree',
      itkSource: 'ICAR CPCRI Kasaragod ITK: Placing a perforated sachet containing 100g neem cake + 50g sand in top leaf axils provides slow-release fungicidal wash with monsoon rains.',
      modeOfAction: 'Copper barrier prevents Phytophthora sporangial entry into vulnerable crown meristem.',
      safetyPrecautions: 'Ensure climber wears safety harness when climbing crown.'
    },
    chemicalTreatment: {
      name: 'Metalaxyl-M + Mancozeb (Ridomil Gold 68% WG) / Potassium Phosphonate (0.3%)',
      nameHi: 'पोटेशियम फॉस्फोनेट्स 0.3% या रिडोमिल गोल्ड',
      nameKn: 'ಪೊಟ್ಯಾಸಿಯಮ್ ಫಾಸ್ಫೊನೇಟ್ / ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್',
      activeIngredient: 'Potassium Phosphonate (Akomin 3ml/L) OR Metalaxyl-M 4% + Mancozeb 64% WG (2g/L)',
      applicationRate: 'Pour 300 ml fungicide solution directly into crown around central spindle',
      method: 'Crown drenching and root feeding (10ml Phosphonate in 10ml water)',
      frequency: '2 applications at 30-day interval during monsoon months',
      withholdingPeriod: '30 days',
      costEstimate: '₹ 140 - ₹ 210 / tree',
      modeOfAction: 'Phosphonate triggers host systemic phytoalexin production and inhibits oomycete hyphae directly.',
      safetyPrecautions: 'Wear face shield and protective apron during crown pour.'
    },
    prevention: {
      immediate: ['Perform surgical removal of dead spear leaf tissue and protect with polythene cap during heavy rains', 'Destroy completely dead crowns to stop spore drift'],
      longTerm: ['Prophylactic crown spraying with 1% Bordeaux mixture before onset of South-West monsoon', 'Maintain optimal orchard drainage']
    },
    weatherSensitivity: {
      highHumidityRisk: true,
      rainWashoutRisk: true,
      optimalTempRange: '18°C - 24°C with continuous monsoon drizzle',
      sprayConditions: 'Cover treated crown with temporary leaf/poly cap if heavy rain is expected within 6 hours.'
    }
  }
];

export function getDiseaseById(id: string): DiseaseEntry | undefined {
  return DISEASE_DATABASE.find(d => d.id.toLowerCase() === id.toLowerCase());
}

export function searchDiseaseByName(query: string): DiseaseEntry | undefined {
  const q = query.toLowerCase().trim();
  return DISEASE_DATABASE.find(d => 
    d.name.toLowerCase().includes(q) ||
    d.scientificName.toLowerCase().includes(q) ||
    (d.nameHi && d.nameHi.toLowerCase().includes(q)) ||
    (d.nameKn && d.nameKn.toLowerCase().includes(q)) ||
    d.id.toLowerCase().includes(q)
  );
}

export function findDiseasesForCrop(crop: string): DiseaseEntry[] {
  const c = crop.toLowerCase().trim();
  return DISEASE_DATABASE.filter(d => 
    d.affectedCrops.some(ac => ac.toLowerCase().includes(c) || c.includes(ac.toLowerCase()))
  );
}
