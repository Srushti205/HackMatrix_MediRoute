import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Key,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { hospitals } from '../data/hospitals';
import { availableAmbulances } from '../data/ambulances';
import {
  PUNE_CENTER,
  hasValidGoogleMapsKey,
  loadGoogleMaps,
  calculateDistanceKm,
  createHospitalIcon,
  createPatientMarkerIcon,
  createAvailableAmbulanceMarkerIcon,
  createEmergencyIcon,
  buildNearbyHospitalPopupHtml,
  buildAvailableAmbulancePopupHtml,
  buildHospitalPopupHtml,
  MEDIROUTE_MAP_STYLES,
  resolvePuneLocation,
  reverseGeocodeLocation,
} from '../services/mapService';

const DEFAULT_ZOOM = 14;

export default function EmergencyMapPanel({
  location = 'Shivajinagar, Pune, Maharashtra, India',
  patientLocation,
  onLocationSelect,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapInitializedRef = useRef(false);
  const patientMarkerRef = useRef(null);
  const hospitalMarkersRef = useRef([]);
  const ambulanceMarkersRef = useRef([]);
  const polylinesRef = useRef([]);
  const badgesRef = useRef([]);
  const circleRef = useRef(null);
  const activeInfoWindowRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const onLocationSelectRef = useRef(onLocationSelect);

  // Keep onLocationSelectRef synchronized
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  const initialLat = patientLocation?.latitude || PUNE_CENTER.lat;
  const initialLng = patientLocation?.longitude || PUNE_CENTER.lng;

  const [mapStatus, setMapStatus] = useState('loading'); // 'loading' | 'loaded' | 'missing_key' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' | 'hospitals' | 'ambulances'
  const [mapSearchText, setMapSearchText] = useState(location);
  const [currentCoords, setCurrentCoords] = useState({ lat: initialLat, lng: initialLng });
  const [currentAddress, setCurrentAddress] = useState(location);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Sync search input if location prop changes externally
  useEffect(() => {
    if (location && location !== mapSearchText) {
      setMapSearchText(location);
      setCurrentAddress(location);
    }
  }, [location]);

  // Sync coordinates and map position smoothly when patientLocation prop updates
  useEffect(() => {
    if (
      patientLocation?.latitude &&
      patientLocation?.longitude &&
      mapInstanceRef.current
    ) {
      const lat = Number(patientLocation.latitude);
      const lng = Number(patientLocation.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const newCoords = { lat, lng };
      setCurrentCoords(newCoords);
      if (patientLocation.address) {
        setCurrentAddress(patientLocation.address);
        setMapSearchText(patientLocation.address);
      }
      if (patientMarkerRef.current) {
        patientMarkerRef.current.setPosition(newCoords);
        patientMarkerRef.current.setVisible(true);
      }
      if (circleRef.current) {
        circleRef.current.setCenter(newCoords);
      }
      mapInstanceRef.current.panTo(newCoords);
      mapInstanceRef.current.setZoom(14);
    }
  }, [patientLocation?.latitude, patientLocation?.longitude, patientLocation?.address]);

  const triggerNotice = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handler for pin relocations (dragend or map click)
  const handleLocationPicked = async (lat, lng) => {
    setCurrentCoords({ lat, lng });
    if (circleRef.current) {
      circleRef.current.setCenter({ lat, lng });
    }
    setIsReverseGeocoding(true);
    const resolved = await reverseGeocodeLocation(lat, lng);
    setIsReverseGeocoding(false);

    if (resolved) {
      setCurrentAddress(resolved.address);
      setMapSearchText(resolved.address);
      if (onLocationSelectRef.current) {
        onLocationSelectRef.current(resolved);
      }
      triggerNotice(`Location pinned: ${resolved.address.split(',')[0]}`);
    }
  };

  // Forward Geocode search string
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!mapSearchText || !mapSearchText.trim()) return;

    setIsReverseGeocoding(true);
    const resolved = await resolvePuneLocation(mapSearchText);
    setIsReverseGeocoding(false);

    if (resolved) {
      const { latitude: lat, longitude: lng, address, placeId } = resolved;

      setCurrentCoords({ lat, lng });
      setCurrentAddress(address);
      setMapSearchText(address);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat, lng });
        mapInstanceRef.current.setZoom(14);
      }
      if (circleRef.current) {
        circleRef.current.setCenter({ lat, lng });
      }
      if (patientMarkerRef.current) {
        patientMarkerRef.current.setPosition({ lat, lng });
        patientMarkerRef.current.setVisible(true);
      }

      if (onLocationSelectRef.current) {
        onLocationSelectRef.current({
          address,
          latitude: lat,
          longitude: lng,
          placeId,
        });
      }
      triggerNotice(`Location pinned: ${address.split(',')[0]}`);
    } else {
      triggerNotice('Location not found. Try searching for a nearby landmark or society name.');
    }
  };

  // Toggle Tab filtering (Patient / Hospitals 15km / Ambulances 5km)
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    if (!mapInstanceRef.current || !window.google) return;

    if (tabId === 'patient') {
      mapInstanceRef.current.panTo(currentCoords);
      mapInstanceRef.current.setZoom(15);
      triggerNotice('Focused on Patient Location');
    } else if (tabId === 'hospitals') {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(currentCoords);
      hospitalMarkersRef.current.forEach(({ marker }) => {
        const pos = marker.getPosition();
        if (pos) bounds.extend(pos);
      });
      mapInstanceRef.current.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });
      triggerNotice('Showing 15 hospitals within 15 km zone');
    } else if (tabId === 'ambulances') {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(currentCoords);
      ambulanceMarkersRef.current.forEach(({ marker }) => {
        const pos = marker.getPosition();
        if (pos) bounds.extend(pos);
      });
      mapInstanceRef.current.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });
      triggerNotice('Showing 5 active ambulances within 5 km zone');
    }
  };

  // Update visibility and focus of Hospital / Ambulance markers based on activeTab
  useEffect(() => {
    if (!window.google || !mapInstanceRef.current) return;

    hospitalMarkersRef.current.forEach(({ marker }) => {
      marker.setMap(mapInstanceRef.current);
      marker.setOpacity(activeTab === 'ambulances' ? 0.6 : 1.0);
    });

    ambulanceMarkersRef.current.forEach(({ marker }) => {
      marker.setMap(mapInstanceRef.current);
      marker.setOpacity(activeTab === 'hospitals' ? 0.6 : 1.0);
    });
  }, [activeTab]);

  // Initialize interactive Google Map strictly once
  const initGoogleMap = useCallback(() => {
    if (!window.google || !mapContainerRef.current) return;

    const initialPos = {
      lat: initialLat,
      lng: initialLng,
    };

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: initialPos,
      zoom: DEFAULT_ZOOM,
      styles: MEDIROUTE_MAP_STYLES,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    const infoWindow = new window.google.maps.InfoWindow();
    activeInfoWindowRef.current = infoWindow;

    // ── 0. 15 km Operational Zone Circle around Patient ──
    const circle = new window.google.maps.Circle({
      strokeColor: '#00A551',
      strokeOpacity: 0.4,
      strokeWeight: 1.5,
      fillColor: '#00A551',
      fillOpacity: 0.025,
      map,
      center: initialPos,
      radius: 15000,
      clickable: false,
    });
    circleRef.current = circle;

    // ── 1. Create Patient Location Marker (Draggable) ──
    const patientMarker = new window.google.maps.Marker({
      position: initialPos,
      map,
      draggable: true,
      title: 'Patient Location (Click or drag to relocate)',
      icon: {
        url: createPatientMarkerIcon(),
        scaledSize: new window.google.maps.Size(120, 74),
        anchor: new window.google.maps.Point(60, 48),
      },
      zIndex: 999,
    });

    patientMarker.addListener('dragend', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleLocationPicked(lat, lng);
    });

    patientMarkerRef.current = patientMarker;

    // ── 2. Click anywhere on the map to relocate patient marker ──
    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      patientMarker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
      handleLocationPicked(lat, lng);
    });

    // ── 3. Populate Available Hospitals (Only operational with beds) ──
    hospitalMarkersRef.current = [];
    const availableHospitals = hospitals.filter((h) => h.status === 'Operational' && h.availableBeds > 0);

    availableHospitals.forEach((hosp) => {
      const dist = calculateDistanceKm(initialPos.lat, initialPos.lng, hosp.latitude, hosp.longitude);

      const marker = new window.google.maps.Marker({
        position: { lat: hosp.latitude, lng: hosp.longitude },
        map,
        title: `${hosp.name} (${dist} km away • ${hosp.availableBeds} beds available)`,
        icon: {
          url: createHospitalIcon(hosp),
          scaledSize: new window.google.maps.Size(42, 52),
          anchor: new window.google.maps.Point(21, 52),
        },
        zIndex: 10,
      });

      marker.addListener('click', () => {
        const curPos = patientMarker.getPosition();
        const currentDist = curPos
          ? calculateDistanceKm(curPos.lat(), curPos.lng(), hosp.latitude, hosp.longitude)
          : dist;
        infoWindow.setContent(buildNearbyHospitalPopupHtml(hosp, currentDist));
        infoWindow.open({ anchor: marker, map });
      });

      hospitalMarkersRef.current.push({ marker, data: hosp, distance: dist });
    });

    // ── 4. Populate AVAILABLE Ambulances (Ready for Dispatch - No taken corridors) ──
    ambulanceMarkersRef.current = [];

    availableAmbulances.forEach((amb) => {
      const distToPatient = calculateDistanceKm(initialPos.lat, initialPos.lng, amb.latitude, amb.longitude);
      const etaMins = Math.max(2, Math.round(distToPatient * 2.2));

      // Available Ambulance Marker with distance from patient badge
      const ambMarker = new window.google.maps.Marker({
        position: { lat: amb.latitude, lng: amb.longitude },
        map,
        title: `${amb.id} (${distToPatient} km from patient • Available • Ready for Dispatch)`,
        icon: {
          url: createAvailableAmbulanceMarkerIcon(`${distToPatient} km`, `${etaMins}m`),
          scaledSize: new window.google.maps.Size(104, 64),
          anchor: new window.google.maps.Point(52, 32),
        },
        zIndex: 30,
      });

      ambMarker.addListener('click', () => {
        const curPos = patientMarker.getPosition();
        const currentDistFromPatient = curPos
          ? calculateDistanceKm(curPos.lat(), curPos.lng(), amb.latitude, amb.longitude)
          : distToPatient;
        infoWindow.setContent(buildAvailableAmbulancePopupHtml(amb, currentDistFromPatient));
        infoWindow.open({ anchor: ambMarker, map });
      });

      ambulanceMarkersRef.current.push({
        marker: ambMarker,
        data: amb,
        distance: distToPatient,
      });
    });

    // ── 5. Attach Places Autocomplete on map panel's search input ──
    if (window.google.maps.places && searchInputRef.current) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['geometry', 'name', 'formatted_address', 'place_id'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name;

          setCurrentCoords({ lat, lng });
          setCurrentAddress(address);
          setMapSearchText(address);

          map.panTo({ lat, lng });
          map.setZoom(16);
          patientMarker.setPosition({ lat, lng });
          patientMarker.setVisible(true);

          if (onLocationSelectRef.current) {
            onLocationSelectRef.current({
              address,
              latitude: lat,
              longitude: lng,
              placeId: place.place_id,
            });
          }
          triggerNotice(`Location pinned: ${address.split(',')[0]}`);
        });

        autocompleteRef.current = autocomplete;
      } catch (err) {
        console.warn('Places Autocomplete initialization notice:', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load Google Maps API via loader once
  const loadAndInitializeMap = useCallback(async () => {
    if (!hasValidGoogleMapsKey()) {
      setMapStatus('missing_key');
      return;
    }
    if (mapInitializedRef.current && mapInstanceRef.current) return;

    setMapStatus('loading');
    setErrorMessage(null);

    try {
      await loadGoogleMaps();
      if (!mapContainerRef.current) return;
      if (!mapInitializedRef.current) {
        initGoogleMap();
        mapInitializedRef.current = true;
      }
      setMapStatus('loaded');
    } catch (err) {
      console.error('[MediRoute] EmergencyMapPanel Google Maps load error:', err);
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
    };
  }, [loadAndInitializeMap]);

  // Zoom handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(currentCoords);
      mapInstanceRef.current.setZoom(16);
      triggerNotice('Map recentered on patient location');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#E5E9ED] overflow-hidden select-none">
      {/* ── Interactive Google Maps Target Container ── */}
      <div
        ref={mapContainerRef}
        id="emergency-google-map-viewport"
        className="w-full h-full min-h-[460px] z-0"
      />

      {/* ── API Key Missing Warning Overlay ── */}
      {mapStatus === 'missing_key' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#FAF9F5]/95 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 border border-[#E6ECE3] shadow-xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E8F6E9] border border-[#00A551]/20 flex items-center justify-center text-[#00A551] mb-3 shadow-xs">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#2A362C] mb-1.5">
              Google Maps API key is not configured.
            </h3>

            <p className="text-xs text-[#687280] mb-4 leading-relaxed">
              Add <code className="px-1.5 py-0.5 bg-[#EFF3EE] rounded font-bold text-[#00A551]">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="px-1.5 py-0.5 bg-[#EFF3EE] rounded font-bold text-[#2A362C]">.env</code> file and restart the development server.
            </p>

            <div className="bg-[#FAF9F5] border border-[#D7E3D5] rounded-xl p-3 text-left mb-4 font-mono text-xs text-[#2A362C]">
              <div className="text-[10px] text-[#687280] uppercase tracking-wider font-semibold mb-1">
                .env
              </div>
              <div className="text-[#00A551] font-bold select-all break-all">
                VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
              </div>
            </div>

            <button
              type="button"
              onClick={loadAndInitializeMap}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A551] hover:bg-[#008f45] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Loading Overlay ── */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#FAF9F5]/70 backdrop-blur-xs">
          <div className="w-9 h-9 border-3 border-[#00A551] border-t-transparent rounded-full animate-spin mb-2.5" />
          <span className="text-xs font-bold text-[#00A551] tracking-wide">
            Loading Google Maps Patient Locator...
          </span>
        </div>
      )}

      {/* ── Error Overlay ── */}
      {mapStatus === 'error' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#FAF9F5]/95 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-[#FEE2E2] shadow-xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#991B1B] mb-2">
              Google Maps Loading Error
            </h3>
            <p className="text-xs text-[#687280] mb-4">
              {errorMessage || 'Unable to load Google Maps JavaScript API services.'}
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

        {/* Map Search Bar Connected to Google Places / Geocoder */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#E2E8F0] shadow-md pointer-events-auto max-w-md w-full"
        >
          <Search className="w-4 h-4 text-[#687280] shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={mapSearchText}
            onChange={(e) => setMapSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            placeholder="Search location or nearby landmark (e.g. Shivajinagar, Pune)"
            className="w-full text-xs font-semibold text-[#1A2741] placeholder-[#94A3B8] bg-transparent outline-none"
            aria-label="Search map location"
          />
          {isReverseGeocoding && (
            <div className="w-3 h-3 border-2 border-[#00A551] border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          {mapSearchText && (
            <button
              type="button"
              onClick={() => {
                setMapSearchText('');
                if (onLocationSelect) {
                  onLocationSelect({
                    address: '',
                    latitude: currentCoords.lat,
                    longitude: currentCoords.lng,
                  });
                }
              }}
              className="w-4 h-4 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#4A4A4A] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </form>
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
        <span>Click anywhere on the map to pin patient location</span>
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
            {currentAddress || location || 'Shivajinagar, Pune'}
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span>Ambulance</span>
        </div>
      </div>
    </div>
  );
}
