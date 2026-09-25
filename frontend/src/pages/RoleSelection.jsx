import React from 'react';
import Logo from '../components/Logo';
import RoleCard from '../components/RoleCard';
import BackgroundDecoration from '../components/BackgroundDecoration';
import DispatcherIllustration from '../components/illustrations/DispatcherIllustration';
import HospitalIllustration from '../components/illustrations/HospitalIllustration';

export default function RoleSelection() {
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-hidden">
      {/* Subtle organic & city background decoration */}
      <BackgroundDecoration />

      {/* Main Centered Content Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center my-auto">
        {/* Top Logo with motif & decorative line */}
        <header className="mb-7 sm:mb-9 text-center">
          <Logo />
        </header>

        {/* Headings */}
        <section className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#00A551] tracking-tight mb-2.5">
            Emergency Resource Management
          </h1>
          <p className="text-base sm:text-lg text-[#687280] font-normal">
            Select your role to continue
          </p>
        </section>

        {/* Role Cards Grid: Two equal height & width cards side-by-side */}
        <section
          aria-label="Role selection cards"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl items-stretch"
        >
          {/* Card 1 — Dispatcher */}
          <RoleCard
            cardId="role-card-dispatcher"
            buttonId="btn-continue-dispatcher"
            title="Dispatcher"
            description="Coordinate emergencies, ambulances, and hospital resources."
            illustration={DispatcherIllustration}
            buttonText="Continue as Dispatcher →"
            buttonColor="dark"
            to="/dispatcher"
          />

          {/* Card 2 — Hospital */}
          <RoleCard
            cardId="role-card-hospital"
            buttonId="btn-continue-hospital"
            title="Hospital"
            description="Manage hospital capacity, resources, and incoming patients."
            illustration={HospitalIllustration}
            buttonText="Continue as Hospital →"
            buttonColor="primary"
            to="/login/hospital"
          />
        </section>
      </div>

      {/* Subtle bottom platform status / footer branding */}
      <footer className="mt-8 text-center text-xs text-[#9CA3AF] tracking-wide select-none">
        MediRoute Platform &bull; Secure Emergency Resource Coordination
      </footer>
    </main>
  );
}
