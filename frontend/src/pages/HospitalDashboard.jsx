import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Ambulance, BedDouble, BellRing, CheckCircle2, Droplets, Hospital, Radio, RefreshCw, ShieldCheck, Siren, Stethoscope, XCircle } from 'lucide-react';
import HospitalTopNavbar from '../components/HospitalTopNavbar';
import IncomingEmergencyModal from '../components/IncomingEmergencyModal';
import { CapacityResourceCard, EquipmentRow, SpecialistStatus } from '../components/HospitalResourceCard';
import {
  initialBloodStock,
  initialCapacityResources,
  initialEquipmentResources,
  initialHospitalProfile,
  initialSpecialistResources,
} from '../data/hospitalResources';

const incomingRequestSeed = {
  id: 'REQ-2087',
  category: 'Vehicle Accident / Poly-Trauma',
  condition: 'Unconscious · Active haemorrhage',
  requirements: 'Level 1 Trauma Bay · 2 units O−',
  eta: '11 minutes',
  ambulanceId: 'AMB-107',
  pickup: 'Shivajinagar, Pune',
};

const recentRequests = [
  { id: 'REQ-2084', category: 'Respiratory Emergency', result: 'Accepted', time: '4 min ago', ambulance: 'AMB-115' },
  { id: 'REQ-2081', category: 'Cardiac Emergency', result: 'Diverted', time: '18 min ago', ambulance: 'AMB-104' },
  { id: 'REQ-2077', category: 'Road Trauma', result: 'Accepted', time: '31 min ago', ambulance: 'AMB-112' },
];

export default function HospitalDashboard() {
  const [profile, setProfile] = useState(initialHospitalProfile);
  const [capacity, setCapacity] = useState(initialCapacityResources);
  const [equipment, setEquipment] = useState(initialEquipmentResources);
  const [incomingRequest, setIncomingRequest] = useState(incomingRequestSeed);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [toast, setToast] = useState(null);
  const [lastSynced, setLastSynced] = useState('just now');

  useEffect(() => {
    if (!incomingRequest) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setIncomingRequest(null);
          setToast({ type: 'warning', text: 'REQ-2087 expired — hold released and the request moved to the next ranked hospital.' });
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [incomingRequest]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const availableBeds = useMemo(
    () => capacity.filter((item) => ['er', 'icu', 'picu', 'nicu', 'general'].includes(item.id)).reduce((sum, item) => sum + item.available, 0),
    [capacity],
  );
  const totalBeds = useMemo(
    () => capacity.filter((item) => ['er', 'icu', 'picu', 'nicu', 'general'].includes(item.id)).reduce((sum, item) => sum + item.total, 0),
    [capacity],
  );
  const operationalCount = equipment.filter((item) => item.operational).length;

  const adjustCapacity = (id, delta) => {
    setCapacity((items) => items.map((item) => item.id === id ? { ...item, available: Math.max(0, Math.min(item.total, item.available + delta)) } : item));
    setLastSynced('just now');
  };

  const toggleEquipment = (id) => {
    setEquipment((items) => items.map((item) => item.id === id ? { ...item, operational: !item.operational } : item));
    setLastSynced('just now');
  };

  const acceptRequest = () => {
    setCapacity((items) => items.map((item) => item.id === 'trauma' || item.id === 'icu' ? { ...item, available: Math.max(0, item.available - 1) } : item));
    setIncomingRequest(null);
    setToast({ type: 'success', text: 'REQ-2087 accepted. Trauma bay and ICU capacity reserved for AMB-107.' });
    setLastSynced('just now');
  };

  const rejectRequest = () => {
    setIncomingRequest(null);
    setToast({ type: 'warning', text: 'REQ-2087 rejected. The request can now continue to the next ranked hospital.' });
    setLastSynced('just now');
  };

  const refreshData = () => {
    setLastSynced('just now');
    setToast({ type: 'success', text: 'Hospital resource status refreshed.' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#4A4A4A]">
      <HospitalTopNavbar hospitalName={profile.name} />

      <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#71BC75]/30 bg-[#E8F6E9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00A551]">
                <Activity className="h-3 w-3 animate-pulse" /> Live hospital status
              </span>
              <span className="text-[11px] text-[#687280]">Updated {lastSynced}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#3A3D40] sm:text-3xl">{profile.name}</h1>
            <p className="mt-1 text-sm text-[#687280]">{profile.tier} · {profile.address}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button type="button" onClick={refreshData} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D7E3D5] bg-white px-3.5 py-2.5 text-xs font-bold text-[#687280] hover:border-[#71BC75] hover:text-[#00A551]">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh status
            </button>
            <button type="button" onClick={() => setProfile((value) => ({ ...value, acceptingPatients: !value.acceptingPatients }))} className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold ${profile.acceptingPatients ? 'border-[#71BC75]/30 bg-[#E8F6E9] text-[#00A551]' : 'border-[#F2C4C0] bg-[#FFF1F0] text-[#B42318]'}`}>
              <span className={`h-2 w-2 rounded-full ${profile.acceptingPatients ? 'animate-pulse bg-[#00A551]' : 'bg-[#B42318]'}`} />
              {profile.acceptingPatients ? 'Accepting emergencies' : 'Diversion active'}
            </button>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <SummaryCard icon={BedDouble} label="Free beds / capacity" value={`${availableBeds} / ${totalBeds}`} helper="Tracked clinical beds" />
          <SummaryCard icon={Hospital} label="ER queue" value={profile.erQueue} helper="Patients waiting" />
          <SummaryCard icon={Ambulance} label="Ambulances en route" value={profile.ambulancesEnRoute} helper="Incoming to this facility" />
          <SummaryCard icon={ShieldCheck} label="Operational resources" value={`${operationalCount}/${equipment.length}`} helper="Equipment & services" />
        </section>

        {!profile.acceptingPatients && (
          <section className="mb-6 flex items-start gap-3 rounded-3xl border border-[#F2C4C0] bg-[#FFF1F0] p-5">
            <Siren className="mt-0.5 h-5 w-5 shrink-0 text-[#B42318]" />
            <div>
              <p className="font-bold text-[#B42318]">Diversion mode is active</p>
              <p className="mt-1 text-xs text-[#8E4B46]">New incoming requests are blocked until the hospital resumes accepting emergencies.</p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E6ECE3] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)] sm:p-6">
              <SectionHeading icon={BedDouble} title="Live Capacity" subtitle="Adjust free counts as beds and units change on the floor." badge="+ / − controls" />
              <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {capacity.map((resource) => <CapacityResourceCard key={resource.id} resource={resource} onAdjust={adjustCapacity} />)}
              </div>
            </section>

            <section className="rounded-3xl border border-[#E6ECE3] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)] sm:p-6">
              <SectionHeading icon={Droplets} title="Blood Bank Snapshot" subtitle="Live stock by blood group for emergency matching." badge="Emergency release enabled" />
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {initialBloodStock.map((item) => (
                  <div key={item.group} className={`rounded-2xl border p-3 text-center ${item.critical ? 'border-[#E9D98D] bg-[#FFF7D1]' : 'border-[#E6ECE3] bg-[#FAF9F5]'}`}>
                    <p className="text-xs font-extrabold text-[#3A3D40]">{item.group}</p>
                    <p className={`mt-1 text-xl font-extrabold ${item.critical ? 'text-[#8A6500]' : 'text-[#00A551]'}`}>{item.units}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#687280]">units</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#E6ECE3] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)] sm:p-6">
              <SectionHeading icon={BellRing} title="Recent Requests" subtitle="Latest dispatch-to-hospital handoffs." badge="Recent activity" />
              <div className="mt-3 divide-y divide-[#F0F4EF]">
                {recentRequests.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#3A3D40]">{item.id} · {item.category}</p>
                      <p className="mt-0.5 text-[11px] text-[#687280]">{item.ambulance} · {item.time}</p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.result === 'Accepted' ? 'bg-[#E8F6E9] text-[#00A551]' : 'bg-[#FFF1F0] text-[#B42318]'}`}>
                      {item.result === 'Accepted' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {item.result}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E6ECE3] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)] sm:p-6">
              <SectionHeading icon={Radio} title="Operational Equipment" subtitle="Only mark equipment available when it is in service right now." badge={`${operationalCount}/${equipment.length} online`} />
              <div className="mt-3">
                {equipment.map((resource) => <EquipmentRow key={resource.id} resource={resource} onToggle={toggleEquipment} />)}
              </div>
            </section>

            <section className="rounded-3xl border border-[#E6ECE3] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)] sm:p-6">
              <SectionHeading icon={Stethoscope} title="Specialist Coverage" subtitle="Availability used by clinical capability filtering." />
              <div className="mt-3 divide-y divide-[#F0F4EF]">
                {initialSpecialistResources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between py-3 first:pt-1 last:pb-1">
                    <span className="text-sm font-semibold text-[#3A3D40]">{resource.label}</span>
                    <SpecialistStatus status={resource.status} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-6 flex flex-col items-start justify-between gap-2 pb-2 text-[10px] text-[#9CA3AF] sm:flex-row sm:items-center">
          <span>Resource state is shared with MediRoute dispatch ranking.</span>
          <span>Last status update: {profile.lastUpdated} · Optimistic locking ready for backend integration.</span>
        </footer>
      </main>

      {profile.acceptingPatients && (
        <IncomingEmergencyModal request={incomingRequest} secondsLeft={secondsLeft} onAccept={acceptRequest} onReject={rejectRequest} />
      )}

      {toast && (
        <div className={`fixed bottom-5 right-5 z-[90] flex max-w-sm items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl ${toast.type === 'success' ? 'border-[#71BC75]/40 bg-[#E8F6E9] text-[#007A3C]' : 'border-[#E9D98D] bg-[#FFF7D1] text-[#8A6500]'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <BellRing className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-[#E6ECE3] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(113,188,117,0.08)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#71BC75]/30 bg-[#E8F6E9] text-[#00A551]"><Icon className="h-4 w-4" /></div>
        <span className="mt-1 h-2 w-2 animate-pulse rounded-full bg-[#00A551]" />
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#687280]">{label}</p>
      <p className="mt-0.5 text-xl font-extrabold tracking-tight text-[#3A3D40]">{value}</p>
      <p className="mt-1 text-[10px] text-[#9CA3AF]">{helper}</p>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#71BC75]/30 bg-[#E8F6E9] text-[#00A551]"><Icon className="h-4 w-4" /></div>
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-[#3A3D40] sm:text-lg">{title}</h2>
          <p className="mt-0.5 max-w-xl text-[11px] text-[#687280]">{subtitle}</p>
        </div>
      </div>
      {badge && <span className="hidden shrink-0 rounded-full border border-[#E6ECE3] bg-[#FAF9F5] px-2.5 py-1.5 text-[10px] font-bold text-[#687280] sm:inline-flex">{badge}</span>}
    </div>
  );
}
