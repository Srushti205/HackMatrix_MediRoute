import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import DispatcherLogin from './pages/DispatcherLogin';
import HospitalLogin from './pages/HospitalLogin';
import DispatcherDashboard from './pages/DispatcherDashboard';
import NewEmergency from './pages/NewEmergency';
import CategoryDetails from './pages/CategoryDetails';
import { EmergencyProvider } from './context/EmergencyContext';

export default function App() {
  return (
    <EmergencyProvider>
      <div className="min-h-screen bg-[#FAF9F5] text-[#4A4A4A] font-sans">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login/dispatcher" element={<DispatcherDashboard />} />
          <Route path="/login/hospital" element={<HospitalLogin />} />
          <Route path="/dispatcher" element={<DispatcherDashboard />} />
          <Route path="/dashboard" element={<DispatcherDashboard />} />
          <Route path="/dashboard/dispatcher" element={<DispatcherDashboard />} />
          <Route path="/new-emergency" element={<NewEmergency />} />
          <Route path="/new-emergency/category-details" element={<CategoryDetails />} />
          <Route path="/dispatcher/new-emergency/category-details" element={<CategoryDetails />} />
          {/* Catch-all redirect to role selection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </EmergencyProvider>
  );
}
