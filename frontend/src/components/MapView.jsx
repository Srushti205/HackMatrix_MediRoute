import React, { useEffect, useRef, useState } from 'react';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import { hospitals } from '../data/hospitals';
import { ambulances } from '../data/ambulances';
import {
  PUNE_CENTER,
  DEFAULT_ZOOM,
  hasValidGoogleMapsKey,
  loadGoogleMaps,
  createSvgIcon,
  buildHospitalPopupHtml,
  buildAmbulancePopupHtml,
  buildEmergencyPopupHtml,
  MEDIROUTE_MAP_STYLES,
} from '../services/mapService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Info } from 'lucide-react';

export default function MapView({
  emergencies = [],
  selectedEmergencyId,
  onSelectEmergency,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ hospitals: [], ambulances: [], emergencies: [] });
  const activeInfoWindowRef = useRef(null);
  const [mapEngine, setMapEngine] = useState('loading'); // 'google', 'leaflet'
  const [activeIncidentBanner, setActiveIncidentBanner] = useState(null);

  // Initialize Map with StrictMode-safe lifecycle
  useEffect(() => {
    let isMounted = true;

    const setupMap = async () => {
      if (!mapContainerRef.current) return;

      // Reset any existing Leaflet ID to avoid "Map container is already initialized"
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }

      // Check for Google Maps Key
      if (hasValidGoogleMapsKey()) {
        try {
          await loadGoogleMaps();
          if (!isMounted || !mapContainerRef.current) return;
          initGoogleMap();
          if (isMounted) setMapEngine('google');
          return;
        } catch (err) {
          console.warn('[MediRoute] Google Maps load failed, falling back to Leaflet:', err);
        }
      }

      // Fallback: Leaflet + OpenStreetMap
      if (isMounted && mapContainerRef.current) {
        try {
          initLeafletMap();
          if (isMounted) setMapEngine('leaflet');
        } catch (err) {
          console.error('[MediRoute] Leaflet initialization error:', err);
        }
      }
    };

    setupMap();

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
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }
      markersRef.current = { hospitals: [], ambulances: [], emergencies: [] };
    };
  }, []);

  // ── 1. LEAFLET / OSM INITIALIZATION ──
  const initLeafletMap = () => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    const map = L.map(container, {
      center: [PUNE_CENTER.lat, PUNE_CENTER.lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    // Standard OpenStreetMap tiles (100% free, no API key, no watermark)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersRef.current = { hospitals: [], ambulances: [], emergencies: [] };

    // Add Hospitals
    hospitals.forEach((hosp) => {
      try {
        const hospitalIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="transform: translate(-50%, -100%); cursor: pointer; display: flex; flex-direction: column; align-items: center;">
              <div style="background: white; border: 2px solid #00A551; border-radius: 12px; padding: 3px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 5px;">
                <span style="width: 18px; height: 18px; border-radius: 5px; background: #00A551; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px;">+</span>
                <span style="font-size: 11px; font-weight: 700; color: #2D3748; white-space: nowrap;">${hosp.name}</span>
              </div>
              <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #00A551;"></div>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([hosp.latitude, hosp.longitude], { icon: hospitalIcon })
          .addTo(map)
          .bindPopup(buildHospitalPopupHtml(hosp), { offset: [0, -32] });

        markersRef.current.hospitals.push({ id: hosp.id, marker, data: hosp });
      } catch (e) {
        console.warn('Error adding hospital marker:', e);
      }
    });

    // Add Ambulances
    ambulances.forEach((amb) => {
      try {
        const isEnRoute = amb.status === 'En Route';
        const isAssigned = amb.status === 'Assigned';
        const bg = isEnRoute ? '#00A551' : isAssigned ? '#D97706' : '#71BC75';

        const ambulanceIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="transform: translate(-50%, -50%); cursor: pointer; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${bg}; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3m14 0h2v-5.34a2 2 0 0 0-.59-1.42L17.5 9.33A2 2 0 0 0 16.08 9H14v8h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
              </div>
              <span style="margin-top: 2px; background: rgba(255,255,255,0.95); font-size: 9px; font-weight: 800; color: #4A4A4A; padding: 1px 4px; border-radius: 4px; border: 1px solid #E6ECE3; box-shadow: 0 1px 3px rgba(0,0,0,0.08); white-space: nowrap;">
                ${amb.id}
              </span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([amb.latitude, amb.longitude], { icon: ambulanceIcon })
          .addTo(map)
          .bindPopup(buildAmbulancePopupHtml(amb), { offset: [0, -18] });

        markersRef.current.ambulances.push({ id: amb.id, marker, data: amb });
      } catch (e) {
        console.warn('Error adding ambulance marker:', e);
      }
    });

    // Add Emergencies
    emergencies.forEach((em) => {
      try {
        const emergencyIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="transform: translate(-50%, -50%); cursor: pointer; display: flex; flex-direction: column; align-items: center; position: relative;">
              <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(239,68,68,0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 30px; height: 30px; border-radius: 50%; background: #EF4444; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(239,68,68,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 13px;">
                !
              </div>
              <span style="margin-top: 2px; background: #2D3748; color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.15); white-space: nowrap;">
                ${em.id}
              </span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([em.latitude, em.longitude], { icon: emergencyIcon })
          .addTo(map)
          .bindPopup(buildEmergencyPopupHtml(em), { offset: [0, -20] });

        marker.on('click', () => {
          if (onSelectEmergency) onSelectEmergency(em);
        });

        markersRef.current.emergencies.push({ id: em.id, marker, data: em });
      } catch (e) {
        console.warn('Error adding emergency marker:', e);
      }
    });

    // Add Route Polyline for active incident AMB-107 -> EM-1042 -> Ruby Hall Clinic
    try {
      const routeCoords = [
        [18.5360, 73.8640],
        [18.5395, 73.8560],
        [18.5324, 73.8786],
      ];
      L.polyline(routeCoords, {
        color: '#00A551',
        weight: 4,
        dashArray: '8, 6',
        opacity: 0.85,
      }).addTo(map);
    } catch (e) {
      console.warn('Error adding route polyline:', e);
    }
  };

  // ── 2. GOOGLE MAPS API INITIALIZATION ──
  const initGoogleMap = () => {
    if (!window.google || !mapContainerRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: PUNE_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: MEDIROUTE_MAP_STYLES,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    });

    mapInstanceRef.current = map;
    markersRef.current = { hospitals: [], ambulances: [], emergencies: [] };
    const infoWindow = new window.google.maps.InfoWindow();
    activeInfoWindowRef.current = infoWindow;

    // Add Hospitals
    hospitals.forEach((hosp) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hosp.latitude, lng: hosp.longitude },
        map,
        title: hosp.name,
        icon: {
          url: createSvgIcon('hospital', '#00A551'),
          scaledSize: new window.google.maps.Size(34, 42),
          anchor: new window.google.maps.Point(17, 42),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildHospitalPopupHtml(hosp));
        infoWindow.open(map, marker);
      });

      markersRef.current.hospitals.push({ id: hosp.id, marker, data: hosp });
    });

    // Add Ambulances
    ambulances.forEach((amb) => {
      const color = amb.status === 'En Route' ? '#00A551' : amb.status === 'Assigned' ? '#D97706' : '#71BC75';
      const marker = new window.google.maps.Marker({
        position: { lat: amb.latitude, lng: amb.longitude },
        map,
        title: amb.id,
        icon: {
          url: createSvgIcon('ambulance', color),
          scaledSize: new window.google.maps.Size(34, 42),
          anchor: new window.google.maps.Point(17, 42),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildAmbulancePopupHtml(amb));
        infoWindow.open(map, marker);
      });

      markersRef.current.ambulances.push({ id: amb.id, marker, data: amb });
    });

    // Add Emergencies
    emergencies.forEach((em) => {
      const marker = new window.google.maps.Marker({
        position: { lat: em.latitude, lng: em.longitude },
        map,
        title: em.id,
        icon: {
          url: createSvgIcon('emergency', '#EF4444'),
          scaledSize: new window.google.maps.Size(36, 44),
          anchor: new window.google.maps.Point(18, 44),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildEmergencyPopupHtml(em));
        infoWindow.open(map, marker);
        if (onSelectEmergency) onSelectEmergency(em);
      });

      markersRef.current.emergencies.push({ id: em.id, marker, data: em });
    });

    // Add Polyline
    const routePath = [
      { lat: 18.5360, lng: 73.8640 },
      { lat: 18.5395, lng: 73.8560 },
      { lat: 18.5324, lng: 73.8786 },
    ];
    new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#00A551',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map,
    });
  };

  // ── 3. INTERACTION: PAN & FOCUS ON SELECTED EMERGENCY ──
  useEffect(() => {
    if (!selectedEmergencyId || !mapInstanceRef.current) return;

    const target = emergencies.find((e) => e.id === selectedEmergencyId);
    if (!target) return;

    setActiveIncidentBanner(`${target.id}: ${target.type} (${target.status})`);

    try {
      if (mapEngine === 'google' && window.google) {
        const map = mapInstanceRef.current;
        const targetLatLng = new window.google.maps.LatLng(target.latitude, target.longitude);
        map.panTo(targetLatLng);
        map.setZoom(15);

        const emRecord = markersRef.current.emergencies.find((m) => m.id === target.id);
        if (emRecord && activeInfoWindowRef.current) {
          activeInfoWindowRef.current.setContent(buildEmergencyPopupHtml(target));
          activeInfoWindowRef.current.open(map, emRecord.marker);
        }
      } else if (mapEngine === 'leaflet') {
        const map = mapInstanceRef.current;
        map.flyTo([target.latitude, target.longitude], 15, { duration: 1.2 });

        const emRecord = markersRef.current.emergencies.find((m) => m.id === target.id);
        if (emRecord && emRecord.marker) {
          emRecord.marker.openPopup();
        }
      }
    } catch (e) {
      console.warn('Error focusing on emergency:', e);
    }
  }, [selectedEmergencyId, mapEngine, emergencies]);

  // ── 4. CUSTOM MAP CONTROLS HANDLERS ──
  const handleZoomIn = () => {
    try {
      if (!mapInstanceRef.current) return;
      if (mapEngine === 'google') {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
      } else if (mapEngine === 'leaflet') {
        mapInstanceRef.current.zoomIn();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleZoomOut = () => {
    try {
      if (!mapInstanceRef.current) return;
      if (mapEngine === 'google') {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
      } else if (mapEngine === 'leaflet') {
        mapInstanceRef.current.zoomOut();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRecenter = () => {
    try {
      if (!mapInstanceRef.current) return;
      if (mapEngine === 'google' && window.google) {
        mapInstanceRef.current.panTo(PUNE_CENTER);
        mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
      } else if (mapEngine === 'leaflet') {
        mapInstanceRef.current.flyTo([PUNE_CENTER.lat, PUNE_CENTER.lng], DEFAULT_ZOOM);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[520px] overflow-hidden bg-[#EFF3EE] select-none ${className}`}>
      {/* ── Real Interactive Map Element ── */}
      <div
        ref={mapContainerRef}
        id="mediroute-map-container"
        className="w-full h-full min-h-[520px] z-0"
        tabIndex={0}
      />

      {/* ── Top-Right Floating Controls & Map Legend ── */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-3 pointer-events-auto">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
        />
        <MapLegend />
      </div>

      {/* ── Bottom Operational Telemetry Status ── */}
      <div className="absolute bottom-3 left-4 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-[#E6ECE3] text-[11px] text-[#4A4A4A] shadow-sm select-none">
        <MapPin className="w-3.5 h-3.5 text-[#00A551]" />
        <span>Operational Zone: <strong>Pune Central (Maharashtra)</strong></span>
        <span className="text-[#CBD5E1]">&bull;</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#00A551]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A551] animate-pulse" />
          {mapEngine === 'google' ? 'Google Maps API' : 'Leaflet Interactive Grid'}
        </span>
      </div>

      {/* ── Interactive Focus Banner ── */}
      {activeIncidentBanner && (
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-sm border border-[#00A551]/30 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs font-semibold text-[#2D3748]">
          <Info className="w-4 h-4 text-[#00A551]" />
          <span>Tracking: <strong className="text-[#00A551]">{activeIncidentBanner}</strong></span>
        </div>
      )}
    </div>
  );
}
