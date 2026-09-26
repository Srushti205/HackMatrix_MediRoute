import React from 'react';

export default function ResponseTypeSelector({ value, onChange }) {
  return (
    <div
      className="inline-flex items-center gap-2 select-none"
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
        className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none outline-none ${
          value === 'ALS'
            ? 'bg-[#00A551] text-white shadow-md border border-[#00A551] ring-2 ring-[#00A551]/25'
            : 'bg-white text-[#4A4A4A] border border-[#E2E8F0] hover:border-[#71BC75]/80 hover:text-[#00A551] hover:bg-[#FAF9F5] shadow-xs'
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
        className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none outline-none ${
          value === 'BLS'
            ? 'bg-[#00A551] text-white shadow-md border border-[#00A551] ring-2 ring-[#00A551]/25'
            : 'bg-white text-[#4A4A4A] border border-[#E2E8F0] hover:border-[#71BC75]/80 hover:text-[#00A551] hover:bg-[#FAF9F5] shadow-xs'
        }`}
      >
        BLS
      </button>
    </div>
  );
}
