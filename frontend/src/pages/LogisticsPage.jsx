import React, { useState, useMemo } from 'react';
import TopNavbar from '../components/TopNavbar';
import { dailyMetrics, emergencyTripsLog } from '../data/logisticsData';
import { useEmergency } from '../context/EmergencyContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  Navigation,
  Search,
  Filter,
  Ambulance,
  Building2,
  MapPin,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  X,
  FileText,
  HeartPulse,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react';

export default function LogisticsPage() {
  const { tripsLog = emergencyTripsLog } = useEmergency();
  const currentTrips = tripsLog && tripsLog.length > 0 ? tripsLog : emergencyTripsLog;

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED'
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL' | 'Critical' | 'High' | 'Medium'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return currentTrips.filter((trip) => {
      // Tab filter
      if (activeTab === 'ACTIVE' && trip.status !== 'Active') return false;
      if (activeTab === 'COMPLETED' && trip.status !== 'Completed') return false;

      // Priority filter
      if (priorityFilter !== 'ALL' && trip.priority !== priorityFilter) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesId = trip.tripId.toLowerCase().includes(query) || trip.emergencyId.toLowerCase().includes(query);
        const matchesType = trip.type.toLowerCase().includes(query) || trip.category.toLowerCase().includes(query);
        const matchesAmb = trip.ambulanceId.toLowerCase().includes(query) || trip.driver.toLowerCase().includes(query);
        const matchesLocation = trip.pickupLocation.toLowerCase().includes(query) || trip.destinationHospital.toLowerCase().includes(query);
        const matchesCaller = trip.callerName.toLowerCase().includes(query);
        if (!matchesId && !matchesType && !matchesAmb && !matchesLocation && !matchesCaller) {
          return false;
        }
      }

      return true;
    });
  }, [currentTrips, activeTab, priorityFilter, searchTerm]);

  // Dynamic counts
  const totalCount = useMemo(() => currentTrips.length, [currentTrips]);
  const activeCount = useMemo(() => currentTrips.filter((t) => t.status === 'Active').length, [currentTrips]);
  const completedCount = useMemo(() => currentTrips.filter((t) => t.status === 'Completed').length, [currentTrips]);
  const alsCount = useMemo(() => currentTrips.filter((t) => t.responseType === 'ALS').length, [currentTrips]);
  const blsCount = useMemo(() => currentTrips.filter((t) => t.responseType === 'BLS').length, [currentTrips]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans select-none text-[#4A4A4A]">
      {/* ── Top Navbar ── */}
      <TopNavbar />

      {/* ── Main Content Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header Section ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6ECE3]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2741] tracking-tight">
              Daily Logistics &amp; Trips Summary
            </h1>
            <p className="text-xs sm:text-sm text-[#687280] mt-1 font-medium">
              Real-time operational summary of all emergency dispatches, transit durations, and hospital transfers.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E6ECE3] shadow-xs text-xs font-semibold text-[#1A2741] shrink-0">
            <Calendar className="w-4 h-4 text-[#00A551]" />
            <span>{dailyMetrics.date}</span>
          </div>
        </div>

        {/* ── KPI Metrics Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Incidents */}
          <div className="bg-white rounded-2xl border border-[#E6ECE3] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#71BC75]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">Total Emergencies</span>
              <div className="w-9 h-9 rounded-xl bg-[#E8F6E9] text-[#00A551] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#1A2741] tracking-tight">
                {totalCount}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-[#687280]">
                <span className="text-[#00A551] font-bold">100%</span> logged &amp; tracked
              </div>
            </div>
          </div>

          {/* Card 2: Active Emergencies */}
          <div className="bg-white rounded-2xl border border-[#E6ECE3] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#DC2626]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Active In-Transit</span>
              <div className="w-9 h-9 rounded-xl bg-[#FFF5F5] text-[#DC2626] flex items-center justify-center">
                <Ambulance className="w-4 h-4 animate-bounce" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#DC2626] tracking-tight">
                {activeCount}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-[#DC2626]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                Live siren &amp; corridor tracking
              </div>
            </div>
          </div>

          {/* Card 3: Completed Trips */}
          <div className="bg-white rounded-2xl border border-[#E6ECE3] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#00A551]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00A551] uppercase tracking-wider">Completed Trips</span>
              <div className="w-9 h-9 rounded-xl bg-[#E8F6E9] text-[#00A551] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#00A551] tracking-tight">
                {completedCount}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-[#687280]">
                <span className="text-[#00A551] font-bold">{dailyMetrics.bedHandoverSuccessRate}</span> bed handover rate
              </div>
            </div>
          </div>

          {/* Card 4: Performance & Response */}
          <div className="bg-white rounded-2xl border border-[#E6ECE3] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">Avg. Dispatch Time</span>
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#1A2741] tracking-tight">
                {dailyMetrics.avgDispatchTime}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-[#687280]">
                <span>Total: <strong>{dailyMetrics.totalKmTraveled}</strong></span>
                <span>&bull;</span>
                <span className="text-[#2563EB] font-bold">{alsCount} ALS / {blsCount} BLS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filters & Search Bar ── */}
        <div className="bg-white rounded-2xl border border-[#E6ECE3] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex items-center p-1 bg-[#FAF9F5] rounded-xl border border-[#E6ECE3] self-start">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-white text-[#1A2741] shadow-xs'
                  : 'text-[#687280] hover:text-[#1A2741]'
              }`}
            >
              All Trips ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ACTIVE'
                  ? 'bg-[#FFF5F5] text-[#DC2626] border border-[#DC2626]/30 shadow-xs'
                  : 'text-[#687280] hover:text-[#DC2626]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'COMPLETED'
                  ? 'bg-[#E8F6E9] text-[#00A551] border border-[#00A551]/30 shadow-xs'
                  : 'text-[#687280] hover:text-[#00A551]'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search and Priority Selector */}
          <div className="flex items-center gap-2.5 flex-1 md:max-w-md">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trip, emergency, hospital, driver..."
                className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#E6ECE3] rounded-xl text-xs text-[#1A2741] placeholder-[#94A3B8] focus:outline-none focus:border-[#00A551] focus:bg-white transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A2741]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F5] border border-[#E6ECE3] rounded-xl text-xs font-bold text-[#1A2741] focus:outline-none focus:border-[#00A551] cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>

        {/* ── Trips List ── */}
        <div className="space-y-3">
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6ECE3] p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] text-[#94A3B8] flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1A2741]">No matching trip records found</h3>
              <p className="text-xs text-[#687280] mt-1">Try adjusting your search terms or filter selection.</p>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const isActive = trip.status === 'Active';
              const isCritical = trip.priority === 'Critical';

              return (
                <div
                  key={trip.tripId}
                  onClick={() => setSelectedTrip(trip)}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 hover:shadow-md cursor-pointer ${
                    isActive
                      ? 'border-[#DC2626]/30 hover:border-[#DC2626] bg-gradient-to-r from-white via-white to-[#FFF5F5]/40'
                      : 'border-[#E6ECE3] hover:border-[#71BC75]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: IDs, Type & Badges */}
                    <div className="flex items-start gap-3.5">
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#FFF5F5] text-[#DC2626] border border-[#DC2626]/20'
                            : 'bg-[#E8F6E9] text-[#00A551] border border-[#71BC75]/30'
                        }`}
                      >
                        <Ambulance className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-[#1A2741] font-mono tracking-tight">
                            {trip.tripId}
                          </span>
                          <span className="text-[10px] font-bold text-[#687280] font-mono">
                            ({trip.emergencyId})
                          </span>

                          {/* Status Badge */}
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F5] border border-[#DC2626]/40 text-[#DC2626] text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                              {trip.subStatus}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F6E9] border border-[#71BC75]/40 text-[#00A551] text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          )}

                          {/* Response Type (ALS/BLS) */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              trip.responseType === 'ALS'
                                ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                                : 'bg-[#EFF6FF] text-[#2563EB] border-[#93C5FD]'
                            }`}
                          >
                            {trip.responseType}
                          </span>

                          {/* Priority */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isCritical
                                ? 'bg-[#DC2626] text-white'
                                : trip.priority === 'High'
                                ? 'bg-[#EA580C] text-white'
                                : 'bg-[#F1F5F9] text-[#475569]'
                            }`}
                          >
                            {trip.priority}
                          </span>
                        </div>

                        {/* Title & Category */}
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-[#1A2741]">{trip.type}</h3>
                          <span className="text-xs text-[#687280]">&bull; {trip.category}</span>
                        </div>

                        {/* Summary preview */}
                        <p className="text-xs text-[#687280] line-clamp-1 max-w-2xl mt-0.5">
                          {trip.summary}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Route Details (Pickup -> Hospital) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:w-[38%] border-t lg:border-t-0 lg:border-l border-[#F0F4EF] pt-3 lg:pt-0 lg:pl-4">
                      {/* Pickup */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00A551] shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#687280] block">
                            Pickup Scene
                          </span>
                          <span className="text-xs font-semibold text-[#1A2741] truncate block">
                            {trip.pickupLocation}
                          </span>
                        </div>
                      </div>

                      {/* Hospital */}
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#687280] block">
                            Destination Hospital
                          </span>
                          <span className="text-xs font-bold text-[#1A2741] truncate block">
                            {trip.destinationHospital}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Driver, Duration, CTA */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 shrink-0">
                      <div className="text-left lg:text-right">
                        <div className="text-xs font-extrabold text-[#1A2741] flex items-center lg:justify-end gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#687280]" />
                          <span>{trip.driver}</span>
                          <span className="text-[#00A551]">({trip.ambulanceId})</span>
                        </div>
                        <div className="text-[11px] font-medium text-[#687280] mt-0.5">
                          <span>{trip.distanceKm}</span> &bull; <span>{trip.tripDuration}</span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#E6ECE3] flex items-center justify-center text-[#687280] group-hover:text-[#00A551] group-hover:border-[#71BC75] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ── Slide-over Modal: Comprehensive Trip Details ── */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-[#E6ECE3]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E6ECE3] bg-[#FAF9F5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black font-mono text-[#1A2741]">{selectedTrip.tripId}</span>
                  <span className="text-xs font-bold text-[#687280]">({selectedTrip.emergencyId})</span>
                </div>
                <h2 className="text-base font-extrabold text-[#1A2741] mt-0.5">{selectedTrip.type}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrip(null)}
                className="w-8 h-8 rounded-xl hover:bg-[#F1F5F9] text-[#687280] hover:text-[#1A2741] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  selectedTrip.status === 'Active'
                    ? 'bg-[#FFF5F5] border-[#DC2626]/30 text-[#DC2626]'
                    : 'bg-[#E8F6E9] border-[#00A551]/30 text-[#00A551]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {selectedTrip.status === 'Active' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{selectedTrip.status} Trip</div>
                    <div className="text-sm font-black text-[#1A2741]">{selectedTrip.subStatus}</div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                    selectedTrip.responseType === 'ALS'
                      ? 'bg-white text-[#DC2626] border-[#DC2626]/40'
                      : 'bg-white text-[#2563EB] border-[#2563EB]/40'
                  }`}
                >
                  {selectedTrip.responseType} Unit
                </span>
              </div>

              {/* Clinical Summary & Notes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1A2741] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#00A551]" />
                  Trip Notes &amp; Clinical Summary
                </span>
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6ECE3] text-xs font-medium text-[#2D3748] leading-relaxed">
                  {selectedTrip.summary}
                </div>
              </div>

              {/* Recorded Vitals */}
              {selectedTrip.vitals && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1A2741] uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-[#DC2626]" />
                    In-Transit Vitals Log
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2.5 bg-white border border-[#E6ECE3] rounded-xl text-center">
                      <span className="text-[10px] text-[#687280] font-bold block">BP</span>
                      <span className="text-xs font-extrabold text-[#1A2741]">{selectedTrip.vitals.bp}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-[#E6ECE3] rounded-xl text-center">
                      <span className="text-[10px] text-[#687280] font-bold block">Pulse</span>
                      <span className="text-xs font-extrabold text-[#1A2741]">{selectedTrip.vitals.pulse}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-[#E6ECE3] rounded-xl text-center">
                      <span className="text-[10px] text-[#687280] font-bold block">SpO2</span>
                      <span className="text-xs font-extrabold text-[#00A551]">{selectedTrip.vitals.spo2}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-[#E6ECE3] rounded-xl text-center">
                      <span className="text-[10px] text-[#687280] font-bold block">Temp</span>
                      <span className="text-xs font-extrabold text-[#1A2741]">{selectedTrip.vitals.temp}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Route & Destination */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#1A2741] uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#2563EB]" />
                  Transit Path &amp; Destination
                </span>
                <div className="space-y-2.5 p-4 rounded-xl bg-white border border-[#E6ECE3]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F6E9] text-[#00A551] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      A
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#687280] uppercase">Pickup Location</span>
                      <p className="text-xs font-bold text-[#1A2741]">{selectedTrip.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="ml-2.5 pl-3.5 border-l-2 border-dashed border-[#CBD5E1] py-1 text-[11px] text-[#687280] font-medium">
                    Distance: <strong>{selectedTrip.distanceKm}</strong> &bull; Total Transit: <strong>{selectedTrip.tripDuration}</strong>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      B
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#687280] uppercase">Destination Hospital</span>
                      <p className="text-xs font-bold text-[#1A2741]">{selectedTrip.destinationHospital}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crew & Caller Details */}
              <div className="grid grid-cols-2 gap-3">
                {/* Ambulance Crew */}
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6ECE3] space-y-1">
                  <span className="text-[10px] font-bold text-[#687280] uppercase block">Assigned Crew</span>
                  <div className="text-xs font-extrabold text-[#1A2741]">{selectedTrip.driver}</div>
                  <div className="text-[11px] text-[#00A551] font-bold">{selectedTrip.ambulanceId}</div>
                  <div className="text-[11px] text-[#687280]">{selectedTrip.driverContact}</div>
                </div>

                {/* Caller Info */}
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6ECE3] space-y-1">
                  <span className="text-[10px] font-bold text-[#687280] uppercase block">Caller / Reporter</span>
                  <div className="text-xs font-extrabold text-[#1A2741]">{selectedTrip.callerName}</div>
                  <div className="text-[11px] text-[#687280]">{selectedTrip.callerPhone}</div>
                  <div className="text-[10px] text-[#687280]">Reported at {selectedTrip.timeReported}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E6ECE3] bg-[#FAF9F5]">
              <button
                type="button"
                onClick={() => setSelectedTrip(null)}
                className="w-full py-2.5 rounded-xl bg-[#1A2741] hover:bg-[#243456] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
