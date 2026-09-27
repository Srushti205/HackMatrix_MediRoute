export const initialHospitalProfile = {
  id: 'HOSP-01',
  name: 'Ruby Hall Clinic',
  address: '40 Sassoon Road, Sangamvadi, Pune',
  tier: 'Tier 1 · Large Hospital',
  lastUpdated: '2 min ago',
  acceptingPatients: true,
  erQueue: 7,
  ambulancesEnRoute: 1,
};

export const initialCapacityResources = [
  { id: 'er', shortLabel: 'ER Bays', label: 'Emergency Department', available: 5, total: 8, unit: 'bays' },
  { id: 'resus', shortLabel: 'Resus Bays', label: 'Resuscitation Bay', available: 2, total: 4, unit: 'bays' },
  { id: 'icu', shortLabel: 'Adult ICU', label: 'Adult ICU', available: 3, total: 18, unit: 'beds' },
  { id: 'picu', shortLabel: 'PICU', label: 'PICU', available: 2, total: 10, unit: 'beds' },
  { id: 'nicu', shortLabel: 'NICU', label: 'NICU', available: 4, total: 12, unit: 'beds' },
  { id: 'trauma', shortLabel: 'Trauma Bays', label: 'Trauma Capability / Trauma Bay', available: 1, total: 3, unit: 'bays' },
  { id: 'general', shortLabel: 'General Beds', label: 'General / Ward Beds', available: 12, total: 40, unit: 'beds' },
  { id: 'vent-adult', shortLabel: 'Adult Vents', label: 'Adult Ventilator', available: 9, total: 12, unit: 'units' },
  { id: 'vent-ped', shortLabel: 'Peds Vents', label: 'Pediatric / Neonatal Ventilator', available: 5, total: 8, unit: 'units' },
  { id: 'dialysis', shortLabel: 'Dialysis', label: 'Dialysis', available: 4, total: 6, unit: 'slots' },
];

export const initialEquipmentResources = [
  { id: 'ct', label: 'CT Scanner', detail: '24/7 head & trauma imaging', operational: true },
  { id: 'xray', label: 'X-Ray', detail: 'Emergency radiography', operational: true },
  { id: 'ecg', label: 'ECG / Cardiac Monitoring', detail: 'Continuous monitoring', operational: true },
  { id: 'cath', label: 'Cath Lab / PCI', detail: 'Acute cardiac intervention', operational: true },
  { id: 'emergency-ot', label: 'Emergency / Trauma OT', detail: 'Emergency surgery', operational: true },
  { id: 'brain-ot', label: 'Neurosurgery / Brain OT', detail: 'Neuro-surgical emergencies', operational: true },
  { id: 'maternity-ot', label: 'Maternity / Emergency OT', detail: 'Obstetric emergencies', operational: true },
  { id: 'burn', label: 'Burn-Capable Unit', detail: 'Burn isolation & treatment', operational: true },
  { id: 'decon', label: 'Chemical Decontamination', detail: 'Irrigation / exposure response', operational: true },
  { id: 'blood', label: 'Blood Centre / Storage', detail: 'Emergency blood release enabled', operational: true },
  { id: 'mtp', label: 'MTP Capability', detail: 'Massive transfusion protocol', operational: true },
  { id: 'toxicology', label: 'Toxicology / Poisoning', detail: 'Poisoning response', operational: true },
  { id: 'pocus', label: 'POCUS / STAT Basic Lab', detail: 'Rapid bedside diagnostics', operational: true },
];

export const initialSpecialistResources = [
  { id: 'cardiology', label: 'Cardiology', status: 'On site' },
  { id: 'neurology', label: 'Neurology', status: 'On call' },
  { id: 'neurosurgery', label: 'Neurosurgery', status: 'On call' },
  { id: 'orthopaedics', label: 'Orthopaedic Surgery', status: 'On site' },
  { id: 'obstetrician', label: 'Obstetrician', status: 'On site' },
  { id: 'anaesthesia', label: 'Anaesthesia', status: 'On site' },
];

export const initialBloodStock = [
  { group: 'O−', units: 6, critical: true },
  { group: 'O+', units: 18 },
  { group: 'A−', units: 7 },
  { group: 'A+', units: 22 },
  { group: 'B−', units: 5 },
  { group: 'B+', units: 16 },
  { group: 'AB−', units: 3 },
  { group: 'AB+', units: 8 },
];
