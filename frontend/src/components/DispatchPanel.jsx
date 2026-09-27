import React from 'react';
import NewEmergencyCard from './NewEmergencyCard';
import EmergencyList from './EmergencyList';

export default function DispatchPanel({
  emergencies = [],
  selectedEmergencyId,
  onSelectEmergency,
  onNewEmergency,
}) {
  return (
    <aside
      aria-label="Dispatch Control Panel"
      className="w-full h-full bg-[#FAF9F5] flex flex-col border-t lg:border-t-0 lg:border-l border-[#E6ECE3]"
    >
      {/* ── Panel Header ── */}
      <div className="p-5 sm:p-6 pb-4 border-b border-[#E6ECE3]/70 bg-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#00A551] tracking-tight">
              Dispatch Control Panel
            </h2>
            <p className="text-xs text-[#687280] mt-0.5 font-normal">
              Real-time emergency fleet & facility orchestration
            </p>
          </div>
        </div>
      </div>

      {/* ── Scrollable Panel Content ── */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
        {/* Top: New Emergency Card */}
        <NewEmergencyCard onNewEmergency={onNewEmergency} />

        {/* In-Process Emergencies Section */}
        <EmergencyList
          emergencies={emergencies}
          selectedEmergencyId={selectedEmergencyId}
          onSelectEmergency={onSelectEmergency}
        />
      </div>
    </aside>
  );
}
