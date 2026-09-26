import React from 'react';
import CircularRadioGroup from './CircularRadioGroup';
import OptionSelector from './OptionSelector';
import TextInputQuestion from './TextInputQuestion';
import { AlertCircle } from 'lucide-react';

export default function QuestionCard({
  index,
  question,
  value,
  unitValue,
  onChange,
  onUnitChange,
  hasError,
}) {
  const renderControl = () => {
    switch (question.type) {
      case 'yes_no':
        return (
          <CircularRadioGroup
            name={question.id}
            options={['Yes', 'No']}
            selectedValue={value}
            onChange={(val) => onChange(question.id, val)}
          />
        );

      case 'radio_options':
        return (
          <CircularRadioGroup
            name={question.id}
            options={question.options}
            selectedValue={value}
            onChange={(val) => onChange(question.id, val)}
          />
        );

      case 'select_options':
        return (
          <OptionSelector
            options={question.options}
            selectedValue={value}
            onChange={(val) => onChange(question.id, val)}
          />
        );

      case 'age_input':
        return (
          <TextInputQuestion
            type="number"
            value={value || ''}
            onChange={(val) => onChange(question.id, val)}
            unitValue={unitValue}
            onUnitChange={(u) => onUnitChange && onUnitChange(question.unitKey, u)}
            units={question.units}
          />
        );

      case 'text':
      default:
        return (
          <TextInputQuestion
            value={value || ''}
            onChange={(val) => onChange(question.id, val)}
            placeholder={question.placeholder}
          />
        );
    }
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
        hasError
          ? 'bg-[#FFF8F8] border-[#EF4444]/40 shadow-xs'
          : 'bg-white border-[#E6ECE3] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#D5E1D2]'
      }`}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <label className="text-xs sm:text-sm font-bold text-[#1A2741] flex items-baseline gap-1.5">
          <span className="text-[#00A551] font-extrabold">{index + 1}.</span>
          <span>{question.label}</span>
          <span className="text-[#EF4444] font-bold" aria-hidden="true">
            *
          </span>
        </label>
      </div>

      {/* Control Component */}
      <div className="pl-4">{renderControl()}</div>

      {/* Inline Validation Error */}
      {hasError && (
        <div className="flex items-center gap-1.5 mt-2.5 pl-4 text-[11px] font-semibold text-[#DC2626] animate-in fade-in duration-100">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {question.type === 'text' || question.type === 'age_input'
              ? 'This field is required.'
              : 'Please select an option.'}
          </span>
        </div>
      )}
    </div>
  );
}
