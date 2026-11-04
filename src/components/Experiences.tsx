import React from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  MessageSquare,
  Trees,
  Check
} from 'lucide-react';
import { EXPERIENCES, HOMESTAY_DETAILS } from '../data/initialData';

export const Experiences: React.FC = () => {
  return (
    <section id="experiences" className="py-24 bg-[#091510] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-3">
            <Compass className="w-4 h-4 text-[#d4af37]" />
            <span>Curated Mountain Adventures</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fcfaf6] mb-4">
            Experiences & Himalayan Wonders
          </h2>
          <p className="text-[#ebe3d5] text-sm sm:text-base font-light leading-relaxed">
            Beyond our wooden verandas lie ancient deodar trails, thundering waterfalls, 
            local pahadi culinary secrets, and the clearest starry skies in northern India.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className="group bg-[#0c1a14] border border-[#1e3b2e] hover:border-[#c59b3f]/50 rounded-3xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Cover */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a14] via-transparent to-black/30" />

                  {/* Highlights Floating Pill */}
                  <div className="absolute top-4 left-4 bg-[#08120e]/85 backdrop-blur-md border border-[#2d5743] px-3 py-1 rounded-full text-[11px] text-[#d4af37] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{exp.highlight}</span>
                  </div>

                  {/* Badges on bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 bg-[#08120e]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#214333]">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{exp.duration}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#11291f]/90 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      {exp.difficulty} Pace
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-7">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fcfaf6] group-hover:text-[#d4af37] transition-colors mb-1">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-medium mb-3">{exp.subtitle}</p>

                  <p className="text-xs sm:text-sm text-[#b8ab94] leading-relaxed mb-6 font-light">
                    {exp.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {exp.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-[11px] bg-[#08120e] text-[#dfd4c0] border border-[#1b382a]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-6 pt-2 border-t border-[#18392c] flex items-center justify-between">
                <span className="text-xs text-[#a89d89]">Available for In-House Guests</span>
                <a
                  href={`https://wa.me/${HOMESTAY_DETAILS.whatsapp}?text=Hi%20Vrind%20Homestay%2C%20I%20would%20love%20to%20plan%20the%20${encodeURIComponent(exp.title)}%20experience%20during%20my%20stay.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#11291f] hover:bg-[#183a2d] border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-medium transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Arrange with Host</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Nearby Attractions Callout Box */}
        <div className="mt-16 bg-[#0c1a14] border border-[#214333] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Trees className="w-6 h-6 text-[#d4af37]" />
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fcfaf6]">
              Iconic Nearby Landmarks & Distances
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
              <span className="text-[#d4af37] font-semibold block">Old Manali Village & Manu Temple</span>
              <p className="text-[#a89d89] mt-1">15 mins (2.4 km) • Heritage wood carvings & cafes</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
              <span className="text-[#d4af37] font-semibold block">Jogini Waterfalls & Vashisht Springs</span>
              <p className="text-[#a89d89] mt-1">25 mins (5.8 km) • Natural sulfur hot water springs</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
              <span className="text-[#d4af37] font-semibold block">Solang Valley & Atal Tunnel</span>
              <p className="text-[#a89d89] mt-1">40 mins (18 km) • Snow activities & gateway to Lahaul</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
              <span className="text-[#d4af37] font-semibold block">Naggar Castle & Roerich Art Gallery</span>
              <p className="text-[#a89d89] mt-1">35 mins (19 km) • Ancient Kullu kings fortress</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
