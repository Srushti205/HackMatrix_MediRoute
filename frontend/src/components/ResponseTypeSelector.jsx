import React from 'react';

export default function ResponseTypeSelector({ value, onChange, size = 'default' }) {
  const isLarge = size === 'large';
  const baseClasses = isLarge
    ? 'px-7 py-3 rounded-xl text-sm font-bold'
    : 'px-6 py-2.5 rounded-xl text-xs font-bold';

  return (
    <div
      className="inline-flex items-center gap-2.5 select-none"
      role="group"
      aria-label="Response Type Selector"
    >
      {/* ALS Button */}
      <button
        type="button"
        role="radio"
        aria-checked={value === 'ALS'}
        title="Advanced Life Support"
        onClick={() => onChange && onChange('ALS')}
        className={`inline-flex items-center justify-center ${baseClasses} transition-all cursor-pointer select-none outline-none ${
          value === 'ALS'
            ? 'bg-[#DC2626] text-white shadow-md border border-[#DC2626] ring-2 ring-[#DC2626]/25'
            : 'bg-white text-[#DC2626] border-2 border-[#DC2626] hover:bg-[#FEF2F2] shadow-xs'
        }`}
      >
        ALS
      </button>

      {/* BLS Button */}
      <button
        type="button"
        role="radio"
        aria-checked={value === 'BLS'}
        title="Basic Life Support"
        onClick={() => onChange && onChange('BLS')}
        className={`inline-flex items-center justify-center ${baseClasses} transition-all cursor-pointer select-none outline-none ${
          value === 'BLS'
            ? 'bg-[#DC2626] text-white shadow-md border border-[#DC2626] ring-2 ring-[#DC2626]/25'
            : 'bg-white text-[#DC2626] border-2 border-[#DC2626] hover:bg-[#FEF2F2] shadow-xs'
        }`}
      >
        BLS
      </button>
    </div>
  );
}
