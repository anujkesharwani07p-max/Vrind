import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Maximize2, 
  Eye, 
  Bed, 
  Check, 
  Calendar, 
  MessageSquare, 
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Room } from '../types';
import { HOMESTAY_DETAILS } from '../data/initialData';

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
  onBook: (roomId: string) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, onClose, onBook }) => {
  if (!room) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-4xl bg-[#0c1a14] border border-[#234335] rounded-3xl shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#08120e]/80 text-[#dfd4c0] hover:text-white hover:bg-[#08120e] transition-colors border border-[#234335]"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Gallery Hero */}
        <div className="relative h-72 sm:h-96 w-full bg-black">
          <img
            src={room.images[activeImageIndex] || room.images[0]}
            alt={room.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a14] via-transparent to-black/30" />

          {/* Carousel Arrows if multiple images */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#08120e]/70 text-white hover:bg-[#08120e] transition-colors border border-[#234335]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#08120e]/70 text-white hover:bg-[#08120e] transition-colors border border-[#234335]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          {room.images.length > 1 && (
            <div className="absolute bottom-4 left-6 right-6 flex items-center gap-2 overflow-x-auto pb-1">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${
              room.isAvailable ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'
            }`}>
              {room.isAvailable ? 'Available for Booking' : 'Limited Dates / Inquire'}
            </span>
            {room.rating && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0d2319]/80 text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#d4af37]" />
                <span>{room.rating.toFixed(2)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-[#1c3a2c]">
            <div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fcfaf6] mb-1">
                {room.name}
              </h2>
              {room.tagline && (
                <p className="text-sm text-[#d4af37] font-medium">{room.tagline}</p>
              )}
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-[#a89d89] uppercase tracking-wider block">Rate per night</span>
              <div className="flex items-baseline sm:justify-end gap-1">
                <span className="text-3xl font-bold text-[#fcfaf6] font-cinzel">
                  ₹{room.pricePerNight.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#a89d89] font-normal">/ night</span>
              </div>
              <span className="text-[11px] text-emerald-400">Includes Himalayan Farm Breakfast</span>
            </div>
          </div>

          {/* Room Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#d4af37]" />
              <div>
                <p className="text-[10px] uppercase text-[#a89d89] tracking-wider">Capacity</p>
                <p className="text-xs font-semibold text-[#f4efe6]">Up to {room.capacityGuests} Guests</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Bed className="w-4 h-4 text-[#d4af37]" />
              <div>
                <p className="text-[10px] uppercase text-[#a89d89] tracking-wider">Bed Layout</p>
                <p className="text-xs font-semibold text-[#f4efe6] truncate">{room.bedType || 'Plush King Bed'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-4 h-4 text-[#d4af37]" />
              <div>
                <p className="text-[10px] uppercase text-[#a89d89] tracking-wider">Area</p>
                <p className="text-xs font-semibold text-[#f4efe6]">{room.sizeSqFt || 450} Sq. Ft.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#d4af37]" />
              <div>
                <p className="text-[10px] uppercase text-[#a89d89] tracking-wider">View</p>
                <p className="text-xs font-semibold text-[#f4efe6] truncate">{room.view || 'Snow Peaks & Valley'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2">Description</h4>
            <p className="text-sm text-[#dfd4c0] leading-relaxed font-light">
              {room.description}
            </p>
          </div>

          {/* Facilities & Amenities */}
          <div className="mb-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">Room Amenities & Facilities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-[#ebe3d5]">
                  <div className="w-4 h-4 rounded-full bg-[#1b382a] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#d4af37]" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#1c3a2c]">
            <a
              href={`https://wa.me/${HOMESTAY_DETAILS.whatsapp}?text=Hi%20Vrind%20Homestay%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(room.name)}.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask via WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onBook(room.id);
              }}
              disabled={!room.isAvailable}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                room.isAvailable
                  ? 'bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] hover:brightness-110 shadow-[#c59b3f]/25'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{room.isAvailable ? 'Book This Room Now' : 'Currently Unavailable'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
