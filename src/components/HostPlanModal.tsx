import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  MapPin,
  Clock,
  Users,
  Search,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { PlanCategory, CommercialVenue } from '../types';
import { COMMERCIAL_VENUES, CITY_HUBS } from '../data/mockData';

export const HostPlanModal: React.FC = () => {
  const {
    isHostModalOpen,
    setIsHostModalOpen,
    activeCityCode,
    currentUser,
    createPlan,
    startVerificationFlow,
    setActiveTab,
  } = useFellow();

  const city = CITY_HUBS[activeCityCode] || CITY_HUBS.TYO_JP;

  // Form states
  const [category, setCategory] = useState<PlanCategory>('dining');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [planDate, setPlanDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [planTime, setPlanTime] = useState<string>('19:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [maxParticipants, setMaxParticipants] = useState<number>(4);
  const [femaleOnly, setFemaleOnly] = useState<boolean>(false);

  // Venue search & selection (Google Places Commercial Establishments)
  const [venueSearchQuery, setVenueSearchQuery] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<CommercialVenue | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // City-specific commercial venues
  const cityVenues = useMemo(() => {
    return COMMERCIAL_VENUES.filter((v) => v.city_code === activeCityCode);
  }, [activeCityCode]);

  const searchedVenues = useMemo(() => {
    if (!venueSearchQuery.trim()) return cityVenues;
    const q = venueSearchQuery.toLowerCase();
    return cityVenues.filter(
      (v) => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
    );
  }, [cityVenues, venueSearchQuery]);

  if (!isHostModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Verification check
    if (!currentUser.is_verified || !currentUser.has_paid_pass) {
      setIsHostModalOpen(false);
      startVerificationFlow();
      return;
    }

    // Validation: Title
    if (!title.trim()) {
      setFormError('Please enter a title for your micro-plan.');
      return;
    }
    if (title.length > 60) {
      setFormError('Title must be at most 60 characters.');
      return;
    }

    // Validation: Description
    if (!description.trim()) {
      setFormError('Please enter a brief description.');
      return;
    }
    if (description.length > 300) {
      setFormError('Description must be at most 300 characters.');
      return;
    }

    // Validation: Commercial Venue
    if (!selectedVenue) {
      setFormError('Please select a commercial establishment verified by Google Places. Free-text or private residential addresses are prohibited.');
      return;
    }

    // Validation: Dates
    const startDateTime = new Date(`${planDate}T${planTime}:00`);
    if (isNaN(startDateTime.getTime())) {
      setFormError('Invalid date or time format.');
      return;
    }

    // Must be in future
    if (startDateTime.getTime() <= Date.now()) {
      setFormError('Plan start time must be in the future.');
      return;
    }

    // Must be within next 7 days (PRD Rule 2)
    const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
    if (startDateTime.getTime() > sevenDaysFromNow) {
      setFormError('Per anti-ghosting rules, micro-plans can only be scheduled within the upcoming 7 days.');
      return;
    }

    // Calculate end time
    const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000);

    const result = createPlan({
      city_code: activeCityCode,
      category,
      title: title.trim(),
      description: description.trim(),
      venue_name: selectedVenue.name,
      venue_address: selectedVenue.address,
      venue_lat: selectedVenue.lat,
      venue_lng: selectedVenue.lng,
      venue_place_id: selectedVenue.place_id,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      max_participants: maxParticipants,
      female_only: femaleOnly,
    });

    if (result.success) {
      setIsHostModalOpen(false);
      setActiveTab('my_plans');
    } else {
      setFormError(result.error || 'Failed to publish plan.');
    }
  };

  return (
    <div
      id="host-plan-modal-overlay"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-[#1A1918] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7E2]">
          <div>
            <h2 className="font-editorial text-xl font-semibold text-[#1A1918]">Host a Micro-Plan in {city.name}</h2>
            <p className="text-xs text-[#6B6966] mt-0.5">2–4 hours · Max 4 people · Public commercial venues only</p>
          </div>
          <button
            onClick={() => setIsHostModalOpen(false)}
            className="p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-left">
          {/* Field 1: Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1A1918]">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
              {(['dining', 'cafe_cowork', 'cultural_sight', 'outdoor_walk', 'nightlife'] as PlanCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all capitalize font-semibold ${
                      category === cat
                        ? 'border-[#1A1918] bg-[#1A1918] text-white shadow-2xs'
                        : 'border-[#EAE7E2] bg-[#F9F8F6] text-[#6B6966] hover:bg-[#EAE7E2]/50'
                    }`}
                  >
                    {cat === 'dining'
                      ? 'Dining'
                      : cat === 'cafe_cowork'
                      ? 'Cowork'
                      : cat === 'cultural_sight'
                      ? 'Culture'
                      : cat === 'outdoor_walk'
                      ? 'Walk'
                      : 'Nightlife'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Field 2: Title (max 60 chars) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#1A1918]">Plan Title</label>
              <span className={`text-[11px] font-mono-code ${title.length > 55 ? 'text-[#DC2626]' : 'text-[#9C9892]'}`}>
                {title.length}/60
              </span>
            </div>
            <input
              id="input-plan-title"
              type="text"
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset drinks at Miradouro de Santa Catarina"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white placeholder:text-[#9C9892]"
            />
          </div>

          {/* Field 3: Description (max 300 chars) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#1A1918]">Description</label>
              <span className={`text-[11px] font-mono-code ${description.length > 280 ? 'text-[#DC2626]' : 'text-[#9C9892]'}`}>
                {description.length}/300
              </span>
            </div>
            <textarea
              id="input-plan-description"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you do? Where exactly will you meet? Keep it low-commitment and fun."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white placeholder:text-[#9C9892] resize-none"
            />
          </div>

          {/* Field 4 & 5: Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1918]">Date (Within 7 Days)</label>
              <input
                id="input-plan-date"
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1918]">Start Time</label>
              <input
                id="input-plan-time"
                type="time"
                value={planTime}
                onChange={(e) => setPlanTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1918]">Duration (Max 4h)</label>
              <select
                id="select-plan-duration"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white cursor-pointer"
              >
                <option value={1.5}>1.5 Hours</option>
                <option value={2}>2.0 Hours</option>
                <option value={3}>3.0 Hours</option>
                <option value={4}>4.0 Hours (Max)</option>
              </select>
            </div>
          </div>

          {/* Field 6: Venue Location (Google Places commercial venues only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#1A1918]">
                Commercial Venue (Google Places Verified)
              </label>
              <span className="text-[11px] text-[#059669] font-medium">Public places only</span>
            </div>

            {selectedVenue ? (
              <div className="p-3.5 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E2] flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1918]">
                    <MapPin className="w-3.5 h-3.5 text-[#E64A2A] shrink-0" />
                    <span>{selectedVenue.name}</span>
                  </div>
                  <p className="text-[11px] text-[#6B6966]">{selectedVenue.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVenue(null)}
                  className="text-xs text-[#E64A2A] font-semibold hover:underline p-1"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9C9892] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={venueSearchQuery}
                    onChange={(e) => setVenueSearchQuery(e.target.value)}
                    placeholder={`Search verified establishments in ${city.name}...`}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white placeholder:text-[#9C9892]"
                  />
                </div>

                {/* Venues suggestions list */}
                <div className="max-h-32 overflow-y-auto space-y-1 rounded-2xl border border-[#EAE7E2] bg-[#F9F8F6] p-1 text-xs">
                  {searchedVenues.map((v) => (
                    <button
                      key={v.place_id}
                      type="button"
                      onClick={() => setSelectedVenue(v)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white hover:shadow-2xs transition-all flex items-start gap-2 text-[#6B6966]"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#E64A2A] shrink-0 mt-0.5" />
                      <div className="truncate">
                        <p className="font-semibold text-[#1A1918] truncate">{v.name}</p>
                        <p className="text-[10px] text-[#9C9892] truncate">{v.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Field 7: Group Size (2 to 4 people) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#1A1918]">Max Group Size (Including Host)</label>
              <span className="text-[11px] text-[#9C9892]">2 to 4 travelers max</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[2, 3, 4].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setMaxParticipants(size)}
                  className={`py-2.5 rounded-xl border text-center transition-all font-semibold ${
                    maxParticipants === size
                      ? 'border-[#1A1918] bg-[#1A1918] text-white shadow-2xs'
                      : 'border-[#EAE7E2] bg-[#F9F8F6] text-[#6B6966] hover:bg-[#EAE7E2]/50'
                  }`}
                >
                  {size} People {size === 4 && '(Max)'}
                </button>
              ))}
            </div>
          </div>

          {/* Field 8: Safety Toggle (Female-Only) */}
          <div className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E2] flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1918]">
                <span>Make this a Female-Only Plan</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-semibold">
                  ♀ Protected
                </span>
              </div>
              <p className="text-[11px] text-[#6B6966] leading-relaxed">
                Only verified female-identifying travelers can see or request to join.
              </p>
            </div>

            {currentUser.gender === 'female' ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-female-only-plan"
                  type="checkbox"
                  checked={femaleOnly}
                  onChange={(e) => setFemaleOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#EAE7E2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
              </label>
            ) : (
              <span className="text-[10px] text-[#9C9892] font-semibold px-2 py-1 rounded-md bg-white border border-[#EAE7E2]">
                Disabled for male hosts
              </span>
            )}
          </div>

          {formError && (
            <div className="bg-[#FDF2F2] border border-[#F87171] rounded-2xl p-3.5 text-xs text-[#DC2626] font-medium">
              {formError}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="btn-publish-micro-plan"
              type="submit"
              className="w-full py-3.5 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E64A2A]/20 active:scale-[0.99] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
