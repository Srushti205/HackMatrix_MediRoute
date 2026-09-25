import React from 'react';

export default function DispatcherIllustration({ className = '' }) {
  return (
    <div className={`w-full flex items-center justify-center p-3 select-none ${className}`}>
      <svg
        viewBox="0 0 340 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-48 drop-shadow-sm"
      >
        {/* Soft Circular Backdrop */}
        <circle cx="170" cy="110" r="95" fill="#E8F6E9" />
        <circle cx="185" cy="85" r="45" fill="#FFFEC5" opacity="0.6" />

        {/* Dispatch Console Desk */}
        <path
          d="M 35 180 L 305 180 C 308 180 310 182 310 185 L 306 195 C 305 197 302 198 300 198 L 40 198 C 38 198 35 197 34 195 L 30 185 C 30 182 32 180 35 180 Z"
          fill="#D6E2D5"
        />
        {/* Desk top bevel line */}
        <line x1="38" y1="183" x2="302" y2="183" stroke="#FAF8AB" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* ── LEFT MONITOR (Telemetry / Emergency Queue) ── */}
        <g transform="translate(42, 68)">
          {/* Stand */}
          <rect x="36" y="75" width="10" height="25" rx="2" fill="#8FA491" />
          <path d="M 28 100 L 54 100 L 50 106 L 32 106 Z" fill="#758B78" />
          {/* Bezel */}
          <rect x="0" y="0" width="82" height="78" rx="7" fill="#3D4B3E" />
          {/* Screen */}
          <rect x="4" y="4" width="74" height="70" rx="4" fill="#202A21" />

          {/* Incoming Emergency Queue bars */}
          <rect x="9" y="10" width="32" height="4" rx="2" fill="#FAF8AB" />
          <rect x="9" y="18" width="64" height="12" rx="3" fill="#2C3B2E" />
          <circle cx="15" cy="24" r="3" fill="#EF4444" />
          <rect x="22" y="22" width="34" height="4" rx="1.5" fill="#E8F6E9" opacity="0.8" />
          <rect x="60" y="21" width="10" height="6" rx="2" fill="#71BC75" />

          {/* Queue Item 2 */}
          <rect x="9" y="34" width="64" height="12" rx="3" fill="#2C3B2E" />
          <circle cx="15" cy="40" r="3" fill="#00A551" />
          <rect x="22" y="38" width="40" height="4" rx="1.5" fill="#E8F6E9" opacity="0.8" />

          {/* Audio / Radio dispatch waveform */}
          <rect x="9" y="52" width="64" height="16" rx="3" fill="#172218" />
          <line x1="14" y1="60" x2="14" y2="60" stroke="#71BC75" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="58" x2="18" y2="62" stroke="#71BC75" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="55" x2="22" y2="65" stroke="#00A551" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="57" x2="26" y2="63" stroke="#FAF8AB" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="54" x2="30" y2="66" stroke="#00A551" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="58" x2="34" y2="62" stroke="#71BC75" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="59" x2="38" y2="61" stroke="#71BC75" strokeWidth="2" strokeLinecap="round" />
          <circle cx="64" cy="60" r="3" fill="#00A551" />
        </g>

        {/* ── CENTER MAIN MONITOR (Emergency City GPS & Dispatch Map) ── */}
        <g transform="translate(108, 40)">
          {/* Main Stand */}
          <rect x="56" y="105" width="12" height="35" rx="3" fill="#6A806D" />
          <path d="M 44 138 L 80 138 C 82 138 84 140 83 143 L 81 146 C 80 147 78 148 76 148 L 48 148 C 46 148 44 147 43 146 L 41 143 C 40 140 42 138 44 138 Z" fill="#4E6150" />

          {/* Monitor Frame */}
          <rect x="0" y="0" width="124" height="106" rx="8" fill="#2E3B30" stroke="#3D4B3E" strokeWidth="2" />
          {/* Screen with Map */}
          <rect x="5" y="5" width="114" height="96" rx="5" fill="#EAF3E9" />

          {/* City Grid Road Network */}
          <path
            d="M 10 35 L 115 35 M 10 65 L 115 65 M 35 10 L 35 95 M 70 10 L 70 95 M 95 10 L 95 95"
            stroke="#D2E3D0"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Secondary road curves */}
          <path
            d="M 15 80 C 40 80 50 45 80 40 S 110 20 115 20"
            stroke="#C0DAC0"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Green zones / parks in map */}
          <rect x="14" y="14" width="18" height="18" rx="3" fill="#BEE2BE" opacity="0.7" />
          <rect x="74" y="70" width="18" height="20" rx="3" fill="#BEE2BE" opacity="0.7" />

          {/* Active Route in Primary Green */}
          <path
            d="M 35 65 L 70 65 L 70 40 L 95 40"
            stroke="#00A551"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Ambulance GPS Pin (Start) */}
          <circle cx="35" cy="65" r="4.5" fill="#00A551" />
          <circle cx="35" cy="65" r="7" stroke="#71BC75" strokeWidth="1.5" opacity="0.8" />

          {/* Emergency Incident Beacon (Destination) */}
          <circle cx="95" cy="40" r="5" fill="#EF4444" />
          <circle cx="95" cy="40" r="8.5" stroke="#EF4444" strokeWidth="1.2" opacity="0.6" strokeDasharray="2 2" />

          {/* Hospital Waypoint */}
          <rect x="67" y="37" width="6" height="6" rx="1" fill="#FAF8AB" stroke="#00A551" strokeWidth="1" />

          {/* On-screen HUD Dispatch Status pill */}
          <rect x="10" y="8" width="46" height="12" rx="3" fill="#1C271E" opacity="0.85" />
          <circle cx="16" cy="14" r="2.5" fill="#71BC75" />
          <rect x="22" y="12" width="28" height="4" rx="1" fill="#FFFFFF" />
        </g>

        {/* ── RIGHT MONITOR (Hospital Resource Availability & Beds) ── */}
        <g transform="translate(216, 68)">
          {/* Stand */}
          <rect x="36" y="75" width="10" height="25" rx="2" fill="#8FA491" />
          <path d="M 28 100 L 54 100 L 50 106 L 32 106 Z" fill="#758B78" />
          {/* Bezel */}
          <rect x="0" y="0" width="82" height="78" rx="7" fill="#3D4B3E" />
          {/* Screen */}
          <rect x="4" y="4" width="74" height="70" rx="4" fill="#202A21" />

          {/* Header */}
          <rect x="10" y="10" width="38" height="4" rx="2" fill="#71BC75" />

          {/* Resource Stat Ring / Donut */}
          <circle cx="28" cy="36" r="14" stroke="#374839" strokeWidth="4" fill="none" />
          <circle
            cx="28"
            cy="36"
            r="14"
            stroke="#00A551"
            strokeWidth="4"
            fill="none"
            strokeDasharray="88"
            strokeDashoffset="26"
            strokeLinecap="round"
            transform="rotate(-90 28 36)"
          />
          <text x="28" y="39" textAnchor="middle" fill="#FAF8AB" fontSize="8" fontWeight="bold" fontFamily="sans-serif">84%</text>

          {/* Capacity Bars */}
          <rect x="48" y="24" width="22" height="3" rx="1.5" fill="#FAF8AB" opacity="0.9" />
          <rect x="48" y="32" width="26" height="3" rx="1.5" fill="#71BC75" opacity="0.9" />
          <rect x="48" y="40" width="18" height="3" rx="1.5" fill="#E8F6E9" opacity="0.6" />

          {/* System status graph */}
          <rect x="9" y="55" width="64" height="14" rx="2" fill="#263428" />
          <path
            d="M 12 65 L 24 63 L 34 66 L 46 59 L 56 61 L 68 57"
            stroke="#FAF8AB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* ── DESK ACCESSORIES (Keyboard, Mouse, Headset) ── */}
        {/* Keyboard */}
        <rect x="135" y="184" width="70" height="9" rx="2" fill="#FFFFFF" stroke="#CCDBCB" strokeWidth="1" />
        <line x1="140" y1="188.5" x2="200" y2="188.5" stroke="#A7C2A6" strokeWidth="2.5" strokeDasharray="3 2" />

        {/* Mouse & Pad */}
        <rect x="216" y="185" width="18" height="8" rx="2" fill="#E2EEE1" />
        <ellipse cx="225" cy="189" rx="4" ry="3" fill="#71BC75" />

        {/* Headset on Desk Left */}
        <path
          d="M 90 188 C 86 182 102 182 98 188"
          stroke="#4A5A4C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="89" cy="189" r="3" fill="#00A551" />
        <circle cx="99" cy="189" r="3" fill="#00A551" />

        {/* Control Center Status LED on Desk */}
        <circle cx="60" cy="189" r="2.5" fill="#00A551" />
        <circle cx="68" cy="189" r="2.5" fill="#FAF8AB" />
      </svg>
    </div>
  );
}
