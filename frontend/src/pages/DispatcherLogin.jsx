import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import BackgroundDecoration from '../components/BackgroundDecoration';

export default function DispatcherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('dispatcher@mediroute.gov');
  const [password, setPassword] = useState('Mediroute@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter both your email and password to continue.');
      return;
    }

    // Authentication is not connected to the backend yet. For the current prototype,
    // a valid-looking form submission opens the dispatcher dashboard.
    navigate('/dispatcher');
  };

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

        <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
          <div className="w-full text-left">
            <label htmlFor="dispatcher-email" className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              id="dispatcher-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="operator@mediroute.gov"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#4A4A4A] placeholder:text-[#9CA3AF] outline-none focus:border-[#71BC75] focus:ring-2 focus:ring-[#E8F6E9] transition"
            />
          </div>

          <div className="w-full text-left">
            <label htmlFor="dispatcher-password" className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="dispatcher-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#4A4A4A] placeholder:text-[#9CA3AF] outline-none focus:border-[#71BC75] focus:ring-2 focus:ring-[#E8F6E9] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#687280] hover:text-[#00A551] hover:bg-[#E8F6E9] transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-left text-xs font-medium text-[#B42318] bg-[#FFF1F0] border border-[#F2C4C0] rounded-xl px-3.5 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#00A551] hover:bg-[#008f45] active:bg-[#007b3b] text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Sign in to Dispatcher Dashboard →
          </button>
        </form>

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
