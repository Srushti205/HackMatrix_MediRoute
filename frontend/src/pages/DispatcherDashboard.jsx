import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import MapView from '../components/MapView';
import DispatchPanel from '../components/DispatchPanel';
import { mockEmergencies } from '../data/emergencies';
import { X, CheckCircle2 } from 'lucide-react';

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('MapErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF9F5] p-6 text-center">
          <p className="font-bold text-[#00A551] text-lg mb-2">Map Display Recovering</p>
          <p className="text-sm text-[#687280] mb-4">Click below to re-initialize the interactive map.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-[#00A551] text-white rounded-xl text-sm font-semibold cursor-pointer"
          >
            Reload Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DispatcherDashboard() {
  const [emergencies, setEmergencies] = useState(mockEmergencies);
  const [selectedEmergencyId, setSelectedEmergencyId] = useState('EM-1042');
  const [activeNav, setActiveNav] = useState('Home');
  const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
  const [newEmergencyType, setNewEmergencyType] = useState('Trauma / Injury');
  const [newEmergencyLocation, setNewEmergencyLocation] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const handleSelectEmergency = (emergency) => {
    setSelectedEmergencyId(emergency.id);
  };

  const handleCreateEmergency = (e) => {
    e.preventDefault();
    const newId = `EM-${1040 + emergencies.length + 2}`;
    const newEntry = {
      id: newId,
      latitude: 18.5204 + (Math.random() - 0.5) * 0.03,
      longitude: 73.8567 + (Math.random() - 0.5) * 0.03,
      type: newEmergencyType,
      status: 'En Route',
      priority: 'High',
      ambulanceId: `AMB-${110 + emergencies.length}`,
      hospitalId: 'HOSP-01',
      assignedAmbulance: `AMB-${110 + emergencies.length}`,
      destinationHospital: 'Ruby Hall Clinic',
      eta: '08 min',
      location: newEmergencyLocation || 'FC Road Junction',
      timeReported: 'Just now',
    };

    setEmergencies([newEntry, ...emergencies]);
    setSelectedEmergencyId(newId);
    setShowNewEmergencyModal(false);
    setNewEmergencyLocation('');

    // Trigger confirmation toast
    setToastMessage(`Dispatched ${newEntry.assignedAmbulance} to ${newId}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAF9F5] text-[#4A4A4A] overflow-hidden select-none">
      {/* ── Top Navbar ── */}
      <TopNavbar activeNav={activeNav} onNavSelect={setActiveNav} />

      {/* ── Main Dashboard Content Split ── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT: ~65% Map Area */}
        <section
          aria-label="Emergency Map Overview"
          className="w-full lg:w-[65%] xl:w-[66%] h-[50vh] lg:h-full relative overflow-hidden border-b lg:border-b-0 border-[#E6ECE3]"
        >
          <MapErrorBoundary>
            <MapView
              emergencies={emergencies}
              selectedEmergencyId={selectedEmergencyId}
              onSelectEmergency={handleSelectEmergency}
            />
          </MapErrorBoundary>
        </section>

        {/* RIGHT: ~35% Dispatch Control Panel */}
        <section
          aria-label="Dispatch Control Panel"
          className="w-full lg:w-[35%] xl:w-[34%] h-[50vh] lg:h-full overflow-hidden"
        >
          <DispatchPanel
            emergencies={emergencies}
            selectedEmergencyId={selectedEmergencyId}
            onSelectEmergency={handleSelectEmergency}
            onNewEmergency={() => setShowNewEmergencyModal(true)}
          />
        </section>
      </main>

      {/* ── Optional Modal for "+ New Emergency" Action ── */}
      {showNewEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E6ECE3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EF] mb-4">
              <h3 className="text-lg font-bold text-[#00A551] tracking-tight">
                Quick Dispatch: New Emergency
              </h3>
              <button
                type="button"
                onClick={() => setShowNewEmergencyModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FAF9F5] text-[#687280] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmergency} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
                  Emergency Category
                </label>
                <select
                  value={newEmergencyType}
                  onChange={(e) => setNewEmergencyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#71BC75]/40 cursor-pointer"
                >
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Cardiac Arrest">Cardiac Arrest</option>
                  <option value="Trauma / Injury">Trauma / Injury</option>
                  <option value="Road Traffic Accident">Road Traffic Accident</option>
                  <option value="Respiratory Distress">Respiratory Distress</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
                  Incident Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Station Road, Sector 3"
                  value={newEmergencyLocation}
                  onChange={(e) => setNewEmergencyLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7E3D5] bg-[#FAF9F5] text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#71BC75]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewEmergencyModal(false)}
                  className="px-4 py-2.5 rounded-xl font-medium text-sm text-[#687280] hover:bg-[#FAF9F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#00A551] hover:bg-[#008f45] shadow-sm cursor-pointer"
                >
                  Dispatch Ambulance →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Status Toast ── */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#00A551] text-white px-4 py-2.5 rounded-2xl shadow-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#FFFEC5]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
