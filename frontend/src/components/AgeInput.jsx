import React from 'react';
import { Baby, User } from 'lucide-react';

export default function AgeInput({
  value = '',
  onChange,
}) {
  const isInfant = value === 'Infant' || value === 0 || value === '< 1 yr';
  const numericValue = typeof value === 'number' && value >= 1 ? value : (!isInfant && value !== '' ? value : '');

  const handleInfantClick = () => {
    if (onChange) {
      if (isInfant) {
        onChange('');
      } else {
        onChange('Infant');
      }
    }
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value.trim();
    if (raw === '') {
      if (onChange) onChange('');
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 130) {
      if (onChange) onChange(parsed);
    } else if (!isNaN(parsed) && parsed === 0) {
      // If user types 0, convert to Infant
      if (onChange) onChange('Infant');
    }
  };

  const handleIncrement = () => {
    const current = typeof numericValue === 'number' ? numericValue : 1;
    if (current < 130 && onChange) {
      onChange(current + 1);
    }
  };

  const handleDecrement = () => {
    const current = typeof numericValue === 'number' ? numericValue : 1;
    if (current > 1 && onChange) {
      onChange(current - 1);
    } else if (current <= 1 && onChange) {
      onChange('Infant');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 select-none">
      {/* ── Infant (< 1 year) Toggle Pill ── */}
      <button
        type="button"
        onClick={handleInfantClick}
        className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
          isInfant
            ? 'bg-[#E8F6E9] border-[#00A551] text-[#007A3D] ring-2 ring-[#00A551]/25'
            : 'bg-white border-[#E2E8F0] text-[#687280] hover:border-[#71BC75]/60 hover:text-[#1A2741]'
        }`}
      >
        <Baby className={`w-4 h-4 ${isInfant ? 'text-[#00A551]' : 'text-[#687280]'}`} />
        <span>Infant (&lt; 1 yr)</span>
      </button>

      <span className="text-xs text-[#94A3B8] font-bold">OR</span>

      {/* ── Age (1+ Years) Number Input & Stepper ── */}
      <div className="inline-flex items-center rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs focus-within:border-[#00A551] focus-within:ring-2 focus-within:ring-[#00A551]/20">
        <button
          type="button"
          onClick={handleDecrement}
          title="Decrease age"
          className="w-9 h-10 flex items-center justify-center text-[#687280] hover:bg-[#FAF9F5] hover:text-[#1A2741] active:bg-[#F1F5F9] font-bold text-base transition-colors cursor-pointer border-r border-[#E2E8F0]"
        >
          −
        </button>

        <div className="relative flex items-center">
          <input
            type="number"
            min="1"
            max="130"
            value={numericValue}
            onChange={handleNumberChange}
            placeholder="Age"
            className="w-16 py-2 px-1 text-center text-sm font-extrabold text-[#1A2741] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-[#94A3B8]"
            aria-label="Patient age in years (1 and above)"
          />
        </div>

        <div className="px-2.5 py-2 text-xs font-bold text-[#687280] bg-[#FAF9F5] border-l border-r border-[#E2E8F0] select-none">
          Yrs
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          title="Increase age"
          className="w-9 h-10 flex items-center justify-center text-[#687280] hover:bg-[#FAF9F5] hover:text-[#1A2741] active:bg-[#F1F5F9] font-bold text-base transition-colors cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Helper label */}
      {isInfant && (
        <span className="text-xs font-bold text-[#00A551] bg-[#E8F6E9] px-2.5 py-1 rounded-lg border border-[#71BC75]/30">
          Infant protocol active
        </span>
      )}
    </div>
  );
}
