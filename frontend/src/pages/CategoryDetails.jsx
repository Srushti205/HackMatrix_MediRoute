import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';
import EmergencyMapPanel from '../components/EmergencyMapPanel';
import CategoryHeader from '../components/category/CategoryHeader';
import QuestionCard from '../components/category/QuestionCard';
import { getCategoryConfig } from '../data/categoryQuestions';
import { useEmergency } from '../context/EmergencyContext';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CategoryDetails() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { basicInfo, updateBasicInfo, categoryAnswers, updateCategoryAnswer } = useEmergency();

  // Shared response type (ALS / BLS)
  const responseType = basicInfo.responseType;
  const handleResponseTypeChange = (val) => updateBasicInfo({ responseType: val });

  // Determine active category from route state or context
  const activeCategoryName =
    routeLocation.state?.selectedEmergencyCategory ||
    basicInfo.selectedEmergencyCategory ||
    'Trauma';

  const config = getCategoryConfig(activeCategoryName);
  const answersForCategory = categoryAnswers[config.id] || {};

  // Validation & feedback state
  const [unansweredFields, setUnansweredFields] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const handleFieldChange = (fieldId, value) => {
    updateCategoryAnswer(config.id, fieldId, value);
    if (unansweredFields.includes(fieldId)) {
      setUnansweredFields((prev) => prev.filter((id) => id !== fieldId));
    }
  };

  const handleUnitChange = (unitKey, unitValue) => {
    updateCategoryAnswer(config.id, unitKey, unitValue);
  };

  const handleBack = () => {
    // Navigate back to Basic Information screen without losing data
    navigate('/new-emergency');
  };

  const handleSubmit = () => {
    // Validate each question in the active category
    const missing = [];

    config.questions.forEach((q) => {
      const val = answersForCategory[q.id];
      if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
        missing.push(q.id);
      }
    });

    if (missing.length > 0) {
      setUnansweredFields(missing);
      return;
    }

    setUnansweredFields([]);
    setToastMessage(`Triage assessment completed for ${config.heading}. Step 3: Nearby Resources coming next.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAF9F5] text-[#4A4A4A] overflow-hidden select-none font-sans">
      {/* ── Top Navbar with Step 2 Active Indicator ── */}
      <TopNavbar showWorkflowProgress={true} currentStep={2} />

      {/* ── Main Application Shell: Sidebar + 2-Panel Content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Sidebar Navigation */}
        <LeftSidebar activeItem="New Emergency" />

        {/* ── 2-PANEL WORKSPACE ── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* ════ LEFT PANEL: Category Questionnaire (~50% width) ════ */}
          <div className="w-full lg:w-[50%] xl:w-[48%] h-full overflow-y-auto p-4 sm:p-5 lg:p-6 bg-[#FAF9F5]">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E6ECE3] shadow-sm p-5 sm:p-6 space-y-6">
              {/* Category Page Header */}
              <CategoryHeader
                config={config}
                responseType={responseType}
                onResponseTypeChange={handleResponseTypeChange}
              />

              {/* Validation alert banner if attempting to submit with unanswered fields */}
              {unansweredFields.length > 0 && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FFF5F5] border border-[#EF4444]/30 text-xs font-semibold text-[#DC2626] animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                  <span>Please complete all required questions to proceed.</span>
                </div>
              )}

              {/* Category Specific Questions List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {config.questions.map((question, index) => {
                  const isWide =
                    question.type === 'select_options' ||
                    question.type === 'text' ||
                    question.type === 'age_input';

                  return (
                    <div
                      key={question.id}
                      className={isWide ? 'sm:col-span-2' : 'col-span-1'}
                    >
                      <QuestionCard
                        index={index}
                        question={question}
                        value={answersForCategory[question.id]}
                        unitValue={question.unitKey ? answersForCategory[question.unitKey] : undefined}
                        onChange={handleFieldChange}
                        onUnitChange={handleUnitChange}
                        hasError={unansweredFields.includes(question.id)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* ── Bottom Actions ── */}
              <div className="pt-4 border-t border-[#F0F4EF] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#687280] hover:text-[#1A2741] hover:bg-[#FAF9F5] active:bg-[#EDF2F7] transition-all cursor-pointer select-none"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00A551] hover:bg-[#008f45] active:bg-[#007b3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
                >
                  <span>Run Triage &amp; Rank Hospitals</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL: Persistent Map View (~50% width) ════ */}
          <div className="w-full lg:w-[50%] xl:w-[52%] h-full relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E6ECE3]">
            <EmergencyMapPanel
              location={basicInfo.location || 'Shivajinagar, Pune, Maharashtra, India'}
            />
          </div>
        </div>
      </div>

      {/* ── Feedback Notification Toast ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#00A551] text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#FFFEC5] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
