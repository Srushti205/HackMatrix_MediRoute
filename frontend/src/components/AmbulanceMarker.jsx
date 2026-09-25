import React from 'react';
import { Ambulance } from 'lucide-react';

export default function AmbulanceMarker({ ambulance, onSelect }) {
  const isEnRoute = ambulance.status === 'En Route';
  const isAssigned = ambulance.status === 'Assigned';
  const bgClass = isEnRoute
    ? 'bg-[#00A551] text-white'
    : isAssigned
    ? 'bg-[#D97706] text-white'
    : 'bg-[#71BC75] text-white';

  return (
    <div
      onClick={() => onSelect && onSelect(ambulance)}
      className="flex flex-col items-center cursor-pointer group"
    >
      <div
        className={`w-7 h-7 rounded-full shadow-md border-2 border-white flex items-center justify-center transition-transform group-hover:scale-110 ${bgClass}`}
      >
        <Ambulance className="w-3.5 h-3.5" />
      </div>
      <span className="mt-0.5 bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#4A4A4A] shadow-sm border border-[#E6ECE3] leading-none whitespace-nowrap">
        {ambulance.id}
      </span>
    </div>
  );
}
