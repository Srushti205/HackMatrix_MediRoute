import React, { useState } from 'react';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import { mockMapData } from '../data/emergencies';
import { Ambulance, Cross, AlertCircle, Building2, MapPin } from 'lucide-react';

export default function MapPlaceholder({
  selectedEmergencyId,
  onSelectEmergency,
  className = '',
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.15, 1.45));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.15, 0.85));
  const handleRecenter = () => {
    setZoomLevel(1);
    setActiveTooltip(null);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[520px] lg:min-h-full overflow-hidden bg-[#EFF3EE] select-none ${className}`}
    >
      {/* ── Scalable Map Canvas Container ── */}
      <div
        className="w-full h-full transition-transform duration-300 origin-center relative"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Realistic SVG Urban Cartography Background */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Base Neutral Terrain */}
          <rect width="1000" height="700" fill="#EFF3EE" />

          {/* Green Parks / Open Areas */}
          <path
            d="M 60 40 Q 180 30 220 110 T 160 210 T 70 170 Z"
            fill="#E1ECE0"
          />
          <path
            d="M 640 450 Q 750 420 830 490 T 790 620 T 670 590 Z"
            fill="#E1ECE0"
          />
          <rect x="360" y="320" width="130" height="110" rx="16" fill="#E1ECE0" />
          <path
            d="M 820 80 Q 940 70 960 160 T 890 240 T 800 170 Z"
            fill="#E1ECE0"
          />

          {/* Waterway / River */}
          <path
            d="M -20 380 C 220 410 320 280 520 310 S 760 210 1020 190 L 1020 230 C 760 250 520 350 320 320 S 220 450 -20 420 Z"
            fill="#D9E7E7"
          />

          {/* Secondary Street Grid (Light Gray/Warm White) */}
          <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            {/* Horizontal streets */}
            <line x1="20" y1="90" x2="980" y2="90" />
            <line x1="20" y1="180" x2="980" y2="180" />
            <line x1="20" y1="270" x2="980" y2="270" />
            <line x1="20" y1="360" x2="980" y2="360" />
            <line x1="20" y1="460" x2="980" y2="460" />
            <line x1="20" y1="550" x2="980" y2="550" />
            <line x1="20" y1="640" x2="980" y2="640" />

            {/* Vertical streets */}
            <line x1="120" y1="20" x2="120" y2="680" />
            <line x1="240" y1="20" x2="240" y2="680" />
            <line x1="360" y1="20" x2="360" y2="680" />
            <line x1="480" y1="20" x2="480" y2="680" />
            <line x1="600" y1="20" x2="600" y2="680" />
            <line x1="720" y1="20" x2="720" y2="680" />
            <line x1="840" y1="20" x2="840" y2="680" />
          </g>

          {/* Main Arterial Highways (Warm Pale Yellow with subtle border) */}
          <g stroke="#FAF8AB" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            {/* Ring Highway */}
            <path
              d="M 120 180 C 350 160 520 90 720 180 S 840 460 720 550 S 240 600 120 460 Z"
              fill="none"
              stroke="#F6F4C4"
              strokeWidth="11"
            />
            {/* Express cross connector */}
            <line x1="80" y1="360" x2="920" y2="360" stroke="#F6F4C4" strokeWidth="10" />
            <line x1="480" y1="60" x2="480" y2="640" stroke="#F6F4C4" strokeWidth="10" />
          </g>

          {/* Active Emergency Dispatch Route for EM-1042 (Pulsing green path) */}
          <g>
            {/* Route Outer Glow */}
            <path
              d="M 500 480 L 540 440 L 600 440 L 620 340"
              stroke="#71BC75"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.5"
            />
            {/* Route Core with Dash */}
            <path
              d="M 500 480 L 540 440 L 600 440 L 620 340"
              stroke="#00A551"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Secondary Route for EM-1043 */}
          <path
            d="M 380 520 L 340 560 L 280 640"
            stroke="#D97706"
            strokeWidth="3"
            strokeDasharray="5 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </svg>

        {/* ── HOSPITAL MARKERS ── */}
        {mockMapData.hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            style={{ left: `${hosp.x}%`, top: `${hosp.y}%` }}
            onClick={() => setActiveTooltip(hosp.name)}
          >
            <div className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-[#00A551]/30 hover:border-[#00A551] transition-all duration-200">
              <span className="w-5 h-5 rounded-lg bg-[#E8F6E9] text-[#00A551] flex items-center justify-center font-bold text-xs">
                <Cross className="w-3.5 h-3.5 text-[#00A551] fill-current" />
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#2D3748] whitespace-nowrap leading-tight">
                  {hosp.name}
                </span>
                <span className="text-[9px] font-medium text-[#71BC75] leading-none">
                  {hosp.availableBeds} beds avail.
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* ── ACTIVE EMERGENCY MARKERS ── */}
        {mockMapData.emergencies.map((em) => {
          const isSelected = selectedEmergencyId === em.id;
          return (
            <div
              key={em.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: `${em.x}%`, top: `${em.y}%` }}
              onClick={() => onSelectEmergency && onSelectEmergency({ id: em.id })}
            >
              <div className="relative flex items-center justify-center">
                {/* Ping rings */}
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-70" />
                <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#EF4444] text-white shadow-lg border-2 border-white ring-2 ring-red-400/50">
                  <AlertCircle className="w-4 h-4" />
                </span>

                {/* Marker Callout Tag */}
                <div
                  className={`absolute bottom-full mb-1.5 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#2D3748] text-white ring-2 ring-[#EF4444]'
                      : 'bg-white text-[#EF4444] border border-red-200'
                  }`}
                >
                  {em.id} &bull; {em.type}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── AMBULANCE MARKERS ── */}
        {mockMapData.ambulances.map((amb) => {
          // Color coding matching legend:
          // En Route: #00A551
          // Assigned: #D97706
          // Available: #71BC75
          const isEnRoute = amb.status === 'En Route';
          const isAssigned = amb.status === 'Assigned';
          const bgClass = isEnRoute
            ? 'bg-[#00A551] text-white'
            : isAssigned
            ? 'bg-[#D97706] text-white'
            : 'bg-[#71BC75] text-white';

          return (
            <div
              key={amb.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-15"
              style={{ left: `${amb.x}%`, top: `${amb.y}%` }}
              onClick={() => setActiveTooltip(`${amb.id} (${amb.status})`)}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full shadow-md border-2 border-white flex items-center justify-center transition-transform group-hover:scale-110 ${bgClass}`}
                >
                  <Ambulance className="w-3.5 h-3.5" />
                </div>
                <span className="mt-0.5 bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#4A4A4A] shadow-sm border border-[#E6ECE3] leading-none whitespace-nowrap">
                  {amb.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FLOATING TOP-RIGHT CONTROLS & MAP LEGEND ── */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-3 pointer-events-auto">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
        />
        <MapLegend />
      </div>

      {/* ── BOTTOM LEFT STATUS WATERMARK (For Google Maps Replacement) ── */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#E6ECE3] text-[11px] text-[#687280] shadow-sm select-none">
        <MapPin className="w-3.5 h-3.5 text-[#00A551]" />
        <span>Central Municipal Dispatch Grid &bull; <strong>Ready for Maps API</strong></span>
      </div>
    </div>
  );
}
