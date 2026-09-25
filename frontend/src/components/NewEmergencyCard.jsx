import React from 'react';
import { Plus, Siren } from 'lucide-react';

export default function NewEmergencyCard({ onNewEmergency }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E6ECE3] shadow-sm relative overflow-hidden mb-6">
      {/* Decorative subtle corner tint */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FAF8AB]/30 via-[#E8F6E9]/40 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <h2 className="text-lg font-bold text-[#2A362C] tracking-tight flex items-center gap-2">
            New Emergency
          </h2>
          <p className="text-xs sm:text-sm text-[#687280] mt-0.5">
            Dispatch an ambulance to a new emergency.
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#E8F6E9] border border-[#71BC75]/30 flex items-center justify-center shrink-0 text-[#00A551]">
          <Siren className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onNewEmergency}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#00A551] hover:bg-[#008f45] active:bg-[#007b3b] shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Emergency</span>
        </button>
      </div>
    </div>
  );
}
