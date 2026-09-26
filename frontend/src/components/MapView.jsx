import React, { useEffect, useRef, useState, useCallback } from 'react';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import { hospitals } from '../data/hospitals';
import { ambulances } from '../data/ambulances';
import {
  PUNE_CENTER,
  DEFAULT_ZOOM,
  hasValidGoogleMapsKey,
  loadGoogleMaps,
  calculateDistanceKm,
  createHospitalIcon,
  createAmbulanceWithDistanceIcon,
  createRouteMidpointBadgeIcon,
  createEmergencyIcon,
  buildHospitalPopupHtml,
  buildAmbulancePopupHtml,
  buildEmergencyPopupHtml,
  MEDIROUTE_MAP_STYLES,
} from '../services/mapService';
import { MapPin, Info, Key, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function MapView({
  emergencies = [],
  selectedEmergencyId,
  onSelectEmergency,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({
    hospitals: [],
    ambulances: [],
    emergencies: [],
    badges: [],
  });
  const polylinesRef = useRef([]);
  const circleRef = useRef(null);
  const activeInfoWindowRef = useRef(null);

  const [mapStatus, setMapStatus] = useState('loading'); // 'loading' | 'loaded' | 'missing_key' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeIncidentBanner, setActiveIncidentBanner] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);

  // Initialize Google Maps instance with 15 hospitals, 5 ambulances with distance written, and corridors
  const initGoogleMap = useCallback(() => {
    if (!window.google || !mapContainerRef.current) return;

    // Create Google Map instance
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: PUNE_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: MEDIROUTE_MAP_STYLES,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;
    markersRef.current = { hospitals: [], ambulances: [], emergencies: [], badges: [] };
    polylinesRef.current = [];

    const infoWindow = new window.google.maps.InfoWindow();
    activeInfoWindowRef.current = infoWindow;

    // ── 0. Add 15 km Operational Zone Boundary Circle ──
    circleRef.current = new window.google.maps.Circle({
      strokeColor: '#00A551',
      strokeOpacity: 0.45,
      strokeWeight: 1.5,
      fillColor: '#00A551',
      fillOpacity: 0.025,
      map,
      center: PUNE_CENTER,
      radius: 15000, // 15 km radius
      clickable: false,
    });

    // ── 1. Add Hospitals (15 in 15km zone + regional hospitals visible on zoom out) ──
    hospitals.forEach((hosp) => {
      // Check if any ambulance is heading to this hospital
      const inboundAmb = ambulances.find(
        (a) =>
          a.destinationHospitalId === hosp.id ||
          (a.destination && a.destination.toLowerCase().includes(hosp.name.toLowerCase()))
      );

      const marker = new window.google.maps.Marker({
        position: { lat: hosp.latitude, lng: hosp.longitude },
        map,
        title: hosp.name,
        icon: {
          url: createHospitalIcon(hosp),
          scaledSize: new window.google.maps.Size(44, 54),
          anchor: new window.google.maps.Point(22, 54),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildHospitalPopupHtml(hosp, inboundAmb));
        infoWindow.open({ anchor: marker, map });
      });

      markersRef.current.hospitals.push({ id: hosp.id, marker, data: hosp });
    });

    // ── 2. Add 5 Ambulances with Distance & Transit Corridors ──
    ambulances.forEach((amb) => {
      // Find destination hospital
      const targetHosp =
        hospitals.find((h) => h.id === amb.destinationHospitalId) ||
        hospitals.find((h) => h.name.toLowerCase() === amb.destination.toLowerCase()) ||
        hospitals[0];

      // Calculate real distance if not hardcoded
      const distKm = calculateDistanceKm(
        amb.latitude,
        amb.longitude,
        targetHosp.latitude,
        targetHosp.longitude
      );
      const computedAmb = {
        ...amb,
        distanceKm: amb.distanceKm || `${distKm} km`,
      };

      // Draw corridor line connecting ambulance to hospital
      const corridorPolyline = new window.google.maps.Polyline({
        path: [
          { lat: amb.latitude, lng: amb.longitude },
          { lat: targetHosp.latitude, lng: targetHosp.longitude },
        ],
        geodesic: true,
        strokeColor: '#00A551',
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map,
      });

      corridorPolyline.addListener('click', () => {
        infoWindow.setContent(buildAmbulancePopupHtml(computedAmb, targetHosp));
        infoWindow.setPosition({
          lat: (amb.latitude + targetHosp.latitude) / 2,
          lng: (amb.longitude + targetHosp.longitude) / 2,
        });
        infoWindow.open(map);
      });

      polylinesRef.current.push(corridorPolyline);

      // Midpoint Distance Pill Marker on the Route
      const midLat = (amb.latitude + targetHosp.latitude) / 2;
      const midLng = (amb.longitude + targetHosp.longitude) / 2;

      const badgeMarker = new window.google.maps.Marker({
        position: { lat: midLat, lng: midLng },
        map,
        title: `${amb.id} ➔ ${targetHosp.name}: ${computedAmb.distanceKm}`,
        icon: {
          url: createRouteMidpointBadgeIcon(computedAmb.distanceKm, targetHosp.name),
          scaledSize: new window.google.maps.Size(138, 28),
          anchor: new window.google.maps.Point(69, 14),
        },
      });

      badgeMarker.addListener('click', () => {
        infoWindow.setContent(buildAmbulancePopupHtml(computedAmb, targetHosp));
        infoWindow.open({ anchor: badgeMarker, map });
      });

      markersRef.current.badges.push(badgeMarker);

      // Ambulance Marker with Distance Written Directly On It
      const ambMarker = new window.google.maps.Marker({
        position: { lat: amb.latitude, lng: amb.longitude },
        map,
        title: `${amb.id} (${computedAmb.distanceKm} to ${targetHosp.name})`,
        icon: {
          url: createAmbulanceWithDistanceIcon(computedAmb),
          scaledSize: new window.google.maps.Size(108, 66),
          anchor: new window.google.maps.Point(54, 33),
        },
      });

      ambMarker.addListener('click', () => {
        infoWindow.setContent(buildAmbulancePopupHtml(computedAmb, targetHosp));
        infoWindow.open({ anchor: ambMarker, map });
      });

      markersRef.current.ambulances.push({
        id: amb.id,
        marker: ambMarker,
        data: computedAmb,
        corridor: corridorPolyline,
      });
    });

    // ── 3. Add Emergency Incident Markers ──
    emergencies.forEach((em) => {
      const marker = new window.google.maps.Marker({
        position: { lat: em.latitude, lng: em.longitude },
        map,
        title: em.id,
        icon: {
          url: createEmergencyIcon(),
          scaledSize: new window.google.maps.Size(36, 44),
          anchor: new window.google.maps.Point(18, 44),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildEmergencyPopupHtml(em));
        infoWindow.open({ anchor: marker, map });
        if (onSelectEmergency) {
          onSelectEmergency(em);
        }
      });

      markersRef.current.emergencies.push({ id: em.id, marker, data: em });
    });

    // ── 4. Zoom Change Listener ──
    map.addListener('zoom_changed', () => {
      setCurrentZoom(map.getZoom());
    });
  }, [emergencies, onSelectEmergency]);

  // Load and mount Google Maps via @googlemaps/js-api-loader
  const loadAndInitializeMap = useCallback(async () => {
    if (!hasValidGoogleMapsKey()) {
      setMapStatus('missing_key');
      return;
    }

    setMapStatus('loading');
    setErrorMessage(null);

    try {
      await loadGoogleMaps();
      if (!mapContainerRef.current) return;
      initGoogleMap();
      setMapStatus('loaded');
    } catch (err) {
      console.error('[MediRoute] Google Maps load error:', err);
      setErrorMessage(err?.message || 'Failed to load Google Maps JavaScript API');
      setMapStatus('error');
    }
  }, [initGoogleMap]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      loadAndInitializeMap();
    }

    return () => {
      isMounted = false;
      // Cleanup all markers
      if (markersRef.current) {
        if (markersRef.current.hospitals) {
          markersRef.current.hospitals.forEach(({ marker }) => marker?.setMap(null));
        }
        if (markersRef.current.ambulances) {
          markersRef.current.ambulances.forEach(({ marker }) => marker?.setMap(null));
        }
        if (markersRef.current.emergencies) {
          markersRef.current.emergencies.forEach(({ marker }) => marker?.setMap(null));
        }
        if (markersRef.current.badges) {
          markersRef.current.badges.forEach((marker) => marker?.setMap(null));
        }
        markersRef.current = { hospitals: [], ambulances: [], emergencies: [], badges: [] };
      }
      if (polylinesRef.current) {
        polylinesRef.current.forEach((poly) => poly?.setMap(null));
        polylinesRef.current = [];
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close();
        activeInfoWindowRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [loadAndInitializeMap]);

  // Pan & Focus on Selected Emergency Incident
  useEffect(() => {
    if (!selectedEmergencyId || !mapInstanceRef.current || !window.google) return;

    const target = emergencies.find((e) => e.id === selectedEmergencyId);
    if (!target) return;

    setActiveIncidentBanner(`${target.id}: ${target.type} (${target.status})`);

    try {
      const map = mapInstanceRef.current;
      const targetLatLng = new window.google.maps.LatLng(target.latitude, target.longitude);
      map.panTo(targetLatLng);
      map.setZoom(15);

      const emRecord = markersRef.current.emergencies.find((m) => m.id === target.id);
      if (emRecord && activeInfoWindowRef.current) {
        activeInfoWindowRef.current.setContent(buildEmergencyPopupHtml(target));
        activeInfoWindowRef.current.open({
          anchor: emRecord.marker,
          map,
        });
      }
    } catch (e) {
      console.warn('Error focusing on emergency:', e);
    }
  }, [selectedEmergencyId, emergencies]);

  // Map Controls: Zoom & Recenter
  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current || !window.google) return;
    mapInstanceRef.current.panTo(PUNE_CENTER);
    mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[520px] overflow-hidden bg-[#EFF3EE] select-none ${className}`}
    >
      {/* ── Google Maps Target Container ── */}
      <div
        ref={mapContainerRef}
        id="mediroute-google-map-container"
        className="w-full h-full min-h-[520px] z-0"
        tabIndex={0}
      />

      {/* ── API Key Missing State ── */}
      {mapStatus === 'missing_key' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#FAF9F5]/95 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E6ECE3] shadow-xl text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F6E9] border border-[#00A551]/20 flex items-center justify-center text-[#00A551] mb-4 shadow-sm">
              <Key className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-[#2A362C] mb-2">
              Google Maps API Key Required
            </h3>

            <p className="text-xs text-[#687280] mb-5 leading-relaxed">
              To display the real-time Google Maps dispatcher grid with live telemetry and traffic,
              configure your API key in the environment file:
            </p>

            <div className="bg-[#FAF9F5] border border-[#D7E3D5] rounded-xl p-3 text-left mb-5 font-mono text-xs text-[#2A362C]">
              <div className="text-[10px] text-[#687280] uppercase tracking-wider font-semibold mb-1">
                .env
              </div>
              <div className="text-[#00A551] font-bold select-all break-all">
                VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
              </div>
            </div>

            <div className="text-[11px] text-[#687280] mb-5">
              After adding your key, restart your development server (<code className="px-1.5 py-0.5 bg-[#EFF3EE] rounded text-[#2A362C] font-semibold">npm run dev</code>).
            </div>

            <button
              type="button"
              onClick={loadAndInitializeMap}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A551] hover:bg-[#008f45] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Map Connection</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Loading State ── */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAF9F5]/70 backdrop-blur-xs">
          <div className="w-10 h-10 border-3 border-[#00A551] border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-bold text-[#00A551] tracking-wide">
            Loading Google Maps Dispatcher Grid...
          </span>
        </div>
      )}

      {/* ── Error State ── */}
      {mapStatus === 'error' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#FAF9F5]/95 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-[#FEE2E2] shadow-xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#991B1B] mb-2">
              Google Maps Loading Error
            </h3>
            <p className="text-xs text-[#687280] mb-4">
              {errorMessage || 'Unable to connect to Google Maps JavaScript API services.'}
            </p>
            <button
              type="button"
              onClick={loadAndInitializeMap}
              className="px-4 py-2 bg-[#00A551] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Top-Right Floating Controls & Map Legend ── */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-3 pointer-events-auto">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
        />
        <MapLegend />
      </div>

      {/* ── Top-Left Operational Zone & Radius Indicator ── */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-auto">
        {/* Active Incident Banner (if an emergency is focused) */}
        {activeIncidentBanner && (
          <div className="bg-white/95 backdrop-blur-sm border border-[#00A551]/30 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs font-semibold text-[#2D3748]">
            <Info className="w-4 h-4 text-[#00A551]" />
            <span>
              Tracking: <strong className="text-[#00A551]">{activeIncidentBanner}</strong>
            </span>
          </div>
        )}

        {/* 15 km Radius & Zoom Level Chip */}
        <div className="bg-white/95 backdrop-blur-sm border border-[#E6ECE3] rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2 text-[11px] text-[#4A4A4A]">
          <Layers className="w-3.5 h-3.5 text-[#00A551]" />
          <span>
            {currentZoom < 12 ? (
              <span>
                <strong>Metropolitan View:</strong> 19 Hospitals Active (15 in 15km Zone + 4 Regional)
              </span>
            ) : (
              <span>
                <strong>Active Operational Zone:</strong> 15 Hospitals within 15 km &bull; 5 Ambulances En Route
              </span>
            )}
          </span>
        </div>
      </div>

      {/* ── Bottom Operational Telemetry Status ── */}
      <div className="absolute bottom-3 left-4 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-[#E6ECE3] text-[11px] text-[#4A4A4A] shadow-sm select-none">
        <MapPin className="w-3.5 h-3.5 text-[#00A551]" />
        <span>
          Zone: <strong>Pune Central (15 km Operational Radius)</strong>
        </span>
        <span className="text-[#CBD5E1]">&bull;</span>
        <span className="text-[#00A551] font-semibold">5 Corridors Active</span>
        <span className="text-[#CBD5E1]">&bull;</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#00A551]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A551] animate-pulse" />
          Google Maps Live Fleet Tracking
        </span>
      </div>
    </div>
  );
}
