import React from 'react';

export default function MapLegend({ className = '' }) {
  const legendItems = [
    { label: 'Hospital (Within 15km)', color: 'bg-[#00A551]', ring: 'ring-[#E8F6E9]', icon: 'H' },
    { label: 'Regional Hospital (Zoom out)', color: 'bg-[#2563EB]', ring: 'ring-blue-100', icon: 'H' },
    { label: 'Ambulance (Distance written)', color: 'bg-[#00A551]', ring: 'ring-[#E8F6E9]', icon: '🚑' },
    { label: 'Active Incident', color: 'bg-[#EF4444]', ring: 'ring-red-100', icon: '!' },
  ];

  return (
    <div
      className={`bg-white/95 rounded-2xl p-3.5 border border-[#E6ECE3] shadow-[0_4px_16px_rgba(0,0,0,0.06)] select-none text-xs max-w-[210px] ${className}`}
    >
      <div className="font-bold text-[#2A362C] uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between border-b border-[#F0F4EF] pb-1.5">
        <span>Map Legend</span>
        <span className="text-[9px] font-semibold text-[#00A551] bg-[#E8F6E9] px-1.5 py-0.5 rounded">
          15km Zone
        </span>
      </div>

      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[#4A4A4A] font-medium">
            <span
              className={`w-3.5 h-3.5 rounded-full ${item.color} ring-2 ${item.ring} flex items-center justify-center shrink-0`}
            >
              {item.icon && (
                <span className="text-[7.5px] font-bold text-white leading-none">
                  {item.icon}
                </span>
              )}
            </span>
            <span className="text-[11px] text-[#4A4A4A] leading-tight">{item.label}</span>
          </div>
        ))}

        {/* Transit Corridor indicator */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#F0F4EF]">
          <span className="w-5 h-1 rounded-full bg-[#00A551]" />
          <span className="text-[10px] text-[#687280] font-medium leading-tight">
            Ambulance ➔ Hospital Corridor
          </span>
        </div>
      </div>
    </div>
  );
}
