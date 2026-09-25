import React, { useEffect, useState } from 'react';

// ── Status Badge ───────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    connected:    'bg-accent-500/20 text-accent-500 border-accent-500/30',
    disconnected: 'bg-danger-500/20 text-danger-500 border-danger-500/30',
    loading:      'bg-primary-500/20 text-primary-400 border-primary-500/30',
  };
  const cls = map[status] || map.loading;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}

// ── Info Row ───────────────────────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-medium text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
function App() {
  const [health, setHealth]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(data => { setHealth(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-4">
            <span className="text-3xl">🩺</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">MediRoute</h1>
          <p className="text-slate-400 text-sm">Setup Verification Dashboard</p>
        </div>

        {/* ── Card ── */}
        <div className="glass p-6 space-y-1">

          {/* Tailwind check */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 mb-4">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-accent-500">Tailwind CSS v3 is working</p>
              <p className="text-xs text-slate-400">Styles compiled successfully</p>
            </div>
          </div>

          {/* Backend status */}
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 pb-2">Backend</h2>

          {loading && (
            <div className="flex items-center gap-2 py-4 text-slate-400 text-sm">
              <svg className="w-4 h-4 animate-spin text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Connecting to API…
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-sm text-danger-500">
              ⚠️ Cannot reach backend — is the server running?
              <p className="mt-1 text-xs text-slate-400 font-mono">{error}</p>
            </div>
          )}

          {health && (
            <>
              <InfoRow label="API Status"   value={<Badge status={health.success ? 'connected' : 'disconnected'} />} />
              <InfoRow label="Server"       value={health.server} />
              <InfoRow label="Database"     value={<Badge status={health.database} />} />
              <InfoRow label="DB Name"      value={health.dbName}        mono />
              <InfoRow label="Environment"  value={health.environment} />
              <InfoRow label="Timestamp"    value={new Date(health.timestamp).toLocaleTimeString()} />
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-slate-600 mt-6">
          MediRoute • React + Tailwind v3 + Express + MongoDB
        </p>
      </div>
    </div>
  );
}

export default App;
