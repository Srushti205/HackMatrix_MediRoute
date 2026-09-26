import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Building2,
  Ambulance,
  Search,
  X,
  Plus,
  Minus,
  Crosshair,
  Navigation,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for Shivajinagar, Pune
const DEFAULT_CENTER = { lat: 18.5314, lng: 73.8446 };
const DEFAULT_ZOOM = 14;

export default function EmergencyMapPanel({
  location = 'Shivajinagar, Pune, Maharashtra, India',
  onLocationSelect,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const patientMarkerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' | 'hospitals' | 'ambulances'
  const [mapSearchText, setMapSearchText] = useState(location);
  const [currentCoords, setCurrentCoords] = useState(DEFAULT_CENTER);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync search input if location prop changes
  useEffect(() => {
    setMapSearchText(location);
  }, [location]);

  // Initialize interactive Leaflet map
  useEffect(() => {
    let isMounted = true;
    const container = mapContainerRef.current;
    if (!container) return;

    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        // ignore cleanup errors
      }
      mapInstanceRef.current = null;
    }

    const map = L.map(container, {
      center: [currentCoords.lat, currentCoords.lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create custom pulsing patient marker
    const createPatientIcon = () => {
      return L.divIcon({
        className: 'custom-patient-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
            <!-- Outer Pulse Wave -->
            <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(0, 165, 81, 0.35); top: -8px; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            
            <!-- Pin Body -->
            <div style="position: relative; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; background: #00A551; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,165,81,0.4); border: 2.5px solid white;">
              <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>

            <!-- Callout Tag -->
            <div style="margin-top: 6px; background: #1A2741; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); white-space: nowrap; border: 1px solid rgba(255,255,255,0.15);">
              Patient Location
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });
    };

    const marker = L.marker([currentCoords.lat, currentCoords.lng], {
      icon: createPatientIcon(),
      draggable: true,
    }).addTo(map);

    patientMarkerRef.current = marker;

    // Handle marker drag
    marker.on('dragend', (e) => {
      const newPos = e.target.getLatLng();
      const coords = { lat: newPos.lat, lng: newPos.lng };
      setCurrentCoords(coords);
      const newLoc = `Shivajinagar (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}), Pune`;
      setMapSearchText(newLoc);
      if (onLocationSelect) onLocationSelect(newLoc);
    });

    // Handle clicking anywhere on map to reposition patient pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const coords = { lat, lng };
      setCurrentCoords(coords);
      marker.setLatLng([lat, lng]);
      map.panTo([lat, lng], { animate: true });

      const newLoc = `Shivajinagar (${lat.toFixed(4)}, ${lng.toFixed(4)}), Pune`;
      setMapSearchText(newLoc);
      if (onLocationSelect) onLocationSelect(newLoc);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (patientMarkerRef.current && mapInstanceRef.current) {
      patientMarkerRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
    }
  }, [currentCoords]);

  // Tab click handler with non-blocking notice for future dispatch screens
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'hospitals') {
      triggerNotice('Hospital network preview available in Step 3');
    } else if (tabId === 'ambulances') {
      triggerNotice('Ambulance dispatch preview available in Step 3');
    }
  };

  const triggerNotice = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_ZOOM, {
        duration: 0.8,
      });
      setCurrentCoords(DEFAULT_CENTER);
      if (patientMarkerRef.current) {
        patientMarkerRef.current.setLatLng([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]);
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#E5E9ED] overflow-hidden select-none">
      {/* ── Interactive Leaflet Map Target ── */}
      <div
        ref={mapContainerRef}
        id="emergency-map-viewport"
        className="w-full h-full min-h-[460px] z-0"
      />

      {/* ── Top Map Controls Overlay ── */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-[400] flex flex-col gap-2.5 pointer-events-none">
        {/* Segmented Filter Tabs */}
        <div className="inline-flex items-center p-1 bg-white/95 backdrop-blur-md rounded-xl border border-[#E2E8F0] shadow-md pointer-events-auto self-start gap-1">
          <button
            type="button"
            onClick={() => handleTabClick('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'patient'
                ? 'bg-[#00A551] text-white shadow-xs'
                : 'text-[#4A4A4A] hover:bg-[#F1F5F9]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Patient Location</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('hospitals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hospitals'
                ? 'bg-[#00A551] text-white shadow-xs'
                : 'text-[#687280] hover:text-[#2D3748] hover:bg-[#F1F5F9]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals (15 km)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('ambulances')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ambulances'
                ? 'bg-[#00A551] text-white shadow-xs'
                : 'text-[#687280] hover:text-[#2D3748] hover:bg-[#F1F5F9]'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Ambulances (5 km)</span>
          </button>
        </div>

        {/* Map Search Bar */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#E2E8F0] shadow-md pointer-events-auto max-w-md w-full">
          <Search className="w-4 h-4 text-[#687280] shrink-0" />
          <input
            type="text"
            value={mapSearchText}
            onChange={(e) => {
              setMapSearchText(e.target.value);
              if (onLocationSelect) onLocationSelect(e.target.value);
            }}
            placeholder="Search location or nearby landmark"
            className="w-full text-xs font-semibold text-[#1A2741] placeholder-[#94A3B8] bg-transparent outline-none"
            aria-label="Search map location"
          />
          {mapSearchText && (
            <button
              type="button"
              onClick={() => {
                setMapSearchText('');
                if (onLocationSelect) onLocationSelect('');
              }}
              className="w-4 h-4 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#4A4A4A] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Notice Toast (Non-blocking notification) ── */}
      {showToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[500] px-4 py-2 rounded-full bg-[#1A2741]/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {toastMessage}
        </div>
      )}

      {/* ── Floating Zoom Controls & Recenter ── */}
      <div className="absolute top-3.5 right-3.5 z-[400] flex flex-col gap-1.5">
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-[#E2E8F0] overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in map"
            className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:bg-[#F8FAFC] active:bg-[#EDF2F7] transition-colors border-b border-[#E2E8F0] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out map"
            className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:bg-[#F8FAFC] active:bg-[#EDF2F7] transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Recenter map on patient"
          title="Recenter"
          className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] active:bg-[#EDF2F7] text-[#00A551] flex items-center justify-center shadow-md border border-[#E2E8F0] transition-colors cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* ── Click Hint Pill ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A2741]/85 text-white text-[11px] font-medium shadow-md backdrop-blur-xs pointer-events-none">
        <Navigation className="w-3 h-3 text-[#00A551]" />
        <span>Click anywhere on the map to set a patient location</span>
      </div>

      {/* ── Bottom-Left Patient Floating Card ── */}
      <div className="absolute bottom-3.5 left-3.5 z-[400] flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#00A551]/30 shadow-md">
        <div className="w-7 h-7 rounded-lg bg-[#E8F6E9] text-[#00A551] flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0 pr-2">
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#00A551]">
            Active Patient Pin
          </div>
          <div className="text-xs font-bold text-[#1A2741] truncate max-w-[220px]">
            {location || 'Shivajinagar, Pune'}
          </div>
        </div>
      </div>

      {/* ── Bottom-Right Legend ── */}
      <div className="absolute bottom-3.5 right-3.5 z-[400] flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-sm text-[10.5px] font-semibold text-[#4A4A4A]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A551]" />
          <span>Patient</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>Ambulance</span>
        </div>
      </div>
    </div>
  );
}
