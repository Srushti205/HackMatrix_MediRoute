import React from 'react';
import { Search, X, MapPin } from 'lucide-react';

export default function LocationSearch({
  locationValue = 'Shivajinagar, Pune, Maharashtra, India',
  onLocationChange,
  onClearLocation,
}) {
  const [searchValue, setSearchValue] = React.useState(locationValue);

  // Sync state if prop changes from external (e.g. map pin click)
  React.useEffect(() => {
    setSearchValue(locationValue);
  }, [locationValue]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onLocationChange) onLocationChange(val);
  };

  const handleClear = () => {
    setSearchValue('');
    if (onClearLocation) {
      onClearLocation();
    } else if (onLocationChange) {
      onLocationChange('');
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#687280] pointer-events-none flex items-center">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search location or nearby landmark"
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#2D3748] placeholder-[#94A3B8] focus:outline-none focus:border-[#00A551] focus:ring-2 focus:ring-[#00A551]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          aria-label="Location search"
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
