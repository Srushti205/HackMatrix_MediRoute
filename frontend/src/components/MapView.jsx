import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import { hospitals } from '../data/hospitals';
import { ambulances, availableAmbulances } from '../data/ambulances';
import {
  PUNE_CENTER,
  DEFAULT_ZOOM,
  hasValidGoogleMapsKey,
  loadGoogleMaps,
  computeDrivingRoute,
  formatRouteDistance,
  formatRouteDuration,
  getRouteErrorMessage,
  createHospitalIcon,
  createAmbulanceWithDistanceIcon,
  createEmergencyIcon,
  buildHospitalPopupHtml,
  buildAmbulancePopupHtml,
  buildEmergencyPopupHtml,
  MEDIROUTE_MAP_STYLES,
} from '../services/mapService';
import { MapPin, Info, Key, AlertCircle, RefreshCw, Layers, Navigation, Clock3 } from 'lucide-react';

const ROUTE_STATUSES = new Set(['En Route', 'En Route to Patient', 'Transporting Patient']);

export default function MapView({
  emergencies = [],
  selectedEmergencyId,
  onSelectEmergency,
  onRouteUpdate,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({
    hospitals: [],
    ambulances: [],
    emergencies: [],
    routeMarkers: [],
  });
  const routePolylinesRef = useRef([]);
  const circleRef = useRef(null);
  const activeInfoWindowRef = useRef(null);
  const isMountedRef = useRef(true);

  const [mapStatus, setMapStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeIncidentBanner, setActiveIncidentBanner] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [routeState, setRouteState] = useState({ status: 'idle', info: null, error: null });

  const selectedEmergency = useMemo(
    () => emergencies.find((emergency) => emergency.id === selectedEmergencyId) || null,
    [emergencies, selectedEmergencyId]
  );

  // Do not include the ETA/distance fields in this key: onRouteUpdate writes those fields back
  // to the emergency object, and we do not want that UI update to trigger a second Routes API call.
  const routeRequestKey = useMemo(() => {
    if (!selectedEmergency || !ROUTE_STATUSES.has(selectedEmergency.status)) return 'none';
    return [
      selectedEmergency.id,
      selectedEmergency.status,
      selectedEmergency.latitude,
      selectedEmergency.longitude,
      selectedEmergency.assignedAmbulance || selectedEmergency.ambulanceId || '',
      selectedEmergency.destinationHospital || '',
      selectedEmergency.hospitalId || '',
      selectedEmergency.routeTarget || '',
    ].join('|');
  }, [selectedEmergency]);

  const clearRouteOverlays = useCallback(() => {
    routePolylinesRef.current.forEach((polyline) => polyline?.setMap(null));
    routePolylinesRef.current = [];
    markersRef.current.routeMarkers.forEach((marker) => marker?.setMap(null));
    markersRef.current.routeMarkers = [];
  }, []);

  const clearDynamicMarkers = useCallback(() => {
    markersRef.current.emergencies.forEach(({ marker }) => marker?.setMap(null));
    markersRef.current.emergencies = [];
  }, []);

  const initGoogleMap = useCallback(() => {
    if (!window.google || !mapContainerRef.current) return;

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

    const infoWindow = new window.google.maps.InfoWindow();
    activeInfoWindowRef.current = infoWindow;

    circleRef.current = new window.google.maps.Circle({
      strokeColor: '#00A551',
      strokeOpacity: 0.45,
      strokeWeight: 1.5,
      fillColor: '#00A551',
      fillOpacity: 0.025,
      map,
      center: PUNE_CENTER,
      radius: 15000,
      clickable: false,
    });

    // Persistent hospital markers.
    hospitals.forEach((hospital) => {
      const inboundAmbulance = ambulances.find(
        (ambulance) =>
          ambulance.destinationHospitalId === hospital.id ||
          (ambulance.destination && ambulance.destination.toLowerCase().includes(hospital.name.toLowerCase()))
      );

      const marker = new window.google.maps.Marker({
        position: { lat: hospital.latitude, lng: hospital.longitude },
        map,
        title: hospital.name,
        icon: {
          url: createHospitalIcon(hospital),
          scaledSize: new window.google.maps.Size(44, 54),
          anchor: new window.google.maps.Point(22, 54),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildHospitalPopupHtml(hospital, inboundAmbulance));
        infoWindow.open({ anchor: marker, map });
      });

      markersRef.current.hospitals.push({ id: hospital.id, marker, data: hospital });
    });

    // Existing fleet remains visible. Their old straight-line "corridors" are intentionally removed;
    // the selected emergency gets a real road route from the Google Routes Library below.
    ambulances.forEach((ambulance) => {
      const targetHospital =
        hospitals.find((hospital) => hospital.id === ambulance.destinationHospitalId) ||
        hospitals.find((hospital) => hospital.name.toLowerCase() === ambulance.destination?.toLowerCase()) ||
        hospitals[0];

      const marker = new window.google.maps.Marker({
        position: { lat: ambulance.latitude, lng: ambulance.longitude },
        map,
        title: ambulance.id,
        icon: {
          url: createAmbulanceWithDistanceIcon(ambulance),
          scaledSize: new window.google.maps.Size(108, 66),
          anchor: new window.google.maps.Point(54, 33),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildAmbulancePopupHtml(ambulance, targetHospital));
        infoWindow.open({ anchor: marker, map });
      });

      markersRef.current.ambulances.push({ id: ambulance.id, marker, data: ambulance });
    });

    map.addListener('zoom_changed', () => {
      setCurrentZoom(map.getZoom());
    });
  }, []);

  const renderEmergencyMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    clearDynamicMarkers();
    const infoWindow = activeInfoWindowRef.current || new window.google.maps.InfoWindow();
    activeInfoWindowRef.current = infoWindow;

    emergencies.forEach((emergency) => {
      if (!Number.isFinite(Number(emergency.latitude)) || !Number.isFinite(Number(emergency.longitude))) return;

      const marker = new window.google.maps.Marker({
        position: { lat: Number(emergency.latitude), lng: Number(emergency.longitude) },
        map,
        title: emergency.id,
        icon: {
          url: createEmergencyIcon(),
          scaledSize: new window.google.maps.Size(36, 44),
          anchor: new window.google.maps.Point(18, 44),
        },
      });

      marker.addListener('click', () => {
        infoWindow.setContent(buildEmergencyPopupHtml(emergency));
        infoWindow.open({ anchor: marker, map });
        onSelectEmergency?.(emergency);
      });

      markersRef.current.emergencies.push({ id: emergency.id, marker, data: emergency });
    });
  }, [clearDynamicMarkers, emergencies, onSelectEmergency]);

  const loadAndInitializeMap = useCallback(async () => {
    if (!hasValidGoogleMapsKey()) {
      setMapStatus('missing_key');
      return;
    }

    setMapStatus('loading');
    setErrorMessage(null);

    try {
      await loadGoogleMaps();
      if (!mapContainerRef.current || !isMountedRef.current) return;
      initGoogleMap();
      setMapStatus('loaded');
    } catch (error) {
      console.error('[MediRoute] Google Maps load error:', error);
      setErrorMessage(error?.message || 'Failed to load Google Maps JavaScript API');
      setMapStatus('error');
    }
  }, [initGoogleMap]);

  useEffect(() => {
    isMountedRef.current = true;
    loadAndInitializeMap();

    return () => {
      isMountedRef.current = false;
      clearRouteOverlays();

      markersRef.current.hospitals.forEach(({ marker }) => marker?.setMap(null));
      markersRef.current.ambulances.forEach(({ marker }) => marker?.setMap(null));
      markersRef.current.emergencies.forEach(({ marker }) => marker?.setMap(null));
      markersRef.current.routeMarkers.forEach((marker) => marker?.setMap(null));
      markersRef.current = { hospitals: [], ambulances: [], emergencies: [], routeMarkers: [] };

      circleRef.current?.setMap(null);
      circleRef.current = null;
      activeInfoWindowRef.current?.close();
      activeInfoWindowRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [clearRouteOverlays, loadAndInitializeMap]);

  useEffect(() => {
    if (mapStatus !== 'loaded' || !mapInstanceRef.current) return;
    renderEmergencyMarkers();
  }, [mapStatus, renderEmergencyMarkers]);

  useEffect(() => {
    if (!selectedEmergencyId || !mapInstanceRef.current || !window.google) return;

    const target = emergencies.find((emergency) => emergency.id === selectedEmergencyId);
    if (!target) return;

    setActiveIncidentBanner(`${target.id}: ${target.type} (${target.status})`);

    try {
      const map = mapInstanceRef.current;
      const targetLatLng = new window.google.maps.LatLng(
        Number(target.latitude),
        Number(target.longitude)
      );
      map.panTo(targetLatLng);
      map.setZoom(15);

      const emergencyRecord = markersRef.current.emergencies.find((item) => item.id === target.id);
      if (emergencyRecord && activeInfoWindowRef.current) {
        activeInfoWindowRef.current.setContent(buildEmergencyPopupHtml(target));
        activeInfoWindowRef.current.open({ anchor: emergencyRecord.marker, map });
      }
    } catch (error) {
      console.warn('[MediRoute] Error focusing on emergency:', error);
    }
  }, [selectedEmergencyId, selectedEmergency?.latitude, selectedEmergency?.longitude]);

  useEffect(() => {
    let cancelled = false;

    const calculateSelectedRoute = async () => {
      clearRouteOverlays();

      if (
        mapStatus !== 'loaded' ||
        !mapInstanceRef.current ||
        !selectedEmergency ||
        !ROUTE_STATUSES.has(selectedEmergency.status)
      ) {
        setRouteState({ status: 'idle', info: null, error: null });
        return;
      }

      const allAmbulances = [...ambulances, ...availableAmbulances];
      const assignedAmbulanceId = selectedEmergency.assignedAmbulance || selectedEmergency.ambulanceId;
      const assignedAmbulance = allAmbulances.find((ambulance) => ambulance.id === assignedAmbulanceId);
      const isTransportingPatient = selectedEmergency.status === 'Transporting Patient';
      const explicitIncidentRoute = selectedEmergency.routeTarget === 'incident';
      const shouldRouteToHospital = isTransportingPatient || (!explicitIncidentRoute && Boolean(selectedEmergency.hospitalId || selectedEmergency.destinationHospital));

      let origin;
      let destination;
      let originLabel;
      let destinationLabel;

      if (isTransportingPatient) {
        const hospital =
          hospitals.find((item) => item.id === selectedEmergency.hospitalId) ||
          hospitals.find((item) => item.name === selectedEmergency.destinationHospital);

        if (!hospital) {
          setRouteState({
            status: 'error',
            info: null,
            error: 'A destination hospital is not assigned to this emergency yet.',
          });
          return;
        }

        origin = { latitude: selectedEmergency.latitude, longitude: selectedEmergency.longitude };
        destination = { latitude: hospital.latitude, longitude: hospital.longitude };
        originLabel = selectedEmergency.location || 'Patient location';
        destinationLabel = hospital.name;
      } else {
        if (!assignedAmbulance) {
          setRouteState({
            status: 'error',
            info: null,
            error: 'No ambulance is assigned to this emergency yet.',
          });
          return;
        }

        origin = { latitude: assignedAmbulance.latitude, longitude: assignedAmbulance.longitude };

        if (shouldRouteToHospital) {
          const hospital =
            hospitals.find((item) => item.id === selectedEmergency.hospitalId) ||
            hospitals.find((item) => item.name === selectedEmergency.destinationHospital);

          if (!hospital) {
            setRouteState({
              status: 'error',
              info: null,
              error: 'The selected hospital could not be found for this emergency.',
            });
            return;
          }

          destination = { latitude: hospital.latitude, longitude: hospital.longitude };
          originLabel = assignedAmbulance.id;
          destinationLabel = hospital.name;
        } else {
          destination = { latitude: selectedEmergency.latitude, longitude: selectedEmergency.longitude };
          originLabel = assignedAmbulance.id;
          destinationLabel = selectedEmergency.location || 'Emergency location';
        }
      }

      setRouteState({
        status: 'loading',
        info: { originLabel, destinationLabel },
        error: null,
      });

      try {
        const { route, distanceMeters, durationMillis, staticDurationMillis } = await computeDrivingRoute(
          origin,
          destination,
          { trafficAware: true }
        );

        if (cancelled || !route || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        routePolylinesRef.current = route.createPolylines({
          polylineOptions: {
            map,
            strokeColor: '#00A551',
            strokeOpacity: 0.92,
            strokeWeight: 6,
            zIndex: 20,
          },
        });

        if (route.viewport) {
          map.fitBounds(route.viewport, 70);
        }

        // When an available ambulance was assigned to a brand-new emergency, add a route-specific
        // marker so the dispatcher can visually see both ends of the live route.
        const isAvailableAmbulance = assignedAmbulance && availableAmbulances.some(
          (ambulance) => ambulance.id === assignedAmbulance.id
        );

        if (!isTransportingPatient && !shouldRouteToHospital && isAvailableAmbulance) {
          const distanceText = formatRouteDistance(distanceMeters);
          const etaText = formatRouteDuration(durationMillis);
          const routeAmbulanceMarker = new window.google.maps.Marker({
            position: { lat: assignedAmbulance.latitude, lng: assignedAmbulance.longitude },
            map,
            zIndex: 50,
            title: `${assignedAmbulance.id} → ${selectedEmergency.location || 'Emergency'}`,
            icon: {
              url: createAmbulanceWithDistanceIcon({
                ...assignedAmbulance,
                distanceKm: distanceText,
                eta: etaText,
              }),
              scaledSize: new window.google.maps.Size(108, 66),
              anchor: new window.google.maps.Point(54, 33),
            },
          });

          routeAmbulanceMarker.addListener('click', () => {
            const hospital =
              hospitals.find((hospitalItem) => hospitalItem.id === selectedEmergency.hospitalId) ||
              hospitals[0];
            activeInfoWindowRef.current?.setContent(
              buildAmbulancePopupHtml(
                { ...assignedAmbulance, distanceKm: distanceText, eta: etaText },
                hospital
              )
            );
            activeInfoWindowRef.current?.open({ anchor: routeAmbulanceMarker, map });
          });

          markersRef.current.routeMarkers.push(routeAmbulanceMarker);
        }

        const info = {
          originLabel,
          destinationLabel,
          distance: formatRouteDistance(distanceMeters),
          eta: formatRouteDuration(durationMillis),
          staticEta: formatRouteDuration(staticDurationMillis),
          trafficAware: durationMillis !== staticDurationMillis,
          mode: isTransportingPatient ? 'Patient → Hospital' : shouldRouteToHospital ? 'Ambulance → Hospital' : 'Ambulance → Incident',
        };

        setRouteState({ status: 'loaded', info, error: null });
        onRouteUpdate?.(selectedEmergency.id, {
          distanceKm: info.distance,
          eta: info.eta,
          routeMode: info.mode,
        });
      } catch (error) {
        if (cancelled) return;
        console.error('[MediRoute] Live route calculation failed:', error);
        setRouteState({
          status: 'error',
          info: { originLabel, destinationLabel },
          error: getRouteErrorMessage(error),
        });
      }
    };

    calculateSelectedRoute();

    return () => {
      cancelled = true;
    };
  }, [clearRouteOverlays, mapStatus, onRouteUpdate, routeRequestKey]);

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
    <div className={`relative w-full h-full min-h-[520px] overflow-hidden bg-[#EFF3EE] select-none ${className}`}>
      <div
        ref={mapContainerRef}
        id="mediroute-google-map-container"
        className="w-full h-full min-h-[520px] z-0"
        tabIndex={0}
      />

      {mapStatus === 'missing_key' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#FAF9F5]/95 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E6ECE3] shadow-xl text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F6E9] border border-[#00A551]/20 flex items-center justify-center text-[#00A551] mb-4 shadow-sm">
              <Key className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#2A362C] mb-2">Google Maps API Key Required</h3>
            <p className="text-xs text-[#687280] mb-5 leading-relaxed">
              Configure <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>frontend/.env</code>, then restart Vite.
            </p>
            <button
              type="button"
              onClick={loadAndInitializeMap}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A551] hover:bg-[#008f45] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Map Connection
            </button>
          </div>
        </div>
      )}

      {mapStatus === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAF9F5]/70 backdrop-blur-xs">
          <div className="w-10 h-10 border-3 border-[#00A551] border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-bold text-[#00A551] tracking-wide">Loading MediRoute live map...</span>
        </div>
      )}

      {mapStatus === 'error' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#FAF9F5]/95 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-[#FEE2E2] shadow-xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#991B1B] mb-2">Google Maps Loading Error</h3>
            <p className="text-xs text-[#687280] mb-4">{errorMessage || 'Unable to connect to Google Maps services.'}</p>
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

      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-3 pointer-events-auto">
        <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onRecenter={handleRecenter} />
        <MapLegend />
      </div>

      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none max-w-[min(520px,calc(100%-2rem))]">
        {activeIncidentBanner && (
          <div className="bg-white/95 backdrop-blur-sm border border-[#00A551]/30 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs font-semibold text-[#2D3748]">
            <Info className="w-4 h-4 text-[#00A551] shrink-0" />
            <span>
              Tracking: <strong className="text-[#00A551]">{activeIncidentBanner}</strong>
            </span>
          </div>
        )}

        {routeState.status === 'loading' && (
          <div className="bg-white/95 backdrop-blur-sm border border-[#71BC75]/40 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs font-semibold text-[#2D3748]">
            <Navigation className="w-4 h-4 text-[#00A551] animate-pulse" />
            <span>Calculating live driving route...</span>
          </div>
        )}

        {routeState.status === 'error' && routeState.error && (
          <div className="bg-white/95 backdrop-blur-sm border border-[#F2C4C0] rounded-xl px-3.5 py-2 shadow-md flex items-start gap-2 text-xs font-semibold text-[#B42318]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{routeState.error}</span>
          </div>
        )}

        {routeState.status === 'loaded' && routeState.info && (
          <div className="bg-white/96 backdrop-blur-sm border border-[#71BC75]/40 rounded-2xl px-3.5 py-3 shadow-lg min-w-[285px] pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase text-[#00A551]">
                <span className="w-2 h-2 rounded-full bg-[#00A551] animate-pulse" />
                Live Route
              </div>
              <span className="text-[10px] font-bold text-[#687280]">{routeState.info.mode}</span>
            </div>
            <div className="mt-2 text-xs font-bold text-[#2D3748] truncate">{routeState.info.originLabel}</div>
            <div className="text-[11px] text-[#687280] truncate">to {routeState.info.destinationLabel}</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#00A551]">
                <Clock3 className="w-4 h-4" /> {routeState.info.eta}
              </div>
              <div className="text-xs font-semibold text-[#687280]">{routeState.info.distance}</div>
              <div className="text-[10px] font-bold text-[#00A551] ml-auto">
                {routeState.info.trafficAware ? 'Traffic-aware' : 'Route'}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm border border-[#E6ECE3] rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2 text-[11px] text-[#4A4A4A]">
          <Layers className="w-3.5 h-3.5 text-[#00A551]" />
          <span><strong>Operational Zone:</strong> 15 Hospitals within 15 km • 5 Active Fleet Units</span>
        </div>
      </div>

      <div className="absolute bottom-3 left-4 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-[#E6ECE3] text-[11px] text-[#4A4A4A] shadow-sm select-none">
        <MapPin className="w-3.5 h-3.5 text-[#00A551]" />
        <span>Zone: <strong>Pune Central (15 km Operational Radius)</strong></span>
        <span className="text-[#CBD5E1]">•</span>
        <span className="text-[#00A551] font-semibold">Road route on selected emergency</span>
        <span className="text-[#CBD5E1]">•</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#00A551]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A551] animate-pulse" />
          Google Maps Live Route
        </span>
      </div>
    </div>
  );
}
