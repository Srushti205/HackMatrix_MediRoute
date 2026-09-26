import {
  Activity,
  Heart,
  Wind,
  Baby,
  Pill,
  PawPrint,
  Flame,
  Brain,
  Zap,
} from 'lucide-react';

export const CATEGORY_CONFIGS = {
  trauma: {
    id: 'trauma',
    matchKeys: ['trauma'],
    heading: 'Trauma Emergency',
    badgeLabel: 'TRAUMA',
    icon: Activity,
    questions: [
      {
        id: 'conscious',
        label: 'Conscious and responding?',
        type: 'yes_no',
      },
      {
        id: 'bleeding',
        label: 'Bleeding',
        type: 'radio_options',
        options: ['Heavy', 'Controlled'],
      },
      {
        id: 'injuryNature',
        label: 'Nature of injury',
        type: 'select_options',
        options: ['Vehicle crash', 'Crush injury', 'Fall from height', 'None of the above'],
      },
      {
        id: 'criticalInjury',
        label: 'Possibility of critical injury',
        type: 'select_options',
        options: ['Head injury', 'Neck injury', 'Spine injury', 'None / Not known'],
      },
    ],
  },

  cardiac: {
    id: 'cardiac',
    matchKeys: ['cardiac', 'cardiac arrest'],
    heading: 'Cardiac Emergency',
    badgeLabel: 'CARDIAC EMERGENCY',
    icon: Heart,
    questions: [
      { id: 'severeChestPain', label: 'Severe chest pain?', type: 'yes_no' },
      { id: 'pressure', label: 'Pressure?', type: 'yes_no' },
      { id: 'unconscious', label: 'Unconscious?', type: 'yes_no' },
      { id: 'unresponsive', label: 'Unresponsive?', type: 'yes_no' },
      { id: 'difficultyBreathing', label: 'Severe difficulty breathing?', type: 'yes_no' },
      { id: 'cardiacArrest', label: 'Cardiac arrest?', type: 'yes_no' },
    ],
  },

  respiratory: {
    id: 'respiratory',
    matchKeys: ['respiratory'],
    heading: 'Respiratory Emergency',
    badgeLabel: 'RESPIRATORY EMERGENCY',
    icon: Wind,
    questions: [
      { id: 'difficultyBreathing', label: 'Severe difficulty breathing?', type: 'yes_no' },
      { id: 'asthma', label: 'Asthma?', type: 'yes_no' },
      { id: 'copd', label: 'COPD?', type: 'yes_no' },
      { id: 'swelling', label: 'Swelling of the face, lips, or throat?', type: 'yes_no' },
    ],
  },

  obstetrics: {
    id: 'obstetrics',
    matchKeys: ['obstetrics / pregnancy', 'obstetrics', 'pregnancy'],
    heading: 'Pregnancy / Obstetric Emergency',
    badgeLabel: 'PREGNANCY / OBSTETRIC',
    icon: Baby,
    questions: [
      { id: 'pregnant', label: 'Pregnant?', type: 'yes_no' },
      { id: 'vaginalBleeding', label: 'Vaginal bleeding?', type: 'yes_no' },
      { id: 'severeAbdominalPain', label: 'Severe abdominal pain?', type: 'yes_no' },
      { id: 'activeLabour', label: 'Active labour?', type: 'yes_no' },
      { id: 'previousCSection', label: 'Previous C-section?', type: 'yes_no' },
      { id: 'pregnancyComplication', label: 'Pregnancy complication?', type: 'yes_no' },
    ],
  },

  pediatric: {
    id: 'pediatric',
    matchKeys: ['neonatal / pediatric', 'pediatric', 'neonatal'],
    heading: 'Neonatal / Pediatric Emergency',
    badgeLabel: 'NEONATAL / PEDIATRIC',
    icon: Baby,
    questions: [
      {
        id: 'childAge',
        label: 'Child age:',
        type: 'age_input',
        unitKey: 'childAgeUnit',
        units: ['Years', 'Months', 'Days'],
      },
      { id: 'conscious', label: 'Conscious / Responding?', type: 'yes_no' },
      { id: 'breathingNormally', label: 'Breathing normally?', type: 'yes_no' },
      { id: 'seizure', label: 'Seizure?', type: 'yes_no' },
      { id: 'severeBleeding', label: 'Severe bleeding?', type: 'yes_no' },
      { id: 'majorInjury', label: 'Major injury?', type: 'yes_no' },
    ],
  },

  poisoning: {
    id: 'poisoning',
    matchKeys: ['poisoning / intoxication', 'poisoning', 'intoxication'],
    heading: 'Poisoning / Intoxication',
    badgeLabel: 'POISONING / INTOXICATION',
    icon: Pill,
    questions: [
      {
        id: 'substance',
        label: 'Substance taken / exposed to:',
        type: 'text',
        placeholder: 'e.g. Household chemical, medicine, pesticide',
      },
      {
        id: 'amount',
        label: 'Amount taken / exposed to:',
        type: 'text',
        placeholder: 'e.g. 50ml, 2 tablets, unknown',
      },
      {
        id: 'timeSinceExposure',
        label: 'Time since exposure:',
        type: 'text',
        placeholder: 'e.g. 30 mins ago, 2 hours',
      },
      { id: 'unconscious', label: 'Unconscious?', type: 'yes_no' },
      { id: 'unresponsive', label: 'Unresponsive?', type: 'yes_no' },
      { id: 'difficultyBreathing', label: 'Difficulty breathing?', type: 'yes_no' },
    ],
  },

  animalBite: {
    id: 'animalBite',
    matchKeys: ['animal bite', 'snake / animal bite', 'snake bite'],
    heading: 'Snake / Animal Bite',
    badgeLabel: 'SNAKE / ANIMAL BITE',
    icon: PawPrint,
    questions: [
      { id: 'snakeBite', label: 'Snake bite?', type: 'yes_no' },
      { id: 'animalBite', label: 'Animal bite?', type: 'yes_no' },
      {
        id: 'timeSinceBite',
        label: 'Time since bite:',
        type: 'text',
        placeholder: 'e.g. 15 mins ago, 1 hour',
      },
      { id: 'difficultyBreathing', label: 'Difficulty breathing?', type: 'yes_no' },
      { id: 'severeWeakness', label: 'Severe weakness?', type: 'yes_no' },
      { id: 'abnormalBleeding', label: 'Abnormal bleeding?', type: 'yes_no' },
    ],
  },

  burns: {
    id: 'burns',
    matchKeys: ['burns', 'burn'],
    heading: 'Burn Emergency',
    badgeLabel: 'BURN EMERGENCY',
    icon: Flame,
    questions: [
      { id: 'thermalBurn', label: 'Thermal burn?', type: 'yes_no' },
      { id: 'chemicalBurn', label: 'Chemical burn?', type: 'yes_no' },
      { id: 'electricalBurn', label: 'Electrical burn?', type: 'yes_no' },
      { id: 'difficultyBreathing', label: 'Difficulty breathing?', type: 'yes_no' },
      { id: 'faceNeckBurn', label: 'Face / Neck burn?', type: 'yes_no' },
      { id: 'severeExtensiveBurn', label: 'Severe / Extensive burn?', type: 'yes_no' },
    ],
  },

  neurological: {
    id: 'neurological',
    matchKeys: ['neurological'],
    heading: 'Neurological Emergency',
    badgeLabel: 'NEUROLOGICAL EMERGENCY',
    icon: Brain,
    questions: [
      { id: 'suddenWeakness', label: 'Sudden weakness / Numbness?', type: 'yes_no' },
      { id: 'difficultySpeaking', label: 'Difficulty speaking?', type: 'yes_no' },
      { id: 'lossOfConsciousness', label: 'Loss of consciousness?', type: 'yes_no' },
      { id: 'seizure', label: 'Seizure?', type: 'yes_no' },
      { id: 'suddenConfusion', label: 'Sudden confusion?', type: 'yes_no' },
      { id: 'difficultyBreathing', label: 'Difficulty breathing?', type: 'yes_no' },
    ],
  },

  electrocution: {
    id: 'electrocution',
    matchKeys: ['electrocution', 'electrocution / lightning', 'lightning'],
    heading: 'Electrocution / Lightning',
    badgeLabel: 'ELECTROCUTION / LIGHTNING',
    icon: Zap,
    questions: [
      { id: 'electricalSourceContact', label: 'Electrical source contact?', type: 'yes_no' },
      { id: 'lossOfConsciousness', label: 'Loss of consciousness?', type: 'yes_no' },
      { id: 'difficultyBreathing', label: 'Difficulty breathing?', type: 'yes_no' },
      { id: 'visibleBurns', label: 'Visible burns?', type: 'yes_no' },
      { id: 'fallMajorInjury', label: 'Fall / Major injury?', type: 'yes_no' },
      { id: 'unresponsive', label: 'Unresponsive?', type: 'yes_no' },
    ],
  },
};

export function getCategoryConfig(categoryName) {
  if (!categoryName) return CATEGORY_CONFIGS.trauma;
  const normalized = categoryName.trim().toLowerCase();

  for (const key of Object.keys(CATEGORY_CONFIGS)) {
    const config = CATEGORY_CONFIGS[key];
    if (config.matchKeys.some((k) => normalized.includes(k) || k.includes(normalized))) {
      return config;
    }
  }

  return CATEGORY_CONFIGS.trauma;
}
