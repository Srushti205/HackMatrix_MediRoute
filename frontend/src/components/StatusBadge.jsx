import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  // Status style configuration following MediRoute soft healthcare palette
  const getStatusConfig = (stat) => {
    switch (stat) {
      case 'En Route':
        return {
          bg: 'bg-[#E8F6E9]',
          text: 'text-[#00A551]',
          border: 'border-[#71BC75]/30',
          dot: 'bg-[#00A551]',
          pulse: true,
        };
      case 'Transporting Patient':
        return {
          bg: 'bg-[#E6F4EA]',
          text: 'text-[#1E7E34]',
          border: 'border-[#71BC75]/40',
          dot: 'bg-[#1E7E34]',
          pulse: true,
        };
      case 'Awaiting Hospital':
        return {
          bg: 'bg-[#FFF7D1]',
          text: 'text-[#92400E]',
          border: 'border-[#FAF8AB]',
          dot: 'bg-[#D97706]',
          pulse: false,
        };
      case 'At Hospital':
        return {
          bg: 'bg-[#EBF7EE]',
          text: 'text-[#166534]',
          border: 'border-[#86EFAC]/40',
          dot: 'bg-[#166534]',
          pulse: false,
        };
      default:
        return {
          bg: 'bg-[#F3F4F6]',
          text: 'text-[#4B5563]',
          border: 'border-[#E5E7EB]',
          dot: 'bg-[#6B7280]',
          pulse: false,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className} select-none`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
      </span>
      {status}
    </span>
  );
}
