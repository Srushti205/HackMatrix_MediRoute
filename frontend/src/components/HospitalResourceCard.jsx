import React from 'react';
import { Minus, Plus, Power, CheckCircle2, AlertTriangle } from 'lucide-react';

export function CapacityResourceCard({ resource, onAdjust }) {
  const percentage = resource.total ? Math.round((resource.available / resource.total) * 100) : 0;
  const tone = resource.available <= 1 ? 'critical' : percentage <= 35 ? 'warning' : 'healthy';
  const badge = tone === 'healthy' ? 'Available' : tone === 'warning' ? 'Low' : 'Critical';
  const badgeClass = tone === 'healthy'
    ? 'border-[#71BC75]/30 bg-[#E8F6E9] text-[#00A551]'
    : tone === 'warning'
      ? 'border-[#E9D98D] bg-[#FFF7D1] text-[#8A6500]'
      : 'border-[#F2C4C0] bg-[#FFF1F0] text-[#B42318]';
  const barClass = tone === 'healthy' ? 'bg-[#71BC75]' : tone === 'warning' ? 'bg-[#D4AE3A]' : 'bg-[#E36A5C]';

  return (
    <article className="rounded-2xl border border-[#E6ECE3] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-[#3A3D40]">{resource.shortLabel}</p>
          <p className="mt-1 text-[11px] text-[#687280]">{resource.label}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}>{badge}</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <span className="text-3xl font-extrabold tracking-tight text-[#00A551]">{resource.available}</span>
          <span className="ml-1 text-xs text-[#687280]">free / {resource.total} {resource.unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onAdjust(resource.id, -1)} disabled={resource.available <= 0} aria-label={`Decrease ${resource.shortLabel}`} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#D7E3D5] bg-[#FAF9F5] text-[#687280] hover:border-[#71BC75] hover:text-[#00A551] disabled:cursor-not-allowed disabled:opacity-40">
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onAdjust(resource.id, 1)} disabled={resource.available >= resource.total} aria-label={`Increase ${resource.shortLabel}`} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#D7E3D5] bg-[#FAF9F5] text-[#687280] hover:border-[#71BC75] hover:text-[#00A551] disabled:cursor-not-allowed disabled:opacity-40">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F0F4EF]">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${Math.max(4, percentage)}%` }} />
      </div>
    </article>
  );
}

export function EquipmentRow({ resource, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F0F4EF] py-3.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${resource.operational ? 'border-[#71BC75]/30 bg-[#E8F6E9] text-[#00A551]' : 'border-[#F2C4C0] bg-[#FFF1F0] text-[#B42318]'}`}>
          <Power className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#3A3D40]">{resource.label}</p>
          <p className="mt-0.5 text-[11px] text-[#687280]">{resource.detail}</p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={resource.operational}
        aria-label={`${resource.label}: ${resource.operational ? 'operational' : 'offline'}`}
        onClick={() => onToggle(resource.id)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#71BC75]/40 focus-visible:ring-offset-2 ${resource.operational ? 'border-[#00A551] bg-[#00A551]' : 'border-[#B6C0BA] bg-[#B6C0BA]'}`}
      >
        <span className={`pointer-events-none block h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.28)] ring-1 ring-black/5 transition-transform duration-200 ${resource.operational ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  );
}

export function SpecialistStatus({ status }) {
  const active = status === 'On site';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? 'bg-[#E8F6E9] text-[#00A551]' : 'bg-[#FFF7D1] text-[#8A6500]'}`}>
      {active ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {status}
    </span>
  );
}
