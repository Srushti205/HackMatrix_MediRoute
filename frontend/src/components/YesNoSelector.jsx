import React from 'react';
import { Check, X } from 'lucide-react';

export default function YesNoSelector({
  value = true,
  onChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Conscious and breathing normally">
      {/* YES option */}
      <button
        type="button"
        role="radio"
        aria-checked={value === true}
        onClick={() => onChange && onChange(true)}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold tracking-wide transition-all cursor-pointer select-none outline-none ${
          value === true
            ? 'bg-[#E8F6E9] border-[#00A551] text-[#007A3D] shadow-xs ring-1 ring-[#00A551]/25'
            : 'bg-white border-[#E2E8F0] text-[#687280] hover:border-[#71BC75]/50 hover:bg-[#F9FCF9]'
        }`}
      >
        <Check className={`w-4 h-4 stroke-[3] ${value === true ? 'text-[#00A551]' : 'text-[#94A3B8]'}`} />
        <span>YES</span>
      </button>

      {/* NO option */}
      <button
        type="button"
        role="radio"
        aria-checked={value === false}
        onClick={() => onChange && onChange(false)}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold tracking-wide transition-all cursor-pointer select-none outline-none ${
          value === false
            ? 'bg-[#FFF5F5] border-[#EF4444] text-[#DC2626] shadow-xs ring-1 ring-[#EF4444]/25'
            : 'bg-white border-[#E2E8F0] text-[#687280] hover:border-[#EF4444]/40 hover:bg-[#FFF8F8]'
        }`}
      >
        <X className={`w-4 h-4 stroke-[3] ${value === false ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`} />
        <span>NO</span>
      </button>
    </div>
  );
}
