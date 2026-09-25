import React from 'react';
import StatusBadge from './StatusBadge';
import { ArrowRight, Clock, Ambulance, Building2 } from 'lucide-react';

export default function EmergencyCard({ emergency, isSelected = false, onSelect }) {
  const { id, type, status, assignedAmbulance, destinationHospital, eta } = emergency;

  return (
    <div
      onClick={() => onSelect && onSelect(emergency)}
      className={`group relative bg-white rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#00A551] ring-2 ring-[#00A551]/15 shadow-md'
          : 'border-[#E6ECE3] shadow-sm hover:border-[#71BC75]/60 hover:shadow-md'
      }`}
    >
      {/* ── Top: Emergency ID and Status badge ── */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm tracking-tight text-[#2D3748] group-hover:text-[#00A551] transition-colors">
          {id}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* ── Middle: Emergency Type ── */}
      <div className="text-[15px] font-semibold text-[#3A453C] tracking-tight mb-2.5">
        {type}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[#F0F4EF] mb-2.5" />

      {/* ── Bottom: Ambulance → Hospital & ETA ── */}
      <div className="flex items-center justify-between text-xs text-[#687280]">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <span className="inline-flex items-center gap-1 font-medium text-[#4A4A4A] whitespace-nowrap">
            <Ambulance className="w-3.5 h-3.5 text-[#00A551]" />
            {assignedAmbulance}
          </span>
          <ArrowRight className="w-3 h-3 text-[#9CA3AF] shrink-0" />
          <span className="inline-flex items-center gap-1 font-medium text-[#4A4A4A] truncate">
            <Building2 className="w-3.5 h-3.5 text-[#71BC75] shrink-0" />
            <span className="truncate">{destinationHospital}</span>
          </span>
        </div>

        {/* ETA */}
        <div className="inline-flex items-center gap-1 shrink-0 font-semibold text-[#00A551] bg-[#E8F6E9] px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-[#00A551]" />
          <span>ETA: {eta}</span>
        </div>
      </div>
    </div>
  );
}
