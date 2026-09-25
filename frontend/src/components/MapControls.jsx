import React from 'react';
import { Plus, Minus, Navigation } from 'lucide-react';

export default function MapControls({ onZoomIn, onZoomOut, onRecenter, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 select-none ${className}`}>
      {/* Zoom In & Out Stack */}
      <div className="bg-white rounded-2xl border border-[#E6ECE3] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          className="w-10 h-10 flex items-center justify-center text-[#4A4A4A] hover:text-[#00A551] hover:bg-[#FAF9F5] active:bg-[#E8F6E9] transition-colors border-b border-[#F0F4EF] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          className="w-10 h-10 flex items-center justify-center text-[#4A4A4A] hover:text-[#00A551] hover:bg-[#FAF9F5] active:bg-[#E8F6E9] transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Recenter Button */}
      <div className="bg-white rounded-2xl border border-[#E6ECE3] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        <button
          type="button"
          onClick={onRecenter}
          title="Recenter Map"
          className="w-10 h-10 flex items-center justify-center text-[#4A4A4A] hover:text-[#00A551] hover:bg-[#FAF9F5] active:bg-[#E8F6E9] transition-colors cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
