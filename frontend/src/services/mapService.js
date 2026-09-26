import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

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
    apiKey !== 'YOUR_API_KEY_HERE' &&
    apiKey !== 'PASTE_YOUR_KEY_HERE' &&
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
let optionsConfigured = false;

/**
 * Dynamically loads the Google Maps JavaScript API via @googlemaps/js-api-loader functional API
 */
export async function loadGoogleMaps() {
  if (!hasValidGoogleMapsKey()) {
    return Promise.reject(
      new Error('No valid Google Maps API key provided. Please set VITE_GOOGLE_MAPS_API_KEY in .env.')
    );
  }

  if (window.google?.maps?.Map) {
    return window.google.maps;
  }

  if (!googleMapsPromise) {
    googleMapsPromise = (async () => {
      if (!optionsConfigured) {
        setOptions({
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          v: 'weekly',
          libraries: ['places', 'geometry'],
        });
        optionsConfigured = true;
      }
      await importLibrary('maps');
      await Promise.all([
        importLibrary('places').catch((e) => console.warn('Places library load warning:', e)),
        importLibrary('geometry').catch((e) => console.warn('Geometry library load warning:', e)),
      ]);
      return window.google.maps;
    })().catch((err) => {
      googleMapsPromise = null;
      throw err;
    });
  }

  return googleMapsPromise;
}

/**
 * Built-in Pune sub-localities, housing societies and landmark registry for fast and reliable resolution
 */
export const PUNE_LOCALITIES_DATABASE = [
  {
    keywords: ['snehal terrace', 'snehal', 'mayur colony'],
    mainText: 'Snehal Terrace, Kothrud',
    secondaryText: 'Mayur Colony, Kothrud, Pune, Maharashtra 411038',
    address: 'Snehal Terrace, Mayur Colony, Kothrud, Pune, Maharashtra 411038',
    lat: 18.5045,
    lng: 73.8120,
    place_id: 'pune_loc_snehal_terrace',
  },
  {
    keywords: ['kothrud', 'paud road', 'vanaz', 'chandani chowk', 'dahanukar'],
    mainText: 'Kothrud',
    secondaryText: 'Pune, Maharashtra 411038',
    address: 'Kothrud, Paud Road, Pune, Maharashtra 411038',
    lat: 18.5074,
    lng: 73.8077,
    place_id: 'pune_loc_kothrud',
  },
  {
    keywords: ['shivajinagar', 'model colony', 'range hills'],
    mainText: 'Shivajinagar',
    secondaryText: 'Pune, Maharashtra 411005',
    address: 'Shivajinagar, Pune, Maharashtra 411005',
    lat: 18.5314,
    lng: 73.8446,
    place_id: 'pune_loc_shivajinagar',
  },
  {
    keywords: ['fc road', 'fergusson', 'fergusson college'],
    mainText: 'Fergusson College Road (FC Road)',
    secondaryText: 'Shivajinagar / Deccan, Pune 411004',
    address: 'FC Road, Deccan Gymkhana, Pune, Maharashtra 411004',
    lat: 18.5204,
    lng: 73.8410,
    place_id: 'pune_loc_fc_road',
  },
  {
    keywords: ['deccan', 'deccan gymkhana', 'goodluck', 'jm road', 'jangali maharaj'],
    mainText: 'Deccan Gymkhana',
    secondaryText: 'Pune, Maharashtra 411004',
    address: 'Deccan Gymkhana, Pune, Maharashtra 411004',
    lat: 18.5170,
    lng: 73.8415,
    place_id: 'pune_loc_deccan',
  },
  {
    keywords: ['ruby hall', 'sangamvadi'],
    mainText: 'Ruby Hall Clinic',
    secondaryText: '40 Sassoon Road, Sangamvadi, Pune 411001',
    address: 'Ruby Hall Clinic, 40 Sassoon Road, Sangamvadi, Pune 411001',
    lat: 18.5324,
    lng: 73.8786,
    place_id: 'pune_loc_ruby_hall',
  },
  {
    keywords: ['jehangir', 'pune station'],
    mainText: 'Jehangir Hospital',
    secondaryText: '32 Sassoon Road, Central Pune 411001',
    address: 'Jehangir Hospital, 32 Sassoon Road, Pune 411001',
    lat: 18.5307,
    lng: 73.8778,
    place_id: 'pune_loc_jehangir',
  },
  {
    keywords: ['sahyadri', 'nal stop'],
    mainText: 'Sahyadri Super Speciality Hospital',
    secondaryText: 'Plot No. 30 C, Karve Road, Deccan, Pune 411004',
    address: 'Sahyadri Hospital, Karve Road, Deccan, Pune 411004',
    lat: 18.5132,
    lng: 73.8389,
    place_id: 'pune_loc_sahyadri',
  },
  {
    keywords: ['kem', 'rasta peth', 'quarter gate'],
    mainText: 'KEM Hospital',
    secondaryText: '489 Rasta Peth, Pune 411011',
    address: 'KEM Hospital, 489 Rasta Peth, Sardar Moodliar Road, Pune 411011',
    lat: 18.5222,
    lng: 73.8682,
    place_id: 'pune_loc_kem',
  },
  {
    keywords: ['swargate', 'laxmi road'],
    mainText: 'Swargate',
    secondaryText: 'Pune, Maharashtra 411042',
    address: 'Swargate Chowk, Pune, Maharashtra 411042',
    lat: 18.5018,
    lng: 73.8586,
    place_id: 'pune_loc_swargate',
  },
  {
    keywords: ['hadapsar', 'magarpatta', 'amanora'],
    mainText: 'Hadapsar / Magarpatta City',
    secondaryText: 'Pune, Maharashtra 411028',
    address: 'Magarpatta City, Hadapsar, Pune, Maharashtra 411028',
    lat: 18.5089,
    lng: 73.9259,
    place_id: 'pune_loc_hadapsar',
  },
  {
    keywords: ['viman nagar', 'airport'],
    mainText: 'Viman Nagar',
    secondaryText: 'Near Pune Airport, Pune 411014',
    address: 'Viman Nagar, Pune, Maharashtra 411014',
    lat: 18.5679,
    lng: 73.9143,
    place_id: 'pune_loc_viman_nagar',
  },
  {
    keywords: ['kalyani nagar', 'koregaon park', 'kp'],
    mainText: 'Kalyani Nagar / Koregaon Park',
    secondaryText: 'Pune, Maharashtra 411006',
    address: 'Kalyani Nagar, Pune, Maharashtra 411006',
    lat: 18.5463,
    lng: 73.9034,
    place_id: 'pune_loc_kalyani_nagar',
  },
  {
    keywords: ['baner', 'balewadi'],
    mainText: 'Baner',
    secondaryText: 'Pune, Maharashtra 411045',
    address: 'Baner, Pune, Maharashtra 411045',
    lat: 18.5590,
    lng: 73.7868,
    place_id: 'pune_loc_baner',
  },
  {
    keywords: ['aundh', 'bremen chowk', 'parihar'],
    mainText: 'Aundh',
    secondaryText: 'Pune, Maharashtra 411007',
    address: 'Aundh, Pune, Maharashtra 411007',
    lat: 18.5580,
    lng: 73.8075,
    place_id: 'pune_loc_aundh',
  },
  {
    keywords: ['camp', 'mg road', 'cantonment'],
    mainText: 'Pune Camp (MG Road)',
    secondaryText: 'Cantonment, Pune 411001',
    address: 'Camp Cantonment, MG Road, Pune, Maharashtra 411001',
    lat: 18.5167,
    lng: 73.8833,
    place_id: 'pune_loc_camp',
  },
  {
    keywords: ['kharadi', 'eon'],
    mainText: 'Kharadi',
    secondaryText: 'Pune, Maharashtra 411014',
    address: 'Kharadi, EON IT Park, Pune, Maharashtra 411014',
    lat: 18.5516,
    lng: 73.9351,
    place_id: 'pune_loc_kharadi',
  },
  {
    keywords: ['katraj', 'dhankawadi'],
    mainText: 'Katraj',
    secondaryText: 'Pune, Maharashtra 411046',
    address: 'Katraj, Pune, Maharashtra 411046',
    lat: 18.4575,
    lng: 73.8677,
    place_id: 'pune_loc_katraj',
  },
  {
    keywords: ['erandwane', 'mhatre bridge'],
    mainText: 'Erandwane',
    secondaryText: 'Near Mhatre Bridge, Pune 411004',
    address: 'Erandwane, Pune, Maharashtra 411004',
    lat: 18.5100,
    lng: 73.8300,
    place_id: 'pune_loc_erandwane',
  },
  {
    keywords: ['karve nagar'],
    mainText: 'Karve Nagar',
    secondaryText: 'Pune, Maharashtra 411052',
    address: 'Karve Nagar, Pune, Maharashtra 411052',
    lat: 18.4900,
    lng: 73.8180,
    place_id: 'pune_loc_karve_nagar',
  },
  {
    keywords: ['bavdhan'],
    mainText: 'Bavdhan',
    secondaryText: 'Pune, Maharashtra 411021',
    address: 'Bavdhan, Pune, Maharashtra 411021',
    lat: 18.5113,
    lng: 73.7715,
    place_id: 'pune_loc_bavdhan',
  },
  {
    keywords: ['wakad'],
    mainText: 'Wakad',
    secondaryText: 'Pune, Maharashtra 411057',
    address: 'Wakad, Pune, Maharashtra 411057',
    lat: 18.5987,
    lng: 73.7667,
    place_id: 'pune_loc_wakad',
  },
  {
    keywords: ['hinjewadi', 'hinjawadi'],
    mainText: 'Hinjewadi Infotech Park',
    secondaryText: 'Pune, Maharashtra 411057',
    address: 'Hinjewadi, Pune, Maharashtra 411057',
    lat: 18.5913,
    lng: 73.7389,
    place_id: 'pune_loc_hinjewadi',
  },
];

/**
 * Resolves Google Place details (coordinates & formatted address) given a placeId
 * Uses client-side google.maps.places.PlacesService
 */
export function getGooglePlaceDetails(placeId) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.places?.PlacesService || !placeId) {
      resolve(null);
      return;
    }
    try {
      const dummyDiv = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(dummyDiv);
      service.getDetails(
        {
          placeId,
          fields: ['geometry', 'formatted_address', 'name'],
        },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            resolve({
              address: place.formatted_address || place.name,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              placeId,
            });
          } else {
            resolve(null);
          }
        }
      );
    } catch (e) {
      console.warn('getGooglePlaceDetails exception:', e);
      resolve(null);
    }
  });
}

/**
 * Searches for a place using Google PlacesService.findPlaceFromQuery
 */
export function findGooglePlace(query) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.places?.PlacesService || !query) {
      resolve(null);
      return;
    }
    try {
      const dummyDiv = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(dummyDiv);
      const queryWithCity = query.toLowerCase().includes('pune') ? query : `${query}, Pune`;
      service.findPlaceFromQuery(
        {
          query: queryWithCity,
          fields: ['geometry', 'formatted_address', 'name', 'place_id'],
        },
        (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results[0]?.geometry?.location
          ) {
            resolve({
              address: results[0].formatted_address || results[0].name,
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng(),
              placeId: results[0].place_id,
            });
          } else {
            resolve(null);
          }
        }
      );
    } catch (e) {
      console.warn('findGooglePlace exception:', e);
      resolve(null);
    }
  });
}

/**
 * Reverse geocodes coordinates to a human-readable address with multi-layer fallback
 */
export async function reverseGeocodeLocation(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  // 1. Try Google Geocoder if available
  if (window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const googleRes = await new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve({
              address: results[0].formatted_address,
              latitude: lat,
              longitude: lng,
              placeId: results[0].place_id,
            });
          } else {
            resolve(null);
          }
        });
      });
      if (googleRes) return googleRes;
    } catch (e) {
      console.warn('Google reverse geocode notice:', e);
    }
  }

  // 2. Fallback to OpenStreetMap Nominatim reverse geocode
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        // Clean up address (take first 3-4 segments)
        const parts = data.display_name.split(',').map((p) => p.trim());
        const cleaned = parts.slice(0, 4).join(', ');
        return {
          address: cleaned.includes('Pune') ? cleaned : `${cleaned}, Pune`,
          latitude: lat,
          longitude: lng,
          placeId: `osm_${data.osm_id || Date.now()}`,
        };
      }
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode notice:', e);
  }

  // 3. Fallback: find nearest Pune landmark from database
  let closest = PUNE_LOCALITIES_DATABASE[0];
  let minDistance = Infinity;
  for (const item of PUNE_LOCALITIES_DATABASE) {
    const dist = calculateDistanceKm(lat, lng, item.lat, item.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return {
    address: `Near ${closest.mainText}, Pune, Maharashtra`,
    latitude: lat,
    longitude: lng,
    placeId: closest.place_id,
  };
}

/**
 * Resolves a patient location query using Google Places + Pune registry + Nominatim fallback
 */
export async function resolvePuneLocation(query) {
  if (!query || !query.trim()) return null;
  const cleanQ = query.trim().toLowerCase();

  // 1. Direct match with Pune Localities Registry for instant sub-locality precision
  const exactLocalMatch = PUNE_LOCALITIES_DATABASE.find((item) =>
    item.keywords.some((kw) => cleanQ.includes(kw) || kw.includes(cleanQ))
  );
  if (exactLocalMatch) {
    return {
      address: exactLocalMatch.address,
      latitude: exactLocalMatch.lat,
      longitude: exactLocalMatch.lng,
      placeId: exactLocalMatch.place_id,
    };
  }

  // 2. Try Google PlacesService.findPlaceFromQuery
  const placeResult = await findGooglePlace(query);
  if (placeResult) return placeResult;

  // 3. Try Google Geocoder if available
  if (window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const googleResult = await new Promise((resolve) => {
        const queryWithCity = cleanQ.includes('pune') ? query.trim() : `${query.trim()}, Pune, Maharashtra`;
        geocoder.geocode(
          {
            address: queryWithCity,
            componentRestrictions: { country: 'in' },
          },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve({
                address: results[0].formatted_address,
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng(),
                placeId: results[0].place_id,
              });
            } else {
              resolve(null);
            }
          }
        );
      });

      if (googleResult) return googleResult;
    } catch (e) {
      console.warn('Google Geocoder search exception:', e);
    }
  }

  // 4. Online OpenStreetMap Nominatim search fallback
  try {
    const qWithCity = cleanQ.includes('pune') ? query.trim() : `${query.trim()}, Pune`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(qWithCity)}&limit=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        if (!isNaN(lat) && !isNaN(lng)) {
          const parts = item.display_name.split(',').map((p) => p.trim());
          const cleaned = parts.slice(0, 4).join(', ');
          return {
            address: cleaned.includes('Pune') ? cleaned : `${cleaned}, Pune`,
            latitude: lat,
            longitude: lng,
            placeId: `osm_${item.osm_id || Date.now()}`,
          };
        }
      }
    }
  } catch (e) {
    console.warn('Nominatim search fallback error:', e);
  }

  // 5. Online Photon geocoder fallback
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query + ' Pune')}&lat=18.5204&lon=73.8567`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const feat = data.features[0];
        const [lon, lat] = feat.geometry.coordinates;
        const name = feat.properties.name || query;
        const locality = feat.properties.locality || feat.properties.city || 'Pune';
        return {
          address: `${name}, ${locality}, Maharashtra, India`,
          latitude: lat,
          longitude: lon,
          placeId: `photon_${feat.properties.osm_id || Date.now()}`,
        };
      }
    }
  } catch (e) {
    console.warn('Photon geocoding fallback error:', e);
  }

  // 6. Broad locality keyword extraction
  for (const item of PUNE_LOCALITIES_DATABASE) {
    for (const kw of item.keywords) {
      if (cleanQ.includes(kw)) {
        return {
          address: `${query.trim()}, ${item.mainText}, Pune`,
          latitude: item.lat,
          longitude: item.lng,
          placeId: item.place_id,
        };
      }
    }
  }

  return null;
}


/**
 * Generates an SVG Data URI for the custom Patient Location marker
 */
export function createPatientMarkerIcon() {
  const svg = `
    <svg width="120" height="74" viewBox="0 0 120 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Glow / Beacon Circle -->
      <circle cx="60" cy="22" r="21" fill="rgba(0, 165, 81, 0.22)"/>
      <circle cx="60" cy="22" r="16" fill="rgba(0, 165, 81, 0.4)"/>
      
      <!-- Pin Body (Teardrop) -->
      <path d="M60 4C50.06 4 42 12.06 42 22C42 35.5 60 48 60 48C60 48 78 35.5 78 22C78 12.06 69.94 4 60 4Z" fill="#00A551" stroke="#FFFFFF" stroke-width="2.5"/>
      <circle cx="60" cy="21" r="7" fill="#FFFFFF"/>
      <circle cx="60" cy="21" r="3.5" fill="#00A551"/>

      <!-- Tag Underneath -->
      <rect x="15" y="48" width="90" height="22" rx="11" fill="#1A2741" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="26" cy="59" r="3.5" fill="#00A551"/>
      <text x="34" y="62.5" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="800" letter-spacing="0.2">
        Patient Location
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Builds clean popup HTML for a nearby hospital relative to patient location
 */
export function buildNearbyHospitalPopupHtml(hospital, distanceFromPatient) {
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 230px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #2A362C;">${hospital.name}</h4>
        <span style="background: #E8F6E9; color: #00A551; border: 1px solid #71BC75; border-radius: 6px; font-size: 10px; font-weight: 800; padding: 2px 6px;">
          ${distanceFromPatient} km away
        </span>
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 6px; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
        <div>
          <span style="color: #687280; font-size: 10px; text-transform: uppercase;">Available Beds:</span>
          <strong style="color: #00A551; font-size: 14px; display: block;">${hospital.availableBeds}</strong>
        </div>
        <div>
          <span style="color: #687280; font-size: 10px; text-transform: uppercase;">Emergency Cap:</span>
          <strong style="color: #2D3748; font-size: 13px; display: block;">${hospital.emergencyCapacity}</strong>
        </div>
      </div>
    </div>
  `;
}

/**
 * Builds clean popup HTML for an available ambulance ready for dispatch relative to patient location
 */
export function buildAvailableAmbulancePopupHtml(ambulance, distanceFromPatient) {
  const etaMinutes = Math.max(2, Math.round(distanceFromPatient * 2.2));
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 8px; min-width: 250px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #1A2741;">${ambulance.id}</h4>
        <span style="background: #E8F6E9; color: #00A551; border: 1px solid #71BC75/40; border-radius: 999px; font-size: 10px; font-weight: 800; padding: 2px 8px; display: inline-flex; align-items: center; gap: 4px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #00A551;"></span>
          Available • Ready
        </span>
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 8px; font-size: 12px; line-height: 1.6;">
        <div><span style="color: #687280;">Station Base:</span> <strong style="color: #1A2741;">${ambulance.station || 'Emergency Depot'}</strong></div>
        <div><span style="color: #687280;">Distance to Patient:</span> <strong style="color: #00A551; font-size: 13px;">${distanceFromPatient} km</strong> (~${etaMinutes} mins ETA)</div>
        <div><span style="color: #687280;">Vehicle Type:</span> <strong style="color: #1A2741;">${ambulance.type || 'Advanced Life Support (ALS)'}</strong></div>
        <div><span style="color: #687280;">Driver:</span> <strong>${ambulance.driver}</strong> (${ambulance.contact})</div>
      </div>
    </div>
  `;
}

/**
 * Builds clean popup HTML for a nearby ambulance relative to patient location
 */
export function buildNearbyAmbulancePopupHtml(ambulance, distanceFromPatient) {
  const etaMinutes = Math.max(2, Math.round(distanceFromPatient * 2.2));
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 220px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #2A362C;">${ambulance.id}</h4>
        <span style="background: #E8F6E9; color: #00A551; border-radius: 12px; font-size: 10px; font-weight: 700; padding: 2px 7px;">
          ${ambulance.status}
        </span>
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 6px; font-size: 12px; line-height: 1.5;">
        <div><span style="color: #687280;">Distance from Patient:</span> <strong style="color: #00A551;">${distanceFromPatient} km</strong> (~${etaMinutes} mins)</div>
        <div><span style="color: #687280;">Type:</span> <strong>${ambulance.type || 'ALS Unit'}</strong></div>
      </div>
    </div>
  `;
}

/**
 * Generates an SVG Data URI for an available ambulance marker with distance from patient badge
 */
export function createAvailableAmbulanceMarkerIcon(distanceText, etaText = '') {
  const badgeLabel = etaText ? `${distanceText} • ${etaText}` : `${distanceText} away`;
  const svg = `
    <svg width="112" height="68" viewBox="0 0 112 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow Circle & Ambulance Pin Body -->
      <g transform="translate(38, 2)">
        <circle cx="18" cy="18" r="17" fill="#00A551" stroke="#FFFFFF" stroke-width="2.5"/>
        <path d="M10 13H20L23 16V22H10V13Z" fill="#FFFFFF"/>
        <circle cx="13" cy="22" r="2.5" fill="#1A2741"/>
        <circle cx="20" cy="22" r="2.5" fill="#1A2741"/>
        <rect x="13.5" y="16" width="3" height="3" fill="#FAF8AB"/>
        <circle cx="28" cy="7" r="3.5" fill="#22C55E" stroke="#FFFFFF" stroke-width="1.5"/>
      </g>
      <!-- Pill Badge: Distance from Patient -->
      <g transform="translate(2, 42)">
        <rect width="108" height="22" rx="11" fill="#1A2741" stroke="#00A551" stroke-width="1.5"/>
        <circle cx="11" cy="11" r="3.5" fill="#00A551"/>
        <text x="18" y="14.5" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="800" letter-spacing="0.2">
          ${badgeLabel}
        </text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Calculates Haversine distance in kilometers between two coordinates
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Generates an SVG Data URI for hospital pin
 */
export function createHospitalIcon(hospital) {
  const isRegional = hospital.zone && hospital.zone.includes('Regional');
  const color = isRegional ? '#2563EB' : '#00A551';
  const tagBg = isRegional ? '#1E40AF' : '#14532D';
  const tagText = isRegional ? 'REGIONAL' : 'HOSPITAL';

  const svg = `
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 0C9.85 0 0 9.85 0 22C0 38.5 22 54 22 54C22 54 44 38.5 44 22C44 9.85 34.15 0 22 0Z" fill="${color}"/>
      <circle cx="22" cy="20" r="15" fill="#FFFFFF"/>
      <rect x="20" y="10" width="4" height="20" rx="1.5" fill="${color}"/>
      <rect x="12" y="18" width="20" height="4" rx="1.5" fill="${color}"/>
      <rect x="7" y="32" width="30" height="12" rx="6" fill="${tagBg}" stroke="#FFFFFF" stroke-width="1.2"/>
      <text x="22" y="40.5" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="6.5" font-weight="800" text-anchor="middle" letter-spacing="0.4">
        ${tagText}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Generates an SVG Data URI for an ambulance with the live distance written right on it
 */
export function createAmbulanceWithDistanceIcon(ambulance) {
  const color = ambulance.status === 'En Route' ? '#00A551' : '#D97706';
  const distance = ambulance.distanceKm || '2.0 km';
  const eta = ambulance.eta || '05 min';

  const svg = `
    <svg width="108" height="66" viewBox="0 0 108 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Pin Circle & Vehicle -->
      <g transform="translate(36, 2)">
        <circle cx="18" cy="18" r="17" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
        <path d="M10 13H20L23 16V22H10V13Z" fill="#FFFFFF"/>
        <circle cx="13" cy="22" r="2.5" fill="#1A2741"/>
        <circle cx="20" cy="22" r="2.5" fill="#1A2741"/>
        <rect x="13.5" y="16" width="3" height="3" fill="#FAF8AB"/>
      </g>
      <!-- Distance Badge Written Directly On The Marker -->
      <g transform="translate(4, 40)">
        <rect width="100" height="22" rx="11" fill="#1A2741" stroke="#FFFFFF" stroke-width="1.5"/>
        <circle cx="11" cy="11" r="3.5" fill="#00A551"/>
        <text x="18" y="14.5" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="800" letter-spacing="0.2">
          ${distance} • ${eta}
        </text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Generates an SVG Data URI for route midpoint distance badge
 */
export function createRouteMidpointBadgeIcon(distanceText, hospitalName) {
  const shortName = hospitalName.length > 13 ? hospitalName.slice(0, 11) + '..' : hospitalName;
  const svg = `
    <svg width="138" height="28" viewBox="0 0 138 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="136" height="26" rx="13" fill="#FFFFFF" stroke="#00A551" stroke-width="2"/>
      <circle cx="12" cy="14" r="4" fill="#00A551"/>
      <text x="21" y="17.5" fill="#1A2741" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800">
        ${distanceText} ➔ <tspan fill="#00A551">${shortName}</tspan>
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Generates an SVG Data URI for emergency incident beacon
 */
export function createEmergencyIcon() {
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
export function buildHospitalPopupHtml(hospital, inboundAmbulance) {
  const isRegional = hospital.zone && hospital.zone.includes('Regional');
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 250px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="width: 24px; height: 24px; border-radius: 6px; background: ${isRegional ? '#EFF6FF' : '#E8F6E9'}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: ${isRegional ? '#2563EB' : '#00A551'}; font-size: 15px;">+</span>
        <div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #2A362C;">${hospital.name}</h4>
          <span style="font-size: 10px; color: ${isRegional ? '#2563EB' : '#00A551'}; font-weight: 700;">${hospital.zone || 'Operational Zone'}</span>
        </div>
      </div>

      ${
        inboundAmbulance
          ? `
        <div style="background: #E8F6E9; border-radius: 8px; padding: 7px 10px; margin-bottom: 8px; border: 1.5px solid #00A551; font-size: 11px;">
          <div style="color: #00A551; font-weight: 800; display: flex; items-center; justify-content: space-between;">
            <span>🚑 INBOUND AMBULANCE:</span>
            <span>${inboundAmbulance.distanceKm}</span>
          </div>
          <div style="color: #2A362C; font-weight: 700; margin-top: 2px;">
            ${inboundAmbulance.id} is approaching (ETA: ${inboundAmbulance.eta})
          </div>
        </div>
      `
          : ''
      }

      <div style="border-top: 1px solid #F0F4EF; padding-top: 8px; margin-bottom: 8px; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
        <div>
          <span style="color: #687280; display: block; font-size: 10px; text-transform: uppercase;">Available Beds</span>
          <strong style="color: #00A551; font-size: 15px;">${hospital.availableBeds}</strong>
        </div>
        <div>
          <span style="color: #687280; display: block; font-size: 10px; text-transform: uppercase;">ICU Beds</span>
          <strong style="color: #2D3748; font-size: 15px;">${hospital.icuBeds}</strong>
        </div>
        <div style="grid-column: span 2; margin-top: 2px;">
          <span style="color: #687280; font-size: 10px; display: block;">Address:</span>
          <span style="color: #4A4A4A; font-weight: 500; font-size: 11px;">${hospital.address}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Builds HTML for Ambulance Popup with live distance to destination hospital
 */
export function buildAmbulancePopupHtml(ambulance, destinationHospital) {
  const distance = ambulance.distanceKm || '2.0 km';
  const eta = ambulance.eta || '05 min';

  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 250px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-weight: 800; font-size: 15px; color: #2A362C;">${ambulance.id}</span>
          <span style="background: #E8F6E9; color: #00A551; border: 1px solid #71BC75; border-radius: 6px; font-size: 11px; font-weight: 800; padding: 2px 7px;">
            ${distance}
          </span>
        </div>
        <span style="background: #E8F6E9; color: #00A551; border-radius: 12px; font-size: 11px; font-weight: 700; padding: 2px 8px;">
          ${ambulance.status}
        </span>
      </div>

      <div style="background: #F8FAF7; border-radius: 10px; padding: 8px 10px; margin-bottom: 8px; border: 1.5px solid #D7E3D5;">
        <div style="font-size: 10px; color: #687280; font-weight: 700; text-transform: uppercase;">DESTINATION HOSPITAL</div>
        <div style="font-weight: 800; font-size: 13px; color: #00A551; margin-top: 2px;">
          ➔ ${ambulance.destination}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; border-top: 1px solid #F0F4EF; padding-top: 8px; font-size: 12px;">
        <div>
          <span style="color: #687280; font-size: 10px; text-transform: uppercase;">Distance to Hospital</span>
          <div style="font-weight: 800; color: #00A551; font-size: 15px;">${distance}</div>
        </div>
        <div>
          <span style="color: #687280; font-size: 10px; text-transform: uppercase;">ETA</span>
          <div style="font-weight: 800; color: #2A362C; font-size: 15px;">${eta}</div>
        </div>
        <div>
          <span style="color: #687280; font-size: 10px; text-transform: uppercase;">Speed</span>
          <div style="font-weight: 700; color: #4A4A4A;">${ambulance.speedKmph || 45} km/h</div>
        </div>
        <div>
          <span style="color: #687280; font-size: 10px; text-transform: uppercase;">Driver</span>
          <div style="font-weight: 700; color: #4A4A4A;">${ambulance.driver}</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Builds HTML for Emergency Popup
 */
export function buildEmergencyPopupHtml(emergency) {
  return `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 6px; min-width: 240px; color: #4A4A4A;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-weight: 800; font-size: 14px; color: #EF4444;">${emergency.id}</span>
        <span style="background: #FEE2E2; color: #DC2626; border-radius: 10px; font-size: 10px; font-weight: 700; padding: 2px 7px;">
          ${emergency.priority} Priority
        </span>
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #2A362C; margin-bottom: 8px;">
        ${emergency.type}
      </div>
      <div style="border-top: 1px solid #F0F4EF; padding-top: 8px; margin-bottom: 8px; font-size: 12px; line-height: 1.5;">
        <div><span style="color: #687280;">Assigned Ambulance:</span> <strong>${emergency.assignedAmbulance || emergency.ambulanceId}</strong></div>
        <div><span style="color: #687280;">Destination Hospital:</span> <strong>${emergency.destinationHospital || emergency.hospitalId}</strong></div>
        <div><span style="color: #687280;">Distance:</span> <strong style="color: #00A551;">${emergency.distanceKm || '2.0 km'}</strong></div>
        <div><span style="color: #687280;">ETA:</span> <strong style="color: #00A551;">${emergency.eta}</strong></div>
        <div><span style="color: #687280;">Location:</span> <strong>${emergency.location}</strong></div>
      </div>
    </div>
  `;
}
