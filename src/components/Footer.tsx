import React from 'react';
import { 
  Mountain, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  MessageSquare,
  Shield,
  Instagram,
  Facebook,
  Compass,
  ArrowUp
} from 'lucide-react';
import { HOMESTAY_DETAILS } from '../data/initialData';
import { HomestayDetails } from '../types';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  details?: HomestayDetails;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAdmin, details = HOMESTAY_DETAILS }) => {
  const info = details || HOMESTAY_DETAILS;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050d09] border-t border-[#18392c] text-[#dfd4c0] pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#132c21]">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/vrind_logo_white.png"
                alt="Vrind Homestay Emblem"
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              />
              <div className="flex flex-col">
                <span className="font-cinzel text-xl font-bold tracking-wider text-[#fcfaf6]">
                  VRIND
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-medium -mt-1">
                  Himalayan Retreat
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a89d89] leading-relaxed">
              A conscious Kathkuni Himalayan homestay at 7,200 ft elevation. 
              Dedicated to preserving Himachali stone-and-timber architectural heritage, 
              organic farming, and offering mindful mountain tranquility.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0f241a] border border-[#214333] flex items-center justify-center text-[#dfd4c0] hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0f241a] border border-[#214333] flex items-center justify-center text-[#dfd4c0] hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
                title="Follow on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0f241a] border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-950 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-[#fcfaf6] uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-[#d4af37] transition-colors">Our Himalayan Story</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#d4af37] transition-colors">Suites & Cottages</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#d4af37] transition-colors">Retreat Photo Gallery</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#d4af37] transition-colors">Guest Testimonials</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#d4af37] transition-colors">Travel & Directions</a>
              </li>
            </ul>
          </div>

          {/* Accommodations */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-[#fcfaf6] uppercase tracking-wider">
              Rooms & Cottages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#rooms" className="hover:text-[#d4af37] transition-colors">Cedar Valley Panorama Suite</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#d4af37] transition-colors">Pinecone Orchard Cottage</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#d4af37] transition-colors">Himalayan Stargazer Attic</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#d4af37] transition-colors">Kailash View Family Haven</a>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-[#c59b3f] text-[#08120e] font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
              >
                Check Live Availability
              </button>
            </div>
          </div>

          {/* Direct Contact Summary */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-cinzel text-sm font-bold text-[#fcfaf6] uppercase tracking-wider">
              Connect Directly
            </h4>
            <div className="space-y-2.5 text-[#b8ab94]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{info.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${info.phone}`} className="hover:text-white transition-colors">
                  {info.phoneFormatted || info.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`mailto:${info.email}`} className="hover:text-white transition-colors">
                  {info.email}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-[11px] text-[#a89d89] hover:text-[#d4af37] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Staff & Management Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d705c]">
          <p>© {new Date().getFullYear()} Vrind Homestay – Himalayan Retreat. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>Handcrafted with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>in Himachal Pradesh</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#0f241a] border border-[#1b382a] text-[#dfd4c0] hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
