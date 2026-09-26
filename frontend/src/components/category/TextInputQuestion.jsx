import React from 'react';

export default function TextInputQuestion({
  value = '',
  onChange,
  placeholder = '',
  type = 'text',
  unitValue,
  onUnitChange,
  units,
}) {
  if (units && units.length > 0) {
    return (
      <div className="flex items-center max-w-xs rounded-xl border border-[#E2E8F0] bg-white overflow-hidden focus-within:border-[#00A551] focus-within:ring-2 focus-within:ring-[#00A551]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="e.g. 4"
          className="w-full pl-3.5 pr-2 py-2 text-xs font-semibold text-[#1A2741] outline-none"
        />
        <select
          value={unitValue || units[0]}
          onChange={(e) => onUnitChange && onUnitChange(e.target.value)}
          className="px-2 py-2 text-xs font-semibold text-[#687280] bg-[#F8FAFC] border-l border-[#E2E8F0] outline-none cursor-pointer"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#1A2741] placeholder-[#94A3B8] focus:outline-none focus:border-[#00A551] focus:ring-2 focus:ring-[#00A551]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      />
    </div>
  );
}
