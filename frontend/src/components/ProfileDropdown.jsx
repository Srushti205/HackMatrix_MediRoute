import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Shield, Settings, LogOut } from 'lucide-react';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-[#FAF9F5] border border-transparent hover:border-[#E6ECE3] transition-all cursor-pointer select-none focus:outline-none"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full bg-[#E8F6E9] border border-[#71BC75]/40 flex items-center justify-center text-[#00A551] font-bold text-xs">
          <span>DS</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00A551] border-2 border-white" />
        </div>

        {/* Label */}
        <span className="text-sm font-semibold text-[#4A4A4A]">
          Dispatcher
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-[#687280] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E6ECE3] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header info */}
          <div className="px-4 py-2.5 border-b border-[#F0F4EF]">
            <p className="text-xs font-semibold text-[#00A551] uppercase tracking-wider">
              Control Room #4
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-[#687280]" />
              <span className="text-xs font-mono font-medium text-[#4A4A4A]">
                ID: DSP-8842
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-[#4A4A4A] hover:bg-[#FAF9F5] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-[#71BC75]" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-[#4A4A4A] hover:bg-[#FAF9F5] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#71BC75]" />
              <span>Settings</span>
            </button>
          </div>

          <div className="border-t border-[#F0F4EF] pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
