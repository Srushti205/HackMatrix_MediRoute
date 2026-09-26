import React from 'react';
import { Check } from 'lucide-react';

export default function OptionSelector({
  options = [],
  selectedValue,
  onChange,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup">
      {options.map((opt) => {
        const isSelected = selectedValue === opt;

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange && onChange(opt)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs text-left transition-all cursor-pointer select-none outline-none ${
              isSelected
                ? 'bg-[#E8F6E9] border-[#00A551] text-[#007A3D] font-bold shadow-xs ring-1 ring-[#00A551]/20'
                : 'bg-white border-[#E2E8F0] text-[#4A4A4A] font-medium hover:border-[#71BC75]/60 hover:bg-[#F9FCF9]'
            }`}
          >
            <span>{opt}</span>
            {isSelected && (
              <span className="w-4 h-4 rounded-full bg-[#00A551] text-white flex items-center justify-center shrink-0 ml-1.5 shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
