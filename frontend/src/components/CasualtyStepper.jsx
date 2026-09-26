import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function CasualtyStepper({
  value = 1,
  onChange,
}) {
  const handleDecrement = () => {
    if (value > 1 && onChange) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (onChange) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-3.5">
      {/* Stepper control */}
      <div className="inline-flex items-center rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 1}
          aria-label="Decrease casualties"
          className={`w-9 h-9 flex items-center justify-center transition-colors border-r border-[#E2E8F0] ${
            value <= 1
              ? 'text-[#CBD5E1] bg-[#F8FAFC] cursor-not-allowed'
              : 'text-[#4A4A4A] bg-[#F8FAFC] hover:bg-[#EDF2F7] active:bg-[#E2E8F0] cursor-pointer'
          }`}
        >
          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        <div
          aria-live="polite"
          className="w-12 h-9 flex items-center justify-center text-sm font-bold text-[#1A2741] select-none"
        >
          {value}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          aria-label="Increase casualties"
          className="w-9 h-9 flex items-center justify-center text-[#4A4A4A] bg-[#F8FAFC] hover:bg-[#EDF2F7] active:bg-[#E2E8F0] border-l border-[#E2E8F0] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Dynamic textual label */}
      <span className="text-xs font-medium text-[#687280]">
        {value === 1 ? '1 casualty' : `${value} casualties`}
      </span>
    </div>
  );
}
