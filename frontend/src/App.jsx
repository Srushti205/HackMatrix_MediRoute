import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import DispatcherLogin from './pages/DispatcherLogin';
import HospitalLogin from './pages/HospitalLogin';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#4A4A4A] font-sans">
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login/dispatcher" element={<DispatcherLogin />} />
        <Route path="/login/hospital" element={<HospitalLogin />} />
        {/* Catch-all redirect to role selection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
