import React from 'react';
import EmergencyCard from './EmergencyCard';

export default function EmergencyList({ emergencies = [], selectedEmergencyId, onSelectEmergency }) {
  return (
    <div className="flex flex-col">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-3.5 px-0.5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#00A551]">
          In-Process Emergencies
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F6E9] text-[#00A551] border border-[#71BC75]/30">
          {emergencies.length} Active
        </span>
      </div>

      {/* ── Cards Stack ── */}
      <div className="space-y-3">
        {emergencies.map((emergency) => (
          <EmergencyCard
            key={emergency.id}
            emergency={emergency}
            isSelected={selectedEmergencyId === emergency.id}
            onSelect={onSelectEmergency}
          />
        ))}
      </div>
    </div>
  );
}
