import React from 'react';

export default function AgeInput({
  value = 28,
  onChange,
}) {
  const handleChange = (e) => {
    const raw = e.target.value;
    // Allow empty during typing or positive integers
    if (raw === '') {
      if (onChange) onChange('');
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 130) {
      if (onChange) onChange(parsed);
    }
  };

  return (
    <div className="flex items-center w-36 sm:w-40 rounded-xl border border-[#E2E8F0] bg-white overflow-hidden focus-within:border-[#00A551] focus-within:ring-2 focus-within:ring-[#00A551]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <input
        type="number"
        min="0"
        max="130"
        value={value}
        onChange={handleChange}
        placeholder="—"
        className="w-full pl-3.5 pr-1 py-2 text-center text-sm font-bold text-[#1A2741] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Patient age in years"
      />
      <div className="px-3 py-2 text-xs font-semibold text-[#687280] bg-[#F8FAFC] border-l border-[#E2E8F0] select-none shrink-0">
        Years
      </div>
    </div>
  );
}
