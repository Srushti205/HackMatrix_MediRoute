import React from 'react';

export default function HospitalIllustration({ className = '' }) {
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
        <circle cx="150" cy="80" r="48" fill="#FFFEC5" opacity="0.65" />

        {/* ── GROUND & ROADWAY ── */}
        {/* Green lawn mound */}
        <path
          d="M 20 185 Q 170 160 320 185 L 320 205 L 20 205 Z"
          fill="#D9EBD8"
        />

        {/* Hospital approach driveway / road */}
        <path
          d="M 40 200 C 110 190 230 190 300 200 L 305 208 L 35 208 Z"
          fill="#C4D7C2"
        />
        <line x1="100" y1="202" x2="240" y2="202" stroke="#FAF8AB" strokeWidth="2" strokeDasharray="10 8" />

        {/* ── HOSPITAL BUILDING ── */}
        {/* Rear Wing / Secondary Tower */}
        <rect x="75" y="60" width="70" height="120" rx="4" fill="#E1ECE0" />
        {/* Rear Wing Windows */}
        <rect x="85" y="72" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="104" y="72" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="123" y="72" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="85" y="94" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="104" y="94" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="123" y="94" width="12" height="14" rx="2" fill="#C6DCC5" />

        {/* Main Hospital Center Complex */}
        <rect x="120" y="38" width="115" height="144" rx="6" fill="#FFFFFF" stroke="#D3E4D1" strokeWidth="1.5" />

        {/* Rooftop Helipad Structure */}
        <rect x="150" y="28" width="55" height="10" rx="2" fill="#4B634E" />
        <circle cx="177" cy="33" r="3.5" fill="#FAF8AB" />
        <line x1="140" y1="38" x2="215" y2="38" stroke="#71BC75" strokeWidth="2" />

        {/* Prominent Red Medical Cross on facade */}
        <circle cx="177" cy="62" r="14" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="2" />
        <rect x="174" y="53" width="6" height="18" rx="2" fill="#EF4444" />
        <rect x="168" y="59" width="18" height="6" rx="2" fill="#EF4444" />

        {/* Hospital Floor Bands / Windows Rows */}
        {/* Floor 3 */}
        <g transform="translate(132, 85)">
          <rect x="0" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
          <rect x="24" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
          <rect x="48" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
          <rect x="72" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
        </g>

        {/* Floor 2 */}
        <g transform="translate(132, 108)">
          <rect x="0" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
          <rect x="24" y="0" width="18" height="15" rx="2" fill="#FAF8AB" opacity="0.8" />
          <rect x="48" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
          <rect x="72" y="0" width="18" height="15" rx="2" fill="#D3EADE" />
        </g>

        {/* Floor 1 / Ground Entrance Canopy (Emergency Department) */}
        <rect x="142" y="142" width="72" height="40" rx="3" fill="#F4F9F3" />
        {/* Red emergency banner sign */}
        <rect x="150" y="138" width="56" height="7" rx="2" fill="#00A551" />
        <rect x="156" y="140" width="44" height="3" rx="1" fill="#FFFFFF" />

        {/* Glass Automatic Sliding Doors */}
        <rect x="160" y="152" width="36" height="30" rx="2" fill="#A8D6BB" opacity="0.6" />
        <line x1="178" y1="152" x2="178" y2="182" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Side Emergency Bay Wing (Right) */}
        <rect x="235" y="90" width="45" height="92" rx="4" fill="#EAF3E9" stroke="#D3E4D1" strokeWidth="1" />
        <rect x="244" y="102" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="260" y="102" width="12" height="14" rx="2" fill="#FAF8AB" opacity="0.7" />
        <rect x="244" y="124" width="12" height="14" rx="2" fill="#C6DCC5" />
        <rect x="260" y="124" width="12" height="14" rx="2" fill="#C6DCC5" />
        {/* Ambulance Bay Door */}
        <rect x="244" y="154" width="28" height="28" rx="2" fill="#718E74" />
        <line x1="244" y1="162" x2="272" y2="162" stroke="#5C7560" strokeWidth="1" />
        <line x1="244" y1="170" x2="272" y2="170" stroke="#5C7560" strokeWidth="1" />

        {/* ── TREES & LANDSCAPE ACCENTS ── */}
        {/* Left trees */}
        <rect x="52" y="160" width="4" height="24" rx="1" fill="#75614F" />
        <circle cx="54" cy="150" r="16" fill="#71BC75" />
        <circle cx="50" cy="144" r="10" fill="#88D48C" opacity="0.8" />

        <rect x="36" y="168" width="3.5" height="18" rx="1" fill="#75614F" />
        <circle cx="38" cy="160" r="12" fill="#00A551" />

        {/* Right side tree */}
        <rect x="295" y="162" width="4" height="22" rx="1" fill="#75614F" />
        <circle cx="297" cy="152" r="14" fill="#71BC75" />
        <circle cx="294" cy="148" r="9" fill="#FAF8AB" opacity="0.5" />

        {/* Small decorative bushes */}
        <ellipse cx="74" cy="182" rx="9" ry="6" fill="#88D48C" />
        <ellipse cx="230" cy="182" rx="8" ry="5" fill="#88D48C" />

        {/* ── AMBULANCE VEHICLE ── */}
        <g transform="translate(68, 162)">
          {/* Vehicle Drop Shadow */}
          <ellipse cx="44" cy="27" rx="38" ry="4" fill="#9FB59F" opacity="0.5" />

          {/* Main Ambulance Box Body */}
          <rect x="18" y="4" width="56" height="20" rx="3" fill="#FFFFFF" stroke="#CADBCA" strokeWidth="1" />

          {/* Cab front */}
          <path
            d="M 68 8 L 78 12 L 80 24 L 68 24 Z"
            fill="#FFFFFF"
            stroke="#CADBCA"
            strokeWidth="1"
          />

          {/* Windshield */}
          <path
            d="M 69 10 L 76 13 L 77 17 L 69 17 Z"
            fill="#91CBB3"
          />

          {/* Emergency Stripe along side */}
          <rect x="18" y="14" width="60" height="4" fill="#00A551" />
          {/* Sub-stripe */}
          <rect x="18" y="18.5" width="60" height="1" fill="#FAF8AB" />

          {/* Red Cross on ambulance box side */}
          <rect x="36" y="7" width="2" height="6" fill="#EF4444" />
          <rect x="34" y="9" width="6" height="2" fill="#EF4444" />

          {/* Rear Window */}
          <rect x="22" y="7" width="6" height="5" rx="1" fill="#B3D9C9" />

          {/* Emergency Siren Light on Roof */}
          <rect x="70" y="2" width="6" height="3" rx="1" fill="#EF4444" />
          <line x1="73" y1="0.5" x2="73" y2="2" stroke="#FAF8AB" strokeWidth="1" />

          {/* Front Headlight */}
          <circle cx="79.5" cy="19.5" r="1.5" fill="#FAF8AB" />

          {/* Wheels */}
          <circle cx="32" cy="24" r="5" fill="#3D4B3E" />
          <circle cx="32" cy="24" r="2.5" fill="#CADBCA" />

          <circle cx="68" cy="24" r="5" fill="#3D4B3E" />
          <circle cx="68" cy="24" r="2.5" fill="#CADBCA" />
        </g>
      </svg>
    </div>
  );
}
