/**
 * MediRoute Fleet Data — Operational Area: Pune, Maharashtra
 * Active ambulances currently en route toward destination hospitals.
 *
 * Dispatchable/available ambulances are derived from the canonical ambulance-hub
 * dataset so the dispatcher, ambulance page, and emergency map all reference the
 * same vehicle IDs and physical hub locations.
 */
import { ambulanceHubs } from './ambulanceHubs';

export const ambulances = [
  {
    id: 'AMB-107',
    latitude: 18.5452,
    longitude: 73.8625,
    status: 'En Route',
    destination: 'Ruby Hall Clinic',
    destinationHospitalId: 'HOSP-01',
    distanceKm: '2.2 km',
    eta: '05 min',
    driver: 'Sunil Jadhav',
    type: 'Critical Care Unit (CCU)',
    assignedEmergencyId: 'EM-1042',
    speedKmph: 46,
  },
  {
    id: 'AMB-104',
    latitude: 18.5245,
    longitude: 73.8240,
    status: 'En Route',
    destination: 'Sahyadri Super Speciality Hospital',
    destinationHospitalId: 'HOSP-05',
    distanceKm: '2.0 km',
    eta: '06 min',
    driver: 'Rajesh Shinde',
    type: 'Advanced Life Support (ALS)',
    assignedEmergencyId: 'EM-1043',
    speedKmph: 42,
  },
  {
    id: 'AMB-115',
    latitude: 18.5175,
    longitude: 73.8910,
    status: 'En Route',
    destination: 'Jehangir Hospital',
    destinationHospitalId: 'HOSP-02',
    distanceKm: '1.9 km',
    eta: '05 min',
    driver: 'Ganesh More',
    type: 'Cardiac Mobile Unit',
    assignedEmergencyId: 'EM-1045',
    speedKmph: 39,
  },
  {
    id: 'AMB-112',
    latitude: 18.5085,
    longitude: 73.8615,
    status: 'En Route',
    destination: 'KEM Hospital',
    destinationHospitalId: 'HOSP-06',
    distanceKm: '1.8 km',
    eta: '04 min',
    driver: 'Amit Kulkarni',
    type: 'Advanced Life Support (ALS)',
    assignedEmergencyId: 'EM-1044',
    speedKmph: 45,
  },
  {
    id: 'AMB-109',
    latitude: 18.4845,
    longitude: 73.8465,
    status: 'En Route',
    destination: 'Deenanath Mangeshkar Hospital',
    destinationHospitalId: 'HOSP-04',
    distanceKm: '2.3 km',
    eta: '07 min',
    driver: 'Vikram Pawar',
    type: 'Basic Life Support (BLS)',
    assignedEmergencyId: 'EM-1046',
    speedKmph: 38,
  },
];

/**
 * Canonical dispatchable fleet derived from the ambulance-hub map.
 *
 * Each available ambulance inherits its hub's exact latitude/longitude, so
 * selecting the nearest vehicle uses the same "spot" shown on the Ambulances tab.
 */
export const availableAmbulances = ambulanceHubs.flatMap((hub) =>
  hub.ambulances
    .filter((ambulance) => ambulance.status === 'Available')
    .map((ambulance) => ({
      ...ambulance,
      hubId: hub.id,
      station: hub.name,
      latitude: hub.lat,
      longitude: hub.lng,
      type:
        ambulance.type === 'ALS'
          ? 'Advanced Life Support (ALS)'
          : ambulance.type === 'BLS'
            ? 'Basic Life Support (BLS)'
            : ambulance.type,
    }))
);
