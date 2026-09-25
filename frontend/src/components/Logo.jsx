import React from 'react';

export default function Logo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Brand Icon + Name */}
      <div className="flex items-center gap-3.5">
        {/* Healthcare cross + leaf motif icon */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8F6E9] via-[#FAF8AB]/50 to-[#E8F6E9] border border-[#71BC75]/30 shadow-sm p-2">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
          >
            {/* Soft background glow */}
            <circle cx="24" cy="24" r="20" fill="#E8F6E9" opacity="0.6" />

            {/* Medical Cross Stem (Vertical) */}
            <rect
              x="20.5"
              y="10"
              width="7"
              height="28"
              rx="3.5"
              fill="#00A551"
            />

            {/* Medical Cross Left Arm (Horizontal) */}
            <rect
              x="10"
              y="20.5"
              width="14"
              height="7"
              rx="3.5"
              fill="#00A551"
            />

            {/* Medical Cross Right Arm with Leaf Motif */}
            <path
              d="M24 20.5H34.5C36.433 20.5 38 22.067 38 24C38 25.933 36.433 27.5 34.5 27.5H24V20.5Z"
              fill="#71BC75"
            />

            {/* Organic Leaf Sprouting Motif curling up from the center */}
            <path
              d="M24 20.5C24 14 31 10 37 11C38 17 33 24 24 24"
              fill="#71BC75"
            />
            {/* Leaf Vein */}
            <path
              d="M24 20.5C28 17 32 14.5 37 11"
              stroke="#FFFEC5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Central core emblem dot */}
            <circle cx="24" cy="24" r="2" fill="#FAF8AB" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col text-left">
          <div className="flex items-center text-3xl font-extrabold tracking-tight">
            <span className="text-[#3A3D40]">Medi</span>
            <span className="text-[#00A551]">Route</span>
          </div>
          <span className="text-xs font-medium text-[#687280] tracking-wider uppercase mt-[-2px]">
            Faster Decisions. Safer Lives.
          </span>
        </div>
      </div>

      {/* Small decorative green/yellow line underneath the logo */}
      <div className="mt-4 flex items-center gap-1.5">
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#71BC75] via-[#FAF8AB] to-[#00A551]" />
        <div className="w-1.5 h-1 rounded-full bg-[#FAF8AB]" />
      </div>
    </div>
  );
}
