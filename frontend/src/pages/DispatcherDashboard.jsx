import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import MapView from '../components/MapView';
import DispatchPanel from '../components/DispatchPanel';
import { mockEmergencies } from '../data/emergencies';
import { availableAmbulances } from '../data/ambulances';
import { calculateDistanceKm } from '../services/mapService';
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
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [emergencies, setEmergencies] = useState(mockEmergencies);
  // Default to a hospital-bound emergency so the first map view shows a meaningful
  // patient-to-hospital route instead of an arbitrary ambulance-to-incident corridor.
  const defaultEmergencyId = mockEmergencies.find(
    (emergency) => emergency.status === 'Transporting Patient' && (emergency.hospitalId || emergency.destinationHospital)
  )?.id || mockEmergencies[0]?.id || null;
  const [selectedEmergencyId, setSelectedEmergencyId] = useState(defaultEmergencyId);
  const [activeNav, setActiveNav] = useState('Home');
  const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
  const [newEmergencyType, setNewEmergencyType] = useState('Trauma / Injury');
  const [newEmergencyLocation, setNewEmergencyLocation] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const createdEmergency = routeLocation.state?.createdEmergency;
    if (!createdEmergency?.id) return;

    const responseType = createdEmergency.responseType;
    const candidates = availableAmbulances
      .filter((ambulance) => {
        if (!responseType) return true;
        const type = String(ambulance.type || '').toUpperCase();
        return responseType === 'ALS'
          ? type.includes('ALS') || type.includes('ADVANCED') || type.includes('CRITICAL CARE')
          : type.includes('BLS') || type.includes('BASIC');
      })
      .map((ambulance) => ({
        ambulance,
        distanceKm: calculateDistanceKm(
          ambulance.latitude,
          ambulance.longitude,
          createdEmergency.latitude,
          createdEmergency.longitude
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const fallbackCandidates = availableAmbulances
      .map((ambulance) => ({
        ambulance,
        distanceKm: calculateDistanceKm(
          ambulance.latitude,
          ambulance.longitude,
          createdEmergency.latitude,
          createdEmergency.longitude
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const selected = candidates[0] || fallbackCandidates[0];
    const assignedEmergency = {
      ...createdEmergency,
      assignedAmbulance: selected?.ambulance.id || null,
      ambulanceId: selected?.ambulance.id || null,
      assignedAmbulanceType: selected?.ambulance.type || null,
      assignedAmbulanceStation: selected?.ambulance.station || null,
    };

    setEmergencies((previous) => [
      assignedEmergency,
      ...previous.filter((item) => item.id !== assignedEmergency.id),
    ]);
    setSelectedEmergencyId(assignedEmergency.id);
    setToastMessage(
      selected
        ? `${selected.ambulance.id} (${selected.ambulance.station}) dispatched from the nearest available spot to ${assignedEmergency.location}`
        : `Emergency ${assignedEmergency.id} created — waiting for ambulance assignment`
    );
    window.setTimeout(() => setToastMessage(null), 4200);

    // Consume the navigation payload so re-renders do not create the emergency again.
    navigate('/dashboard', { replace: true, state: null });
  }, [navigate, routeLocation.state]);

  const handleSelectEmergency = useCallback((emergency) => {
    setSelectedEmergencyId(emergency.id);
  }, []);

  const handleRouteUpdate = useCallback((emergencyId, routeUpdate) => {
    setEmergencies((previous) =>
      previous.map((emergency) =>
        emergency.id === emergencyId ? { ...emergency, ...routeUpdate } : emergency
      )
    );
  }, []);

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
              onRouteUpdate={handleRouteUpdate}
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
            onNewEmergency={() => navigate('/new-emergency')}
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
