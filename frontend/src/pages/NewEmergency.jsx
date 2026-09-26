import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';
import EmergencyCategoryGrid from '../components/EmergencyCategoryGrid';
import LocationSearch from '../components/LocationSearch';
import CasualtyStepper from '../components/CasualtyStepper';
import YesNoSelector from '../components/YesNoSelector';
import AgeInput from '../components/AgeInput';
import EmergencyMapPanel from '../components/EmergencyMapPanel';
import ResponseTypeSelector from '../components/ResponseTypeSelector';
import { useEmergency } from '../context/EmergencyContext';
import { ArrowRight, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewEmergency() {
  const navigate = useNavigate();
  const { basicInfo, updateBasicInfo } = useEmergency();

  const selectedEmergencyCategory = basicInfo.selectedEmergencyCategory;
  const location = basicInfo.location;
  const casualties = basicInfo.casualties;
  const consciousAndBreathing = basicInfo.consciousAndBreathing;
  const age = basicInfo.age;
  const responseType = basicInfo.responseType;

  const setSelectedEmergencyCategory = (val) => updateBasicInfo({ selectedEmergencyCategory: val });
  const handleLocationUpdate = (val) => {
    if (typeof val === 'string') {
      updateBasicInfo({
        location: val,
        patientLocation: {
          address: val,
          latitude: basicInfo.patientLocation?.latitude || 18.5204,
          longitude: basicInfo.patientLocation?.longitude || 73.8567,
        },
      });
    } else if (val && typeof val === 'object') {
      updateBasicInfo({
        location: val.address || '',
        patientLocation: val,
      });
    }
    if (errorMessage) setErrorMessage('');
  };
  const setCasualties = (val) => updateBasicInfo({ casualties: val });
  const setConsciousAndBreathing = (val) => updateBasicInfo({ consciousAndBreathing: val });
  const setAge = (val) => updateBasicInfo({ age: val });
  const setResponseType = (val) => updateBasicInfo({ responseType: val });

  // Validation & Toast state
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleNext = () => {
    // Validate required fields
    if (!selectedEmergencyCategory) {
      setErrorMessage('Please select an emergency category.');
      return;
    }
    if (!location || location.trim() === '' || !basicInfo.patientLocation?.address) {
      setErrorMessage("Please select the patient's location.");
      return;
    }
    if (!casualties || casualties < 1) {
      setErrorMessage('Number of casualties must be at least 1.');
      return;
    }
    if (age === '' || isNaN(age) || age < 0 || age > 130) {
      setErrorMessage('Please enter a valid patient age (0-130).');
      return;
    }

    setErrorMessage('');
    // Navigate to Screen 2 (Category Details) with preserved state
    navigate('/new-emergency/category-details', {
      state: {
        selectedEmergencyCategory,
        patientLocation: basicInfo.patientLocation,
      },
    });
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAF9F5] text-[#4A4A4A] overflow-hidden select-none font-sans">
      {/* ── Top Navbar with Step 1 Active Indicator ── */}
      <TopNavbar showWorkflowProgress={true} currentStep={1} />

      {/* ── Main Application Shell: Sidebar + 2-Panel Content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Sidebar Navigation */}
        <LeftSidebar activeItem="New Emergency" />

        {/* ── 2-PANEL WORKSPACE ── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* ════ LEFT PANEL: Questionnaire Form (~50% width) ════ */}
          <div className="w-full lg:w-[50%] xl:w-[48%] h-full overflow-y-auto p-4 sm:p-5 lg:p-6 bg-[#FAF9F5]">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E6ECE3] shadow-sm p-5 sm:p-6 space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F0F4EF]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2741] tracking-tight">
                      New Emergency
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F6E9] border border-[#71BC75]/30 text-[#00A551] text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A551] animate-pulse" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#687280] mt-1 font-medium">
                    Provide the basic details to locate the patient and identify the type of emergency.
                  </p>
                </div>

                {/* Step pill badge */}
                <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E6ECE3] text-xs font-bold text-[#1A2741]">
                  <span className="text-[#00A551]">1</span>
                  <span className="text-[#94A3B8]">of 4</span>
                </div>
              </div>

              {/* Error banner if validation fails */}
              {errorMessage && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FFF5F5] border border-[#EF4444]/30 text-xs font-semibold text-[#DC2626] animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ── Section 1: Emergency Category ── */}
              <section className="space-y-3">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A2741]">
                    <span className="w-5 h-5 rounded-full bg-[#E8F6E9] text-[#00A551] flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <span>Select the type of emergency</span>
                    <span className="text-[#EF4444] font-bold">*</span>
                  </label>
                  <p className="text-[11.5px] text-[#687280] mt-0.5 ml-7">
                    Choose the category that best describes the situation.
                  </p>
                </div>

                <div className="pt-1">
                  <EmergencyCategoryGrid
                    selectedCategory={selectedEmergencyCategory}
                    onSelectCategory={(cat) => {
                      setSelectedEmergencyCategory(cat);
                      if (errorMessage) setErrorMessage('');
                    }}
                  />
                </div>
              </section>

              {/* ── Section 2: Location / Nearby landmark ── */}
              <section className="space-y-3 pt-2 border-t border-[#F0F4EF]">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A2741]">
                    <span className="w-5 h-5 rounded-full bg-[#E8F6E9] text-[#00A551] flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <span>Location / Nearby landmark</span>
                    <span className="text-[#EF4444] font-bold">*</span>
                  </label>
                  <p className="text-[11.5px] text-[#687280] mt-0.5 ml-7">
                    Search location or nearby landmark, or click on the map.
                  </p>
                </div>

                <div className="pt-1">
                  <LocationSearch
                    locationValue={location}
                    onLocationChange={handleLocationUpdate}
                    onClearLocation={() =>
                      handleLocationUpdate({ address: '', latitude: null, longitude: null })
                    }
                  />
                </div>
              </section>

              {/* ── Section 3: Number of Casualties ── */}
              <section className="space-y-3 pt-2 border-t border-[#F0F4EF]">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A2741]">
                    <span className="w-5 h-5 rounded-full bg-[#E8F6E9] text-[#00A551] flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <span>Number of Casualties</span>
                    <span className="text-[#EF4444] font-bold">*</span>
                  </label>
                  <p className="text-[11.5px] text-[#687280] mt-0.5 ml-7">
                    How many individuals require emergency assistance?
                  </p>
                </div>

                <div className="pt-1 ml-7">
                  <CasualtyStepper
                    value={casualties}
                    onChange={(val) => {
                      setCasualties(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                  />
                </div>
              </section>

              {/* ── Section 4: Conscious and breathing normally? ── */}
              <section className="space-y-3 pt-2 border-t border-[#F0F4EF]">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A2741]">
                    <span className="w-5 h-5 rounded-full bg-[#E8F6E9] text-[#00A551] flex items-center justify-center text-xs font-bold shrink-0">
                      4
                    </span>
                    <span>Conscious and breathing normally?</span>
                    <span className="text-[#EF4444] font-bold">*</span>
                  </label>
                  <p className="text-[11.5px] text-[#687280] mt-0.5 ml-7">
                    Is the patient responsive and breathing without assistance?
                  </p>
                </div>

                <div className="pt-1 ml-7">
                  <YesNoSelector
                    value={consciousAndBreathing}
                    onChange={(val) => setConsciousAndBreathing(val)}
                  />
                </div>
              </section>

              {/* ── Section 5: Age ── */}
              <section className="space-y-3 pt-2 border-t border-[#F0F4EF]">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A2741]">
                    <span className="w-5 h-5 rounded-full bg-[#E8F6E9] text-[#00A551] flex items-center justify-center text-xs font-bold shrink-0">
                      5
                    </span>
                    <span>Age</span>
                    <span className="text-[#EF4444] font-bold">*</span>
                  </label>
                  <p className="text-[11.5px] text-[#687280] mt-0.5 ml-7">
                    Estimated age of the primary patient.
                  </p>
                </div>

                <div className="pt-1 ml-7">
                  <AgeInput
                    value={age}
                    onChange={(val) => {
                      setAge(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                  />
                </div>
              </section>

              {/* ── Bottom Actions ── */}
              <div className="pt-4 border-t border-[#F0F4EF] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#687280] hover:text-[#1A2741] hover:bg-[#FAF9F5] active:bg-[#EDF2F7] transition-all cursor-pointer select-none"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <ResponseTypeSelector
                    value={responseType}
                    onChange={setResponseType}
                  />

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00A551] hover:bg-[#008f45] active:bg-[#007b3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL: Map View (~50% width) ════ */}
          <div className="w-full lg:w-[50%] xl:w-[52%] h-full relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E6ECE3]">
            <EmergencyMapPanel
              location={location}
              patientLocation={basicInfo.patientLocation}
              onLocationSelect={handleLocationUpdate}
            />
          </div>
        </div>
      </div>

      {/* ── Notification Toast ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#00A551] text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#FFFEC5] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
