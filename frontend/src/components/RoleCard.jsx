import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleCard({
  title,
  description,
  illustration: Illustration,
  buttonText,
  buttonColor = 'dark', // 'dark' or 'primary'
  to,
  cardId,
  buttonId,
}) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (to) {
      navigate(to);
    }
  };

  // Button color variants per user specifications
  // Dispatcher: Dark/primary green (#00A551)
  // Hospital: Primary/medium green (#71BC75)
  const buttonStyle =
    buttonColor === 'dark'
      ? 'bg-[#00A551] hover:bg-[#008f45] active:bg-[#007b3b] text-white shadow-sm hover:shadow-md'
      : 'bg-[#71BC75] hover:bg-[#60ab64] active:bg-[#529a56] text-white shadow-sm hover:shadow-md';

  return (
    <div
      id={cardId}
      className="group relative flex flex-col justify-between h-full bg-[#FFFFFF] rounded-3xl p-7 sm:p-8 lg:p-9 border border-[#E6ECE3] shadow-[0_4px_22px_-2px_rgba(30,60,35,0.05),0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_-4px_rgba(0,165,81,0.12),0_2px_8px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-[#71BC75]/40"
    >
      {/* ── Upper: Illustration with ample whitespace ── */}
      <div className="w-full flex-1 flex items-center justify-center min-h-[190px] sm:min-h-[210px] mb-6 px-2 overflow-hidden rounded-2xl bg-[#FCFDFC]/50">
        <Illustration className="transition-transform duration-300 group-hover:scale-[1.02]" />
      </div>

      {/* ── Content: Title and Description ── */}
      <div className="flex flex-col items-center text-center px-1 mb-8">
        <h2 className="text-2xl sm:text-[26px] font-bold text-[#2A362C] tracking-tight mb-2.5">
          {title}
        </h2>
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#687280] max-w-xs font-normal">
          {description}
        </p>
      </div>

      {/* ── Bottom: Action Button ── */}
      <div className="w-full">
        <button
          id={buttonId}
          type="button"
          onClick={handleNavigate}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 transform group-hover:brightness-105 active:scale-[0.99] select-none ${buttonStyle}`}
        >
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
