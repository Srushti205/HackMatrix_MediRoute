import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

export default function TopNavbar({
  onNavSelect,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Ambulances', path: '/ambulances' },
    { label: 'Logistics', path: '/logistics' },
  ];

  return (
    <header className="w-full bg-white border-b border-[#E6ECE3] h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* ── Left: Logo & Nav ── */}
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
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.label === 'Home' && location.pathname.startsWith('/dashboard'));
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => { navigate(item.path); if (onNavSelect) onNavSelect(item.label); }}
                className={`px-3.5 py-1.5 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#E8F6E9] text-[#00A551] font-semibold'
                    : 'text-[#687280] hover:text-[#00A551] hover:bg-[#FAF9F5]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Right: Profile ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
