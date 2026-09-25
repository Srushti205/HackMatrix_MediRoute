import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import BackgroundDecoration from '../components/BackgroundDecoration';

export default function DispatcherLogin() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <BackgroundDecoration />

      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#E6ECE3] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center">
        <Logo className="mb-6 scale-90" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F6E9] border border-[#71BC75]/30 text-[#00A551] text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#00A551] animate-pulse" />
          Dispatcher Portal
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#00A551] tracking-tight mb-2">
          Dispatcher Login
        </h1>
        <p className="text-sm text-[#687280] mb-8">
          Sign in to coordinate emergency dispatch, ambulances, and real-time medical logistics.
        </p>

        {/* Placeholder Login Form Container */}
        <div className="w-full space-y-4 mb-6">
          <div className="w-full text-left">
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Operator ID / Email
            </label>
            <input
              type="text"
              disabled
              placeholder="operator@mediroute.gov"
              className="w-full px-4 py-3 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#687280] cursor-not-allowed"
            />
          </div>
          <div className="w-full text-left">
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Access Token / Password
            </label>
            <input
              type="password"
              disabled
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#687280] cursor-not-allowed"
            />
          </div>
          <Link
            to="/dispatcher"
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#00A551] hover:bg-[#008f45] active:bg-[#007b3b] text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Enter Dispatcher Dashboard →
          </Link>
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
