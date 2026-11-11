import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  MessageSquare,
  Search
} from 'lucide-react';
import { HOMESTAY_DETAILS, INITIAL_HERO } from '../data/initialData';
import { HeroContent, HomestayDetails } from '../types';

interface HeroProps {
  onOpenBooking: (roomId?: string, defaultDates?: { checkIn: string; checkOut: string; guests: number }) => void;
  content?: HeroContent;
  homestayDetails?: HomestayDetails;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, content = INITIAL_HERO, homestayDetails = HOMESTAY_DETAILS }) => {
  const heroBadge = content.badge || INITIAL_HERO.badge;
  const heroHeadline = content.headline || INITIAL_HERO.headline;
  const heroSubtitle = content.subtitle || INITIAL_HERO.subtitle;
  const heroImage = content.heroImage || INITIAL_HERO.heroImage;
  const whatsappNumber = homestayDetails.whatsapp || HOMESTAY_DETAILS.whatsapp;

  // Default dates: tomorrow to +3 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutDate = new Date(tomorrow);
  checkoutDate.setDate(checkoutDate.getDate() + 3);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(checkoutDate.toISOString().split('T')[0]);
  const [guests, setGuests] = useState(2);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(undefined, { checkIn, checkOut, guests });
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Mountain Visual with Dramatic Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Majestic Himalayan peaks and pine valleys at sunrise"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        {/* Layered Gradient for Cinematic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08120e] via-[#091510]/70 to-[#08120e]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,18,14,0.7)_100%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11291f]/80 border border-[#d4af37]/40 text-[#f4efe6] text-xs uppercase tracking-[0.25em] font-medium mb-6 backdrop-blur-md shadow-lg shadow-black/40">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{heroBadge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#fcfaf6] max-w-4xl leading-[1.15] mb-6 drop-shadow-md">
          {heroHeadline}
        </h1>

        {/* Descriptive Tagline */}
        <p className="max-w-2xl text-base sm:text-lg text-[#ebe3d5] font-light leading-relaxed mb-10 drop-shadow">
          {heroSubtitle}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => onOpenBooking()}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] font-semibold text-base shadow-xl shadow-[#c59b3f]/30 hover:shadow-[#c59b3f]/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Book Your Stay</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#rooms"
            className="px-8 py-3.5 rounded-full bg-[#11291f]/80 hover:bg-[#18392c] border border-[#2d5743] text-[#f4efe6] font-medium text-base hover:border-[#d4af37]/50 backdrop-blur-md transition-all flex items-center gap-2"
          >
            <span>Explore Rooms</span>
            <Compass className="w-4 h-4 text-[#d4af37]" />
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Vrind%20Homestay%2C%20I%20would%20like%20to%20enquire%20about%20staying%20with%20you.`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-full bg-[#152e22]/70 hover:bg-[#1a382a] border border-emerald-500/30 text-emerald-300 font-medium text-sm backdrop-blur-md transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>

        {/* Floating Quick Availability Search Bar */}
        <div className="w-full max-w-4xl bg-[#0e2118]/90 backdrop-blur-xl border border-[#2c5340] rounded-2xl sm:rounded-full p-3 sm:p-2.5 shadow-2xl shadow-black/80">
          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            {/* Check-In */}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-[#091510]/80 rounded-xl sm:rounded-full border border-[#1e3b2e]">
              <CalendarIcon className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider text-[#a89d89] font-semibold">Check-In</label>
                <input
                  type="date"
                  value={checkIn}
                  min={today.toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#f4efe6] focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Check-Out */}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-[#091510]/80 rounded-xl sm:rounded-full border border-[#1e3b2e]">
              <CalendarIcon className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider text-[#a89d89] font-semibold">Check-Out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today.toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#f4efe6] focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-[#091510]/80 rounded-xl sm:rounded-full border border-[#1e3b2e]">
              <Users className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider text-[#a89d89] font-semibold">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-transparent text-xs text-[#f4efe6] focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-[#0e2118]">1 Guest (Solo Traveler)</option>
                  <option value={2} className="bg-[#0e2118]">2 Guests (Couple / Friends)</option>
                  <option value={3} className="bg-[#0e2118]">3 Guests</option>
                  <option value={4} className="bg-[#0e2118]">4 Guests (Family)</option>
                  <option value={5} className="bg-[#0e2118]">5 Guests</option>
                  <option value={6} className="bg-[#0e2118]">6 Guests (Full Haven)</option>
                </select>
              </div>
            </div>

            {/* Search Availability CTA */}
            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#c59b3f] to-[#e8c872] hover:brightness-110 text-[#091510] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Check Availability</span>
              </button>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#b8ab94]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Database-backed Live Availability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>100% Homegrown Himalayan Organic Meals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Direct WhatsApp & Call Confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
};
