import React, { useState } from 'react';
import { 
  Users, 
  Bed, 
  Maximize2, 
  Eye, 
  ArrowRight, 
  Check, 
  Star, 
  Sparkles,
  SlidersHorizontal,
  MessageSquare
} from 'lucide-react';
import { Room } from '../types';
import { HOMESTAY_DETAILS } from '../data/initialData';

interface RoomsProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (roomId: string) => void;
}

export const Rooms: React.FC<RoomsProps> = ({ rooms, onSelectRoom, onBookRoom }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRooms = filterType === 'all' 
    ? rooms 
    : rooms.filter((r) => r.roomType === filterType);

  const filterOptions = [
    { label: 'All Accommodations', value: 'all' },
    { label: 'Panoramic Suites', value: 'deluxe_suite' },
    { label: 'Orchard Cottages', value: 'cedar_cottage' },
    { label: 'Stargazer Attics', value: 'attic_room' },
    { label: 'Family Havens', value: 'valley_villa' }
  ];

  return (
    <section id="rooms" className="py-24 bg-[#091510] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Rooms & Accommodation</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fcfaf6] mb-4">
            Handcrafted Himalayan Sanctuaries
          </h2>
          <p className="text-[#ebe3d5] text-sm sm:text-base font-light leading-relaxed">
            Every room at Vrind Homestay is an architectural ode to local Kathkuni craftsmanship,
            featuring aromatic deodar cedar woodwork, plush bedding, private balconies, and
            unobstructed mountain valley vistas.
          </p>
        </div>

        {/* Room Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                filterType === opt.value
                  ? 'bg-[#c59b3f] text-[#08120e] shadow-lg shadow-[#c59b3f]/25'
                  : 'bg-[#10251c] text-[#dfd4c0] hover:bg-[#163326] border border-[#214333]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group bg-[#0c1a14] border border-[#1e3b2e] hover:border-[#c59b3f]/50 rounded-3xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a14] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {room.featured && (
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#d4af37] text-[#08120e] shadow-md">
                        Featured Sanctuary
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${
                      room.isAvailable
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950/80 text-red-300 border border-red-500/40'
                    }`}>
                      {room.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {room.rating && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#08120e]/80 backdrop-blur-md border border-[#2d5743] text-xs font-bold text-[#d4af37] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#d4af37]" />
                      <span>{room.rating.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Room Price Overlay in Corner */}
                  <div className="absolute bottom-4 right-4 bg-[#08120e]/90 backdrop-blur-md border border-[#2d5743] px-3.5 py-1.5 rounded-xl text-right">
                    <span className="text-[10px] text-[#a89d89] uppercase tracking-wider block">From</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-cinzel text-[#fcfaf6]">
                        ₹{room.pricePerNight.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#a89d89]">/night</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fcfaf6] group-hover:text-[#d4af37] transition-colors mb-1">
                    {room.name}
                  </h3>
                  {room.tagline && (
                    <p className="text-xs text-[#d4af37] font-medium mb-3">{room.tagline}</p>
                  )}

                  <p className="text-xs text-[#b8ab94] line-clamp-2 leading-relaxed mb-5">
                    {room.description}
                  </p>

                  {/* Quick Specs Pill Row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#08120e] border border-[#1b382a] text-xs text-[#dfd4c0] mb-5">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{room.capacityGuests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center border-x border-[#1b382a] px-1">
                      <Bed className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="truncate">{room.bedType?.split(' ')[0] || 'King'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="truncate">Mountain</span>
                    </div>
                  </div>

                  {/* Key Amenities Preview */}
                  <div className="space-y-1.5 mb-6">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#ebe3d5]">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                    {room.amenities.length > 3 && (
                      <p className="text-[11px] text-[#c59b3f] pl-5 font-medium">
                        +{room.amenities.length - 3} more luxury amenities
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-2 border-t border-[#18392c] flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectRoom(room)}
                  className="text-xs font-semibold text-[#dfd4c0] hover:text-[#d4af37] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${HOMESTAY_DETAILS.whatsapp}?text=Hi%20Vrind%20Homestay%2C%20is%20the%20${encodeURIComponent(room.name)}%20available%3F`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                    title="Enquire on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onBookRoom(room.id)}
                    disabled={!room.isAvailable}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-md ${
                      room.isAvailable
                        ? 'bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] hover:brightness-110 shadow-[#c59b3f]/20'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {room.isAvailable ? 'Book Room' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
