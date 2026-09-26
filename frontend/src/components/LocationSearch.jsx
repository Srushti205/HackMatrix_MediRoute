import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import {
  loadGoogleMaps,
  hasValidGoogleMapsKey,
  PUNE_LOCALITIES_DATABASE,
  resolvePuneLocation,
  getGooglePlaceDetails,
} from '../services/mapService';

export default function LocationSearch({
  locationValue = 'Shivajinagar, Pune, Maharashtra, India',
  onLocationChange,
  onClearLocation,
}) {
  const [searchValue, setSearchValue] = useState(locationValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [searchError, setSearchError] = useState('');

  const autocompleteServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync input when location prop changes externally (e.g. from map click)
  useEffect(() => {
    setSearchValue(locationValue || '');
  }, [locationValue]);

  // Initialize Google Maps AutocompleteService and Geocoder
  useEffect(() => {
    let isMounted = true;

    const setupServices = async () => {
      if (!hasValidGoogleMapsKey()) return;
      try {
        await loadGoogleMaps();
        if (!isMounted || !window.google?.maps) return;

        if (window.google.maps.places?.AutocompleteService && !autocompleteServiceRef.current) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }
        if (window.google.maps.Geocoder && !geocoderRef.current) {
          geocoderRef.current = new window.google.maps.Geocoder();
        }
      } catch (err) {
        console.warn('Google Maps AutocompleteService initialization notice:', err);
      }
    };

    setupServices();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch predictions as dispatcher types
  const fetchPredictions = (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const cleanQ = query.trim().toLowerCase();

    // 1. Instant local Pune registry matches
    const localMatches = PUNE_LOCALITIES_DATABASE.filter((item) =>
      item.keywords.some((kw) => cleanQ.includes(kw) || kw.includes(cleanQ))
    ).map((item) => ({
      place_id: item.place_id,
      description: item.address,
      structured_formatting: {
        main_text: item.mainText,
        secondary_text: item.secondaryText,
      },
      isLocalRegistry: true,
      data: item,
    }));

    // If autocomplete service not yet ready, show local matches
    if (!autocompleteServiceRef.current && window.google?.maps?.places?.AutocompleteService) {
      try {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      } catch (e) {
        // ignore
      }
    }

    if (!autocompleteServiceRef.current) {
      if (localMatches.length > 0) {
        setSuggestions(localMatches);
        setShowSuggestions(true);
      }
      return;
    }

    setIsLoadingPredictions(true);
    setSearchError('');

    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'in' },
        },
        (predictions, status) => {
          setIsLoadingPredictions(false);
          const googleMatches =
            status === window.google?.maps?.places?.PlacesServiceStatus?.OK && predictions
              ? predictions
              : [];

          // Merge local Pune landmark matches + Google Places results (deduplicating)
          const merged = [...localMatches];
          googleMatches.forEach((gm) => {
            if (!merged.some((m) => m.place_id === gm.place_id)) {
              merged.push(gm);
            }
          });

          if (merged.length > 0) {
            setSuggestions(merged);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        }
      );
    } catch (err) {
      setIsLoadingPredictions(false);
      if (localMatches.length > 0) {
        setSuggestions(localMatches);
        setShowSuggestions(true);
      }
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    setSearchError('');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchPredictions(val);
    }, 200);
  };

  // When dispatcher selects a suggestion from dropdown
  const handleSelectSuggestion = async (suggestion) => {
    const selectedText = suggestion.description || suggestion.structured_formatting?.main_text || '';
    setSearchValue(selectedText);
    setShowSuggestions(false);
    setSuggestions([]);
    setSearchError('');

    // 1. If local registry item, resolve coordinates immediately
    if (suggestion.isLocalRegistry && suggestion.data) {
      const loc = suggestion.data;
      setSearchValue(loc.address);
      if (onLocationChange) {
        onLocationChange({
          address: loc.address,
          latitude: loc.lat,
          longitude: loc.lng,
          placeId: loc.place_id,
        });
      }
      return;
    }

    // 2. Try Google PlacesService.getDetails (direct place geometry from Google Maps)
    if (suggestion.place_id && !suggestion.place_id.startsWith('pune_loc')) {
      const placeDetails = await getGooglePlaceDetails(suggestion.place_id);
      if (placeDetails && placeDetails.latitude && placeDetails.longitude) {
        setSearchValue(placeDetails.address);
        if (onLocationChange) {
          onLocationChange(placeDetails);
        }
        return;
      }
    }

    // 3. Fallback to robust resolvePuneLocation (Google search + Geocoder + Nominatim + Pune DB)
    const resolved = await resolvePuneLocation(selectedText);
    if (resolved && onLocationChange) {
      setSearchValue(resolved.address);
      onLocationChange(resolved);
    }
  };

  // Forward geocode string (for Enter key or direct submit)
  const geocodeByQuery = async (query) => {
    if (!query || !query.trim()) return;
    setIsLoadingPredictions(true);
    setSearchError('');

    const resolved = await resolvePuneLocation(query);
    setIsLoadingPredictions(false);

    if (resolved) {
      setSearchValue(resolved.address);
      setShowSuggestions(false);
      setSearchError('');
      if (onLocationChange) {
        onLocationChange(resolved);
      }
    } else {
      setSearchError('Location not found. Try searching for a nearby landmark.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        handleSelectSuggestion(suggestions[0]);
      } else if (searchValue.trim()) {
        geocodeByQuery(searchValue.trim());
      }
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchError('');
    if (onClearLocation) {
      onClearLocation();
    } else if (onLocationChange) {
      onLocationChange({
        address: '',
        latitude: null,
        longitude: null,
        placeId: null,
      });
    }
  };

  return (
    <div ref={dropdownRef} className="space-y-2.5 relative">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#687280] pointer-events-none flex items-center">
          {isLoadingPredictions ? (
            <Loader2 className="w-4 h-4 text-[#00A551] animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
            else if (searchValue.trim().length >= 2) fetchPredictions(searchValue);
          }}
          placeholder="Search location or nearby landmark (e.g. Snehal Terrace Kothrud)"
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#2D3748] placeholder-[#94A3B8] focus:outline-none focus:border-[#00A551] focus:ring-2 focus:ring-[#00A551]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          aria-label="Location search"
          autoComplete="off"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 w-5 h-5 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#4A4A4A] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Clear location search"
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Inline Search Error */}
      {searchError && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF5F5] border border-[#EF4444]/30 text-xs font-semibold text-[#DC2626] animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#EF4444]" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Autocomplete Dropdown Suggestions List */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-11 left-0 right-0 z-50 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden py-1.5 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3.5 py-1 text-[10px] font-bold text-[#687280] uppercase tracking-wider border-b border-[#F0F4EF]">
            Matching Locations
          </div>
          {suggestions.map((item) => {
            const mainText = item.structured_formatting?.main_text || item.description;
            const secondaryText = item.structured_formatting?.secondary_text || '';

            return (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-[#F0F4EF] flex items-start gap-2.5 transition-colors cursor-pointer border-b border-[#F8FAF7] last:border-b-0 group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#E8F6E9] text-[#00A551] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#00A551] group-hover:text-white transition-colors">
                  <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#1A2741] group-hover:text-[#00A551] transition-colors truncate">
                    {mainText}
                  </div>
                  {secondaryText && (
                    <div className="text-[11px] text-[#687280] truncate mt-0.5">
                      {secondaryText}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Location Card */}
      {locationValue && (
        <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#E8F6E9]/70 border border-[#71BC75]/40 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-[#00A551] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#00A551] tracking-wider uppercase">
                Selected Location
              </div>
              <div className="text-sm font-semibold text-[#1A2741] truncate">
                {locationValue}
              </div>
              <div className="text-[11px] text-[#687280] mt-0.5">
                Pune, Maharashtra, India &bull; Pin Verified
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-[#687280] hover:text-[#DC2626] transition-colors shrink-0 px-2 py-1 rounded-md hover:bg-white/60 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
