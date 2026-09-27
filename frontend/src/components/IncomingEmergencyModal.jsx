import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Ambulance, CheckCircle2, Clock3, MapPin, XCircle } from 'lucide-react';

export default function IncomingEmergencyModal({ request, secondsLeft, onAccept, onReject }) {
  const alertPlayed = useRef(false);

  useEffect(() => {
    if (!request || alertPlayed.current) return;
    alertPlayed.current = true;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(760, ctx.currentTime);
      oscillator.frequency.setValueAtTime(920, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.34);
      window.setTimeout(() => ctx.close().catch(() => {}), 500);
    } catch {
      // Browser autoplay policy may block synthesized audio; visual alert remains active.
    }
  }, [request]);

  useEffect(() => {
    if (!request) return;
    const handler = (event) => {
      if (event.key === 'Escape') onReject();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [request, onReject]);

  if (!request) return null;
  const urgent = secondsLeft <= 20;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#203126]/45 p-4 backdrop-blur-[3px]" role="dialog" aria-modal="true" aria-labelledby="incoming-emergency-title">
      <div className={`relative w-full max-w-[700px] overflow-hidden rounded-[28px] border bg-white shadow-[0_28px_80px_-20px_rgba(0,0,0,0.35)] ${urgent ? 'border-[#E36A5C]' : 'border-[#71BC75]/55'}`}>
        <div className={`absolute inset-x-0 top-0 h-1.5 ${urgent ? 'bg-[#E36A5C]' : 'bg-gradient-to-r from-[#71BC75] via-[#00A551] to-[#FAF8AB]'}`} />
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${urgent ? 'bg-[#FFF1F0] text-[#B42318]' : 'bg-[#FFF7D1] text-[#8A6500]'}`}>
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="incoming-emergency-title" className="text-xl font-extrabold tracking-tight text-[#3A3D40]">Incoming Emergency Alert</h2>
                  <span className="rounded-full bg-[#E8F6E9] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00A551]">Needs response</span>
                </div>
                <p className="mt-1 text-xs text-[#687280]">{request.id} · {request.category}</p>
              </div>
            </div>

            <div className={`shrink-0 rounded-xl border px-3 py-2 text-center ${urgent ? 'border-[#F2C4C0] bg-[#FFF1F0] text-[#B42318]' : 'border-[#E9D98D] bg-[#FFF7D1] text-[#8A6500]'}`}>
              <div className="flex items-center justify-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                <span className="text-lg font-extrabold tabular-nums">{secondsLeft}s</span>
              </div>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider">to respond</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E6ECE3] bg-[#FAF9F5] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#687280]">Patient condition</p>
              <p className="mt-1 text-sm font-bold text-[#3A3D40]">{request.condition}</p>
            </div>
            <div className="rounded-2xl border border-[#E6ECE3] bg-[#FAF9F5] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#687280]">Key requirements</p>
              <p className="mt-1 text-sm font-bold text-[#3A3D40]">{request.requirements}</p>
            </div>
            <div className="rounded-2xl border border-[#E6ECE3] bg-[#FAF9F5] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#687280]">Estimated arrival</p>
              <p className="mt-1 text-sm font-bold text-[#3A3D40]">{request.eta}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#687280]">
            <span className="inline-flex items-center gap-1.5"><Ambulance className="h-3.5 w-3.5 text-[#00A551]" />{request.ambulanceId}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#00A551]" />{request.pickup}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_170px]">
            <button type="button" autoFocus onClick={onAccept} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#00A551] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#008F45]">
              <CheckCircle2 className="h-4 w-4" /> Accept & Reserve Bed
            </button>
            <button type="button" onClick={onReject} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E6C9C6] bg-white px-5 py-3.5 text-sm font-bold text-[#B42318] transition-colors hover:bg-[#FFF1F0]">
              <XCircle className="h-4 w-4" /> Reject / Full
            </button>
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-5 text-[#687280]">
            <AlertTriangle className="mt-1 h-3 w-3 shrink-0" />
            Accepting reserves the required capacity. If the 90-second hold expires, the reservation is released and the request proceeds to the next hospital.
          </p>
        </div>
      </div>
    </div>
  );
}
