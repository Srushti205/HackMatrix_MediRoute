import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import BackgroundDecoration from '../components/BackgroundDecoration';

export default function HospitalLogin() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <BackgroundDecoration />

      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#E6ECE3] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center">
        <Logo className="mb-6 scale-90" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F6E9] border border-[#71BC75]/30 text-[#00A551] text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#71BC75] animate-pulse" />
          Hospital Portal
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#00A551] tracking-tight mb-2">
          Hospital Login
        </h1>
        <p className="text-sm text-[#687280] mb-8">
          Sign in to update bed availability, manage trauma capacities, and accept incoming emergency cases.
        </p>

        {/* Placeholder Login Form Container */}
        <div className="w-full space-y-4 mb-6">
          <div className="w-full text-left">
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Facility ID / Email
            </label>
            <input
              type="text"
              disabled
              placeholder="facility.admin@memorialhealth.org"
              className="w-full px-4 py-3 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#687280] cursor-not-allowed"
            />
          </div>
          <div className="w-full text-left">
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Medical Staff Password
            </label>
            <input
              type="password"
              disabled
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#687280] cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#71BC75] opacity-90 cursor-not-allowed text-sm shadow-sm"
          >
            Authenticate (Coming Soon)
          </button>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00A551] hover:text-[#008f45] hover:underline transition-colors"
        >
          ← Back to Role Selection
        </Link>
      </div>
    </main>
  );
}
