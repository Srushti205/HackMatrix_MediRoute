import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import EmergencyProgress from './EmergencyProgress';
import { Bell } from 'lucide-react';

export default function TopNavbar({
  activeNav = 'Home',
  onNavSelect,
  showWorkflowProgress = false,
  currentStep = 1,
}) {
  const navItems = ['Home', 'Emergencies', 'Hospitals', 'Ambulances', 'Logistics'];

  return (
    <header className="w-full bg-white border-b border-[#E6ECE3] h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* ── Left: Logo & Tagline ── */}
      <div className="flex items-center gap-6 lg:gap-8">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8F6E9] via-[#FAF8AB]/50 to-[#E8F6E9] border border-[#71BC75]/30 p-1.5 group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <rect x="20.5" y="10" width="7" height="28" rx="3.5" fill="#00A551" />
              <rect x="10" y="20.5" width="14" height="7" rx="3.5" fill="#00A551" />
              <path
                d="M24 20.5H34.5C36.433 20.5 38 22.067 38 24C38 25.933 36.433 27.5 34.5 27.5H24V20.5Z"
                fill="#71BC75"
              />
              <path
                d="M24 20.5C24 14 31 10 37 11C38 17 33 24 24 24"
                fill="#71BC75"
              />
              <circle cx="24" cy="24" r="2" fill="#FAF8AB" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-baseline">
              <span className="text-xl font-extrabold tracking-tight text-[#3A3D40]">Medi</span>
              <span className="text-xl font-extrabold tracking-tight text-[#00A551]">Route</span>
            </div>
            {showWorkflowProgress && (
              <span className="text-[10px] font-semibold text-[#687280] tracking-tight -mt-0.5">
                Faster Response. Safer Lives.
              </span>
            )}
          </div>
        </Link>

        {/* Regular Navigation Menu (only shown if not in workflow mode) */}
        {!showWorkflowProgress && (
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onNavSelect && onNavSelect(item)}
                  className={`px-3.5 py-1.5 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#E8F6E9] text-[#00A551] font-semibold'
                      : 'text-[#687280] hover:text-[#00A551] hover:bg-[#FAF9F5]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* ── Center: Emergency Workflow Progress Indicator ── */}
      {showWorkflowProgress && (
        <div className="hidden md:flex items-center justify-center">
          <EmergencyProgress currentStep={currentStep} />
        </div>
      )}

      {/* ── Right: Notification Icon & Profile ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#4A4A4A] hover:bg-[#FAF9F5] border border-transparent hover:border-[#E6ECE3] transition-all cursor-pointer"
        >
          <Bell className="w-5 h-5 text-[#5A6578]" />
          {/* Notification Badge */}
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A551] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A551]" />
          </span>
        </button>

        {/* Dispatcher Profile Button with Dropdown */}
        <div className="flex items-center">
          {showWorkflowProgress && (
            <div className="hidden sm:flex flex-col text-right mr-1.5 pointer-events-none">
              <span className="text-xs font-bold text-[#1A2741] leading-tight">Ravi Desai</span>
              <span className="text-[10px] text-[#687280]">Dispatcher</span>
            </div>
          )}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
