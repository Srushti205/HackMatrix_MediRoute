import React, { useEffect, useRef, useState, useCallback } from 'react';
import TopNavbar from '../components/TopNavbar';
import { ambulanceHubs } from '../data/ambulanceHubs';
import {
  PUNE_CENTER,
  loadGoogleMaps,
  hasValidGoogleMapsKey,
  MEDIROUTE_MAP_STYLES,
} from '../services/mapService';
import { X, MapPin, Ambulance, User, Phone, Building2, Tag, Activity } from 'lucide-react';

// Status badge color helper
function statusColor(status) {
  if (status === 'Available') return { bg: '#E8F6E9', text: '#00A551', border: '#71BC75' };
  if (status === 'En Route') return { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' };
  return { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' };
}

// Type badge color
function typeColor(type) {
  return type === 'ALS'
    ? { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' }
    : { bg: '#EFF6FF', text: '#2563EB', border: '#93C5FD' };
}

// Creates an SVG hub dot marker
function createHubDotSvg(totalAmbs, availCount) {
  const allAvailable = availCount === totalAmbs;
  const noneAvailable = availCount === 0;
  const color = noneAvailable ? '#DC2626' : allAvailable ? '#00A551' : '#D97706';
  const ring = noneAvailable ? '#FCA5A5' : allAvailable ? '#71BC75' : '#FCD34D';
  const svg = `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="20" fill="${ring}" opacity="0.35"/>
    <circle cx="22" cy="22" r="14" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
    <text x="22" y="27" fill="#FFFFFF" font-family="system-ui,sans-serif" font-size="11" font-weight="800" text-anchor="middle">${totalAmbs}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function AmbulancesPage() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const [mapStatus, setMapStatus] = useState('loading');
  const [selectedHub, setSelectedHub] = useState(null);

  const initMap = useCallback(() => {
    if (!window.google || !mapContainerRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: PUNE_CENTER,
      zoom: 12,
      styles: MEDIROUTE_MAP_STYLES,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();
    markersRef.current = [];

    ambulanceHubs.forEach((hub) => {
      const availCount = hub.ambulances.filter((a) => a.status === 'Available').length;

      const marker = new window.google.maps.Marker({
        position: { lat: hub.lat, lng: hub.lng },
        map,
        title: hub.name,
        icon: {
          url: createHubDotSvg(hub.ambulances.length, availCount),
          scaledSize: new window.google.maps.Size(44, 44),
          anchor: new window.google.maps.Point(22, 22),
        },
      });

      marker.addListener('click', () => {
        // Pan map to hub
        map.panTo({ lat: hub.lat, lng: hub.lng });
        map.setZoom(14);
        // Open sidebar panel
        setSelectedHub(hub);
      });

      markersRef.current.push(marker);
    });

    setMapStatus('loaded');
  }, []);

  useEffect(() => {
    if (!hasValidGoogleMapsKey()) {
      setMapStatus('no_key');
      return;
    }
    loadGoogleMaps()
      .then(() => initMap())
      .catch(() => setMapStatus('error'));
  }, [initMap]);

  // Cleanup
  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => m?.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) infoWindowRef.current.close();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAF9F5] overflow-hidden select-none font-sans">
      <TopNavbar activeNav="Ambulances" />

      <div className="flex-1 flex overflow-hidden relative">
        {/* ── Full-screen Map ── */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading overlay */}
          {mapStatus === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF9F5]/80 z-10">
              <div className="w-10 h-10 border-4 border-[#00A551] border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm font-bold text-[#00A551]">Loading Ambulance Fleet Map…</span>
            </div>
          )}

          {mapStatus === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#FAF9F5]/90 z-10">
              <div className="text-center p-6">
                <p className="text-[#DC2626] font-bold mb-2">Failed to load Google Maps</p>
                <p className="text-sm text-[#687280]">Check your API key and network connection.</p>
              </div>
            </div>
          )}

          {/* Legend chip */}
          {mapStatus === 'loaded' && (
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-white/95 backdrop-blur-sm border border-[#E6ECE3] rounded-xl px-3 py-2 shadow-md text-[11px] text-[#4A4A4A] flex flex-col gap-1.5">
                <div className="font-bold text-[#1A2741] mb-0.5">Hub Dot Legend</div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#00A551] inline-block border-2 border-white shadow-sm" />
                  <span>All Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] inline-block border-2 border-white shadow-sm" />
                  <span>Partially Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#DC2626] inline-block border-2 border-white shadow-sm" />
                  <span>None Available</span>
                </div>
                <div className="text-[10px] text-[#687280] mt-0.5">Number = ambulances at hub</div>
              </div>
            </div>
          )}

          {/* Top chip */}
          {mapStatus === 'loaded' && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/95 backdrop-blur-sm border border-[#E6ECE3] rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs font-semibold text-[#1A2741]">
                <Activity className="w-3.5 h-3.5 text-[#00A551] animate-pulse" />
                <span>{ambulanceHubs.length} Ambulance Hubs · Pune</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Side Panel: Hub Details ── */}
        {selectedHub && (
          <div className="w-80 flex-shrink-0 bg-white border-l border-[#E6ECE3] flex flex-col overflow-hidden shadow-lg z-20">
            {/* Panel Header */}
            <div className="px-5 py-4 border-b border-[#E6ECE3] bg-[#FAF9F5] flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <MapPin className="w-4 h-4 text-[#00A551] shrink-0" />
                  <h2 className="text-sm font-extrabold text-[#1A2741] leading-tight">{selectedHub.name}</h2>
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#E8F6E9] text-[#00A551] text-[10px] font-bold border border-[#71BC75]/40">
                  {selectedHub.zone} Zone · {selectedHub.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHub(null)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#687280] hover:text-[#1A2741] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ambulances List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687280] mb-2">
                {selectedHub.ambulances.length} Ambulance{selectedHub.ambulances.length > 1 ? 's' : ''} at this hub
              </div>
              {selectedHub.ambulances.map((amb) => {
                const sc = statusColor(amb.status);
                const tc = typeColor(amb.type);
                return (
                  <div
                    key={amb.id}
                    className="bg-white rounded-xl border border-[#E6ECE3] shadow-sm p-4 space-y-3"
                  >
                    {/* Ambulance ID + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-[#1A2741]">{amb.id}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                      >
                        {amb.status}
                      </span>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#4A4A4A]">
                        <Tag className="w-3.5 h-3.5 text-[#687280] shrink-0" />
                        <span className="font-semibold text-[#687280]">Plate:</span>
                        <span className="font-bold text-[#1A2741] font-mono">{amb.licensePlate}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#4A4A4A]">
                        <User className="w-3.5 h-3.5 text-[#687280] shrink-0" />
                        <span className="font-semibold text-[#687280]">Driver:</span>
                        <span className="font-bold text-[#1A2741]">{amb.driver}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#4A4A4A]">
                        <Phone className="w-3.5 h-3.5 text-[#687280] shrink-0" />
                        <span className="font-semibold text-[#687280]">Contact:</span>
                        <span className="font-medium text-[#4A4A4A]">{amb.contact}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#4A4A4A]">
                        <Building2 className="w-3.5 h-3.5 text-[#687280] shrink-0" />
                        <span className="font-semibold text-[#687280]">Hospital:</span>
                        <span className="font-medium text-[#4A4A4A]">{amb.hospital}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Ambulance className="w-3.5 h-3.5 text-[#687280] shrink-0" />
                        <span className="font-semibold text-[#687280]">Type:</span>
                        <span
                          className="font-bold text-xs px-2 py-0.5 rounded-md border"
                          style={{ background: tc.bg, color: tc.text, borderColor: tc.border }}
                        >
                          {amb.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
