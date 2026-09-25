import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function EmergencyMarker({ emergency, isSelected = false, onSelect }) {
  return (
    <div
      onClick={() => onSelect && onSelect(emergency)}
      className="relative flex items-center justify-center cursor-pointer group"
    >
      {/* Alert Ping Animation */}
      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-70" />
      <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#EF4444] text-white shadow-lg border-2 border-white ring-2 ring-red-400/50">
        <AlertCircle className="w-4 h-4" />
      </span>

      {/* Floating Tag */}
      <div
        className={`absolute bottom-full mb-1.5 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md transition-all ${
          isSelected
            ? 'bg-[#2D3748] text-white ring-2 ring-[#EF4444]'
            : 'bg-white text-[#EF4444] border border-red-200'
        }`}
      >
        {emergency.id} &bull; {emergency.type}
      </div>
    </div>
  );
}
