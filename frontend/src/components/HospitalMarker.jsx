import React from 'react';
import { Cross } from 'lucide-react';

export default function HospitalMarker({ hospital, onSelect }) {
  return (
    <div
      onClick={() => onSelect && onSelect(hospital)}
      className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-[#00A551]/30 hover:border-[#00A551] transition-all cursor-pointer group"
    >
      <span className="w-5 h-5 rounded-lg bg-[#E8F6E9] text-[#00A551] flex items-center justify-center font-bold text-xs">
        <Cross className="w-3.5 h-3.5 text-[#00A551] fill-current" />
      </span>
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-bold text-[#2D3748] whitespace-nowrap leading-tight">
          {hospital.name}
        </span>
        <span className="text-[9px] font-medium text-[#71BC75] leading-none">
          {hospital.availableBeds} beds avail.
        </span>
      </div>
    </div>
  );
}
