import React from 'react';
import ResponseTypeSelector from '../ResponseTypeSelector';

export default function CategoryHeader({ config, responseType, onResponseTypeChange }) {
  const IconComponent = config?.icon;

  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F0F4EF]">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2741] tracking-tight">
            Category Details
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F6E9] border border-[#71BC75]/30 text-[#00A551] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A551] animate-pulse" />
            Active
          </span>
          <div className="ml-0.5 sm:ml-1.5">
            <ResponseTypeSelector
              value={responseType}
              onChange={onResponseTypeChange}
            />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#687280] mt-1 font-medium">
          Provide additional information about the selected emergency.
        </p>

        {/* Category Indicator Badge */}
        {config && (
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl bg-[#E8F6E9] border border-[#71BC75]/40 text-[#00A551]">
            {IconComponent && (
              <div className="w-5 h-5 rounded-md bg-[#00A551] text-white flex items-center justify-center shrink-0 shadow-xs">
                <IconComponent className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-extrabold tracking-wide uppercase">
                {config.badgeLabel || config.heading}
              </span>
              <span className="text-[11px] font-medium text-[#4A4A4A]">
                &bull; Emergency-specific assessment
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Step pill badge (2 of 4) */}
      <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E6ECE3] text-xs font-bold text-[#1A2741]">
        <span className="text-[#00A551]">2</span>
        <span className="text-[#94A3B8]">of 4</span>
      </div>
    </div>
  );
}
