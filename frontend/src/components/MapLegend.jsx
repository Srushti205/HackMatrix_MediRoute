import React from 'react';

export default function MapLegend({ className = '' }) {
  const legendItems = [
    { label: 'Hospital', color: 'bg-[#00A551]', ring: 'ring-[#E8F6E9]', icon: 'H' },
    { label: 'Available Ambulance', color: 'bg-[#71BC75]', ring: 'ring-[#E8F6E9]', icon: null },
    { label: 'Assigned Ambulance', color: 'bg-[#D97706]', ring: 'ring-[#FFF7D1]', icon: null },
    { label: 'En Route Ambulance', color: 'bg-[#00A551]', ring: 'ring-[#E8F6E9]', icon: null },
    { label: 'Active Emergency', color: 'bg-[#EF4444]', ring: 'ring-red-100', icon: '!' },
  ];

  return (
    <div
      className={`bg-white/95 rounded-2xl p-4 border border-[#E6ECE3] shadow-[0_4px_16px_rgba(0,0,0,0.06)] select-none text-xs ${className}`}
    >
      <div className="font-bold text-[#2A362C] uppercase tracking-wider text-[11px] mb-2.5 flex items-center justify-between">
        <span>Map Legend</span>
      </div>

      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-[#4A4A4A] font-medium">
            <span className={`w-3.5 h-3.5 rounded-full ${item.color} ring-2 ${item.ring} flex items-center justify-center shrink-0`}>
              {item.icon && (
                <span className="text-[8px] font-bold text-white leading-none">{item.icon}</span>
              )}
            </span>
            <span className="text-xs text-[#4A4A4A]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
