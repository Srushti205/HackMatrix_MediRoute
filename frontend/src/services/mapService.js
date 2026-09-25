import { Loader } from '@googlemaps/js-api-loader';

export const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };
export const DEFAULT_ZOOM = 13;

/**
 * Checks if a valid Google Maps API Key has been configured in .env
 */
export function hasValidGoogleMapsKey() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return Boolean(
    apiKey &&
    typeof apiKey === 'string' &&
    apiKey.trim() !== '' &&
    apiKey !== 'YOUR_API_KEY' &&
    !apiKey.includes('YOUR_API')
  );
}

/**
 * Clean municipal healthcare style for Google Maps
 */
export const MEDIROUTE_MAP_STYLES = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#D5E6E6' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#F0F4EF' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#E1ECE0' }],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [{ color: '#E8F6E9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#FAF8D0' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#FFF6AA' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#687280' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4A4A4A' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [{ visibility: 'simplified' }],
  },
];

let googleMapsPromise = null;

/**
 * Dynamically loads the Google Maps JavaScript API via @googlemaps/js-api-loader
 */
export function loadGoogleMaps() {
  if (!hasValidGoogleMapsKey()) {
    return Promise.reject(new Error('No valid Google Maps API key provided. Using Leaflet fallback.'));
  }

  if (!googleMapsPromise) {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });
    googleMapsPromise = loader.load();
  }

  return googleMapsPromise;
}

/**
 * Generates an SVG Data URI for map markers
 */
export function createSvgIcon(type, color = '#00A551') {
  if (type === 'hospital') {
    const svg = `
      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="${color}"/>
        <circle cx="17" cy="17" r="13" fill="#FFFFFF"/>
        <rect x="15" y="9" width="4" height="16" rx="1.5" fill="${color}"/>
        <rect x="9" y="15" width="16" height="4" rx="1.5" fill="${color}"/>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
  }

  if (type === 'ambulance') {
    const svg = `
      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="${color}"/>
        <circle cx="17" cy="17" r="13" fill="#FFFFFF"/>
        <path d="M10 13H20L23 16V22H10V13Z" fill="${color}"/>
        <circle cx="13" cy="22" r="2.5" fill="#333333"/>
        <circle cx="20" cy="22" r="2.5" fill="#333333"/>
        <rect x="13.5" y="16" width="3" height="3" fill="#FAF8AB"/>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
  }

  // Emergency Marker (Red Alert Beacon)
  const svg = `
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C8.06 0 0 8.06 0 18C0 31.5 18 44 18 44C18 44 36 31.5 36 18C36 8.06 27.94 0 18 0Z" fill="#EF4444"/>
      <circle cx="18" cy="18" r="14" fill="#FFFFFF"/>
      <circle cx="18" cy="18" r="11" fill="#EF4444"/>
      <path d="M18 11V18" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="18" cy="22.5" r="1.5" fill="#FFFFFF"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Builds HTML for Hospital Popup
 */
export function buildHospitalPopupHtml(hospital) {
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 220px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="width: 22px; height: 22px; border-radius: 6px; background: #E8F6E9; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #00A551; font-size: 14px;">+</span>
        <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #2A362C;">${hospital.name}</h4>
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 8px; margin-bottom: 10px; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
        <div>
          <span style="color: #687280; display: block; font-size: 10px; text-transform: uppercase;">Available Beds</span>
          <strong style="color: #00A551; font-size: 16px;">${hospital.availableBeds}</strong>
        </div>
        <div>
          <span style="color: #687280; display: block; font-size: 10px; text-transform: uppercase;">ICU Beds</span>
          <strong style="color: #2D3748; font-size: 16px;">${hospital.icuBeds}</strong>
        </div>
        <div style="grid-column: span 2; margin-top: 4px;">
          <span style="color: #687280; font-size: 11px;">Emergency Capacity:</span>
          <strong style="color: #00A551; font-weight: 600;"> ${hospital.emergencyCapacity}</strong>
        </div>
        <div style="grid-column: span 2;">
          <span style="color: #687280; font-size: 11px;">Status:</span>
          <strong style="color: #00A551; font-weight: 600;"> ${hospital.status}</strong>
        </div>
      </div>
      <button onclick="window.alert('Viewing hospital profile: ${hospital.name}')" style="width: 100%; background: #00A551; color: white; border: none; padding: 7px 12px; border-radius: 8px; font-weight: 600; font-size: 12px; cursor: pointer;">
        View Hospital
      </button>
    </div>
  `;
}

/**
 * Builds HTML for Ambulance Popup
 */
export function buildAmbulancePopupHtml(ambulance) {
  const statusColor = ambulance.status === 'Available' ? '#71BC75' : ambulance.status === 'En Route' ? '#00A551' : '#D97706';
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 200px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #2A362C;">${ambulance.id}</h4>
        <span style="background: #E8F6E9; color: ${statusColor}; border: 1px solid rgba(113, 188, 117, 0.4); border-radius: 12px; font-size: 11px; font-weight: 600; padding: 2px 8px;">
          ${ambulance.status}
        </span>
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 8px; margin-bottom: 8px; font-size: 12px; line-height: 1.6;">
        <div><span style="color: #687280;">Destination:</span> <strong>${ambulance.destination}</strong></div>
        <div><span style="color: #687280;">ETA:</span> <strong style="color: #00A551;">${ambulance.eta}</strong></div>
      </div>
    </div>
  `;
}

/**
 * Builds HTML for Emergency Popup
 */
export function buildEmergencyPopupHtml(emergency) {
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 230px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-weight: 800; font-size: 14px; color: #EF4444;">${emergency.id}</span>
        <span style="background: #FEE2E2; color: #DC2626; border-radius: 10px; font-size: 10px; font-weight: 700; padding: 2px 7px;">
          ${emergency.priority} Priority
        </span>
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #2A362C; margin-bottom: 8px;">
        ${emergency.type}
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 8px; margin-bottom: 10px; font-size: 12px; line-height: 1.5;">
        <div><span style="color: #687280;">Assigned Ambulance:</span> <strong>${emergency.assignedAmbulance || emergency.ambulanceId}</strong></div>
        <div><span style="color: #687280;">Destination:</span> <strong>${emergency.destinationHospital || emergency.hospitalId}</strong></div>
        <div><span style="color: #687280;">ETA:</span> <strong style="color: #00A551;">${emergency.eta}</strong></div>
      </div>
      <button onclick="window.alert('Viewing full telemetry for incident ${emergency.id}')" style="width: 100%; background: #00A551; color: white; border: none; padding: 7px 12px; border-radius: 8px; font-weight: 600; font-size: 12px; cursor: pointer;">
        View Emergency
      </button>
    </div>
  `;
}
