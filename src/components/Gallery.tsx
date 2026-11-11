import React, { useState } from 'react';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Sparkles
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/initialData';
import { GalleryItem } from '../types';

interface GalleryProps {
  items?: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ items = GALLERY_ITEMS }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryList = items && items.length > 0 ? items : GALLERY_ITEMS;

  const categories = [
    { label: 'All Photos', value: 'all' },
    { label: 'Mountain Peaks', value: 'mountains' },
    { label: 'Cozy Rooms', value: 'rooms' },
    { label: 'Kathkuni Property', value: 'property' },
    { label: 'Himalayan Nature', value: 'nature' },
    { label: 'Dining & Bonfire', value: 'dining' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryList
    : galleryList.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#08120e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-3">
            <Camera className="w-4 h-4 text-[#d4af37]" />
            <span>Retreat Gallery</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fcfaf6] mb-4">
            Glimpses of Himalayan Splendor
          </h2>
          <p className="text-[#ebe3d5] text-sm sm:text-base font-light leading-relaxed">
            Step through our visual story — from morning golden mist hovering above ancient pines 
            to handcrafted deodar wood suites and starlit campfire gatherings.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-[#c59b3f] text-[#08120e] shadow-lg shadow-[#c59b3f]/25'
                  : 'bg-[#10251c] text-[#dfd4c0] hover:bg-[#163326] border border-[#214333]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-Style Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-2xl border border-[#1e3b2e] cursor-pointer bg-black/40 ${
                index % 3 === 0 ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-square'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08120e]/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Hover Overlay Details */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                  {item.category}
                </span>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#fcfaf6] truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-[#b8ab94] line-clamp-1 mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              {/* Expand Icon Badge */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-[#08120e]/80 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity border border-[#234335]">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 rounded-full bg-[#11291f]/80 text-white hover:bg-[#18392c] transition-colors border border-[#234335] z-50"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Photo */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#11291f]/80 text-white hover:bg-[#18392c] transition-colors border border-[#234335] z-50"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Current Photo View */}
            <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-[#214333]"
              />
              <div className="mt-4 text-center">
                <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fcfaf6]">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#b8ab94] mt-1">
                  {filteredItems[lightboxIndex].subtitle}
                </p>
                <span className="text-[10px] text-[#7d705c] mt-2 block">
                  Photo {lightboxIndex + 1} of {filteredItems.length}
                </span>
              </div>
            </div>

            {/* Next Photo */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#11291f]/80 text-white hover:bg-[#18392c] transition-colors border border-[#234335] z-50"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
