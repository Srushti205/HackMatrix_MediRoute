import React from 'react';

export default function BackgroundDecoration() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10"
      aria-hidden="true"
    >
      {/* ── Top-Left Organic Blob ── */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFFEC5] to-[#E8F6E9] opacity-60 blur-3xl" />

      {/* ── Top-Right Organic Curved Shape ── */}
      <div className="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-[#FAF8AB]/50 via-[#FFFFE2] to-[#E8F6E9]/40 opacity-70 blur-3xl" />

      {/* ── Center Soft Ambient Warmth ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[30rem] rounded-full bg-[#FFFFE2]/60 blur-3xl opacity-50" />

      {/* ── Bottom Ambient Green Accent ── */}
      <div className="absolute -bottom-20 left-1/4 w-[36rem] h-64 rounded-full bg-[#E8F6E9]/70 blur-3xl opacity-60" />

      {/* ── Bottom Skyline, Road & Healthcare Landscape ── */}
      <svg
        viewBox="0 0 1440 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full h-auto max-h-56 object-cover opacity-45 text-[#97B89E]"
        preserveAspectRatio="none"
      >
        {/* Distant faint buildings silhouette */}
        <g opacity="0.35" fill="#C5D9C3">
          {/* Left city block */}
          <rect x="60" y="140" width="34" height="120" rx="2" />
          <rect x="105" y="110" width="48" height="150" rx="3" />
          <rect x="162" y="155" width="28" height="105" rx="2" />
          <rect x="198" y="125" width="40" height="135" rx="3" />

          {/* Windows / Grid pattern */}
          <rect x="114" y="120" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="126" y="120" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="138" y="120" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="114" y="136" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="126" y="136" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="138" y="136" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />

          {/* Right city block */}
          <rect x="1220" y="130" width="44" height="130" rx="2" />
          <rect x="1274" y="95" width="56" height="165" rx="3" />
          <rect x="1340" y="140" width="32" height="120" rx="2" />
          <rect x="1380" y="115" width="45" height="145" rx="2" />

          <rect x="1285" y="105" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="1305" y="105" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="1285" y="122" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
          <rect x="1305" y="122" width="6" height="8" rx="1" fill="#FAF8AB" opacity="0.6" />
        </g>

        {/* Faint Healthcare Cross Watermark / Hospital outline in background */}
        <g opacity="0.28">
          <circle cx="280" cy="180" r="16" fill="#E8F6E9" />
          <rect x="277.5" y="171" width="5" height="18" rx="1" fill="#71BC75" />
          <rect x="271" y="177.5" width="18" height="5" rx="1" fill="#71BC75" />
        </g>

        {/* Delicate rolling hill / green terrain baseline */}
        <path
          d="M0 240 Q 220 200 480 230 T 960 215 T 1440 235 L 1440 260 L 0 260 Z"
          fill="#E2EFE0"
          opacity="0.5"
        />

        {/* Road & Bridge curve connecting across the bottom */}
        <path
          d="M-20 252 C 320 252 460 212 720 220 C 980 228 1140 256 1460 248"
          stroke="#CBDBC8"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        {/* Road dashed center line */}
        <path
          d="M-20 252 C 320 252 460 212 720 220 C 980 228 1140 256 1460 248"
          stroke="#FAF8AB"
          strokeWidth="2"
          strokeDasharray="14 12"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Subtle ECG / Lifeline pulse interwoven along the terrain */}
        <path
          d="M520 220 L 560 220 L 570 205 L 580 235 L 590 195 L 600 225 L 610 220 L 650 220"
          stroke="#71BC75"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.45"
        />

        {/* Stylized rounded trees along the landscape */}
        <g opacity="0.45">
          {/* Left trees cluster */}
          <path d="M 235 242 Q 243 218 251 242 Z" fill="#71BC75" />
          <circle cx="243" cy="222" r="10" fill="#71BC75" />
          <path d="M 252 244 Q 262 216 272 244 Z" fill="#5AA860" />
          <circle cx="262" cy="220" r="12" fill="#5AA860" />

          {/* Center-right trees cluster */}
          <path d="M 850 238 Q 860 210 870 238 Z" fill="#71BC75" />
          <circle cx="860" cy="214" r="11" fill="#71BC75" />
          <path d="M 872 240 Q 880 218 888 240 Z" fill="#5AA860" />
          <circle cx="880" cy="222" r="9" fill="#5AA860" />

          {/* Right trees */}
          <circle cx="1160" cy="230" r="12" fill="#71BC75" />
          <circle cx="1178" cy="232" r="10" fill="#5AA860" />
        </g>
      </svg>
    </div>
  );
}
