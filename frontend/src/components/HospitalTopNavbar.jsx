import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function HospitalTopNavbar({ hospitalName }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-[#E6ECE3] bg-white px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/hospital" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#71BC75]/30 bg-gradient-to-br from-[#E8F6E9] via-[#FAF8AB]/50 to-[#E8F6E9] p-1.5 transition-transform group-hover:scale-105">
              <div className="text-[19px] font-extrabold leading-none text-[#00A551]">+</div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-baseline">
                <span className="text-xl font-extrabold tracking-tight text-[#3A3D40]">Medi</span>
                <span className="text-xl font-extrabold tracking-tight text-[#00A551]">Route</span>
              </div>
              <span className="-mt-0.5 text-[10px] font-semibold tracking-tight text-[#687280]">Hospital Triage Desk</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1.5 md:flex">
            <button type="button" className="cursor-pointer rounded-lg bg-[#E8F6E9] px-3.5 py-1.5 text-sm font-semibold text-[#00A551] transition-colors">
              Overview
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">


          <div ref={ref} className="relative">
            <button type="button" onClick={() => setIsOpen((value) => !value)} className="flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent px-2.5 py-1.5 hover:border-[#E6ECE3] hover:bg-[#FAF9F5]">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#71BC75]/40 bg-[#E8F6E9] text-[10px] font-bold text-[#00A551]">
                RH
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#00A551]" />
              </div>
              <div className="hidden flex-col text-left leading-tight sm:flex">
                <span className="text-sm font-semibold text-[#4A4A4A]">Hospital Admin</span>
                <span className="max-w-[150px] truncate text-[10px] text-[#687280]">{hospitalName}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-[#687280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-[#E6ECE3] bg-white py-2 shadow-lg">
                <div className="border-b border-[#F0F4EF] px-4 py-2.5">
                  <p className="text-xs font-bold text-[#4A4A4A]">Hospital Administration</p>
                  <p className="mt-0.5 text-[11px] text-[#687280]">{hospitalName}</p>
                </div>
                <button type="button" onClick={() => navigate('/')} className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-[#687280] hover:bg-[#FAF9F5] hover:text-[#00A551]">
                  <LogOut className="h-4 w-4" /> Exit hospital portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
