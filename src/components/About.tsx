import React from 'react';
import { 
  Heart, 
  Mountain, 
  Leaf, 
  Flame, 
  Compass, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { HOMESTAY_DETAILS, INITIAL_ABOUT } from '../data/initialData';
import { AboutContent, HomestayDetails } from '../types';

interface AboutProps {
  content?: AboutContent;
  homestayDetails?: HomestayDetails;
}

export const About: React.FC<AboutProps> = ({
  content = INITIAL_ABOUT,
  homestayDetails = HOMESTAY_DETAILS
}) => {
  const mainImage = content.mainImage || INITIAL_ABOUT.mainImage;
  const secondaryImage = content.secondaryImage || INITIAL_ABOUT.secondaryImage;
  const title = content.title || INITIAL_ABOUT.title;
  const subtitle = content.subtitle || INITIAL_ABOUT.subtitle;
  const storyP1 = content.storyP1 || INITIAL_ABOUT.storyP1;
  const storyP2 = content.storyP2 || INITIAL_ABOUT.storyP2;
  const badgeText = content.badgeText || INITIAL_ABOUT.badgeText;
  const elevation = content.elevationBadge || homestayDetails.altitude || HOMESTAY_DETAILS.altitude;

  return (
    <section id="about" className="py-24 bg-[#08120e] relative overflow-hidden">
      {/* Decorative Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c59b3f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#18392c]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Storytelling Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-3xl overflow-hidden border border-[#234335] shadow-2xl shadow-black/80 aspect-[4/5]">
                <img
                  src={mainImage}
                  alt="Vrind Homestay traditional timber and stone architecture surrounded by apple trees"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08120e]/80 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#091510]/90 backdrop-blur-md border border-[#2d5743]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c59b3f]/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#a89d89] uppercase tracking-wider">Ancient Heritage</p>
                      <p className="text-sm font-semibold text-[#fcfaf6]">{badgeText}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Overlapping Card */}
              <div className="hidden sm:block absolute -top-6 -right-6 w-48 rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl shadow-black/80 aspect-square">
                <img
                  src={secondaryImage}
                  alt="Fresh organic breakfast served on wooden deck"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#08120e]/30" />
                <span className="absolute bottom-2 left-2 right-2 text-[10px] text-center bg-[#091510]/80 backdrop-blur px-2 py-1 rounded text-[#e8c872] font-medium">
                  Farm-to-Table Meals
                </span>
              </div>

              {/* Elevation Stamp */}
              <div className="absolute -bottom-6 -left-6 bg-[#0f241a] border border-[#d4af37]/60 rounded-2xl p-4 shadow-xl backdrop-blur-md">
                <p className="text-2xl font-bold font-cinzel text-[#d4af37]">{elevation}</p>
                <p className="text-[11px] text-[#ebe3d5] tracking-wide">Pristine Himalayan Altitude</p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-3">
              <Mountain className="w-4 h-4 text-[#d4af37]" />
              <span>{subtitle}</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fcfaf6] leading-tight mb-6">
              {title}
            </h2>

            <p className="text-base text-[#dfd4c0] font-light leading-relaxed mb-6">
              {storyP1}
            </p>

            <p className="text-sm text-[#b8ab94] leading-relaxed mb-8">
              {storyP2}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#0e2118] border border-[#1e3b2e] flex items-start gap-3">
                <Leaf className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#fcfaf6]">100% Organic Terrace Garden</h4>
                  <p className="text-xs text-[#a89d89] mt-1">Seasonal vegetables, wild mountain greens, and fresh orchard apples.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0e2118] border border-[#1e3b2e] flex items-start gap-3">
                <Flame className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#fcfaf6]">Evening Fireplace & Bukhari</h4>
                  <p className="text-xs text-[#a89d89] mt-1">Hand-split pine logs, starry sky conversations, and spiced mountain tea.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0e2118] border border-[#1e3b2e] flex items-start gap-3">
                <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#fcfaf6]">Authentic Pahadi Hospitality</h4>
                  <p className="text-xs text-[#a89d89] mt-1">Host family living on-premises to make you feel like cherished family.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0e2118] border border-[#1e3b2e] flex items-start gap-3">
                <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#fcfaf6]">Direct Forest Trail Access</h4>
                  <p className="text-xs text-[#a89d89] mt-1">Step straight out of your room into private deodar pine walking paths.</p>
                </div>
              </div>
            </div>

            {/* Quick Checklist */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#dfd4c0] pt-2 border-t border-[#18392c]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Pet Friendly by Prior Request</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Fiber Optic Wi-Fi for Workation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Free Onsite Parking</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
