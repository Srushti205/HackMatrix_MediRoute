import React from 'react';
import { Check } from 'lucide-react';

export default function EmergencyCategoryCard({
  category,
  isSelected,
  onClick,
}) {
  const IconComponent = category.icon;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      className={`relative flex flex-col items-start justify-between p-2.5 sm:p-3 h-[74px] rounded-xl text-left border transition-all duration-150 cursor-pointer select-none group outline-none ${
        isSelected
          ? 'bg-[#E8F6E9] border-[#00A551] shadow-sm ring-1 ring-[#00A551]/30'
          : 'bg-white border-[#E2E8F0] hover:border-[#71BC75]/70 hover:bg-[#F9FCF9] shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Selected Checkmark Badge (top-right) */}
      {isSelected && (
        <span
          className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00A551] text-white flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-100"
          aria-hidden="true"
        >
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}

      {/* Category Icon */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          isSelected
            ? 'bg-[#C3EBD5] text-[#00A551]'
            : 'bg-[#F0F4F8] text-[#5A6578] group-hover:text-[#00A551] group-hover:bg-[#E8F6E9]'
        }`}
        aria-hidden="true"
      >
        <IconComponent className="w-4 h-4 stroke-[2.2]" />
      </div>

      {/* Category Label */}
      <span
        className={`text-[11.5px] font-semibold tracking-tight leading-tight line-clamp-2 transition-colors ${
          isSelected ? 'text-[#007A3D]' : 'text-[#2D3748] group-hover:text-[#00A551]'
        }`}
      >
        {category.label}
      </span>
    </button>
  );
}
