import React from 'react';

export default function CircularRadioGroup({
  name,
  options = ['Yes', 'No'],
  selectedValue,
  onChange,
}) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap" role="radiogroup">
      {options.map((opt) => {
        const isSelected = selectedValue === opt;

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange && onChange(opt)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer select-none outline-none ${
              isSelected
                ? 'bg-[#E8F6E9] border-[#00A551] text-[#007A3D] font-bold shadow-xs ring-1 ring-[#00A551]/20'
                : 'bg-white border-[#E2E8F0] text-[#687280] font-medium hover:border-[#71BC75]/60 hover:bg-[#F9FCF9]'
            }`}
          >
            {/* Circular Radio Indicator: ○ vs ● */}
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                isSelected
                  ? 'border-[#00A551] bg-[#00A551]'
                  : 'border-[#CBD5E1] bg-white'
              }`}
              aria-hidden="true"
            >
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>

            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
