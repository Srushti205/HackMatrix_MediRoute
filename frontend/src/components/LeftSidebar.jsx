import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Siren,
  FileText,
  Building2,
  Ambulance,
  BarChart3,
  Settings,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';

export default function LeftSidebar({ activeItem = 'New Emergency' }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'New Emergency', icon: Siren, path: '/new-emergency' },
    { label: 'Incidents', icon: FileText, path: '/dashboard' },
    { label: 'Hospital Network', icon: Building2, path: '/dashboard' },
    { label: 'Ambulances', icon: Ambulance, path: '/dashboard' },
    { label: 'Reports', icon: BarChart3, path: '/dashboard' },
  ];

  return (
    <aside
      aria-label="Sidebar navigation"
      className="w-56 shrink-0 bg-[#1A2741] text-white flex flex-col justify-between border-r border-[#243456] select-none h-full z-20"
    >
      {/* ── Top Brand Area ── */}
      <div>
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#00A551] flex items-center justify-center text-white shadow-sm shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 2L3 7l9 5 9-5-9-5z" />
              <path d="M3 12l9 5 9-5" />
              <path d="M3 17l9 5 9-5" />
            </svg>
          </div>
          <div className="flex items-baseline">
            <span className="text-base font-bold text-white tracking-tight">Medi</span>
            <span className="text-base font-bold text-[#00A551] tracking-tight">Route</span>
          </div>
        </div>

        {/* ── Nav Links ── */}
        <nav className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00A551]/15 text-[#00A551] font-bold shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#00A551]"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#00A551]' : 'text-white/60'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
            System
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="w-4 h-4 text-white/60" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* ── Bottom Section: Support & User Info ── */}
      <div className="p-3 border-t border-white/10 space-y-3">
        {/* Need Help Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-white/90 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#00A551]" />
            <span>Need Help?</span>
          </div>
          <p className="text-[11px] text-white/50 mt-1 leading-snug">
            Contact dispatch supervision for urgent protocol inquiries.
          </p>
          <a
            href="mailto:support@mediroute.in"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00A551] hover:text-[#71BC75] mt-2 transition-colors"
          >
            <span>Contact Support</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#00A551] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
            RD
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Ravi Desai</div>
            <div className="text-[10px] text-white/50 truncate">Senior Dispatcher</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
