import React, { createContext, useContext, useState } from 'react';

const EmergencyContext = createContext(null);

export const DEFAULT_BASIC_INFO = {
  selectedEmergencyCategory: 'Trauma',
  location: 'Shivajinagar, Pune, Maharashtra, India',
  patientLocation: {
    address: 'Shivajinagar, Pune, Maharashtra, India',
    latitude: 18.5314,
    longitude: 73.8446,
  },
  casualties: 1,
  consciousAndBreathing: true,
  age: 28,
  responseType: null, // 'ALS' | 'BLS' | null (initially unselected)
};

export const INITIAL_CATEGORY_ANSWERS = {
  trauma: {
    conscious: null,
    bleeding: null,
    injuryNature: null,
    criticalInjury: null,
  },
  cardiac: {
    severeChestPain: null,
    pressure: null,
    unconscious: null,
    unresponsive: null,
    difficultyBreathing: null,
    cardiacArrest: null,
  },
  respiratory: {
    difficultyBreathing: null,
    asthma: null,
    copd: null,
    swelling: null,
  },
  obstetrics: {
    pregnant: null,
    vaginalBleeding: null,
    severeAbdominalPain: null,
    activeLabour: null,
    previousCSection: null,
    pregnancyComplication: null,
  },
  pediatric: {
    childAge: '',
    childAgeUnit: 'Years',
    conscious: null,
    breathingNormally: null,
    seizure: null,
    severeBleeding: null,
    majorInjury: null,
  },
  poisoning: {
    substance: '',
    amount: '',
    timeSinceExposure: '',
    unconscious: null,
    unresponsive: null,
    difficultyBreathing: null,
  },
  animalBite: {
    snakeBite: null,
    animalBite: null,
    timeSinceBite: '',
    difficultyBreathing: null,
    severeWeakness: null,
    abnormalBleeding: null,
  },
  burns: {
    thermalBurn: null,
    chemicalBurn: null,
    electricalBurn: null,
    difficultyBreathing: null,
    faceNeckBurn: null,
    severeExtensiveBurn: null,
  },
  neurological: {
    suddenWeakness: null,
    difficultySpeaking: null,
    lossOfConsciousness: null,
    seizure: null,
    suddenConfusion: null,
    difficultyBreathing: null,
  },
  electrocution: {
    electricalSourceContact: null,
    lossOfConsciousness: null,
    difficultyBreathing: null,
    visibleBurns: null,
    fallMajorInjury: null,
    unresponsive: null,
  },
};

export function EmergencyProvider({ children }) {
  const [basicInfo, setBasicInfo] = useState(DEFAULT_BASIC_INFO);
  const [categoryAnswers, setCategoryAnswers] = useState(INITIAL_CATEGORY_ANSWERS);

  const updateBasicInfo = (updates) => {
    setBasicInfo((prev) => ({ ...prev, ...updates }));
  };

  const updateCategoryAnswer = (categoryKey, field, value) => {
    setCategoryAnswers((prev) => ({
      ...prev,
      [categoryKey]: {
        ...(prev[categoryKey] || {}),
        [field]: value,
      },
    }));
  };

  const resetAll = () => {
    setBasicInfo(DEFAULT_BASIC_INFO);
    setCategoryAnswers(INITIAL_CATEGORY_ANSWERS);
  };

  return (
    <EmergencyContext.Provider
      value={{
        basicInfo,
        updateBasicInfo,
        categoryAnswers,
        updateCategoryAnswer,
        resetAll,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
