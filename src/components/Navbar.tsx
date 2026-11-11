import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Menu, 
  X, 
  Phone, 
  Calendar, 
  Shield, 
  MessageSquare,
  Sparkles,
  Mountain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HOMESTAY_DETAILS } from '../data/initialData';
import { HomestayDetails } from '../types';

interface NavbarProps {
  onOpenBooking: (roomId?: string) => void;
  onOpenAdmin: () => void;
  details?: HomestayDetails;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin, details = HOMESTAY_DETAILS }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  const phone = details?.phoneFormatted || details?.phone || HOMESTAY_DETAILS.phone;
  const rawPhone = details?.phone || HOMESTAY_DETAILS.phone;
  const whatsapp = details?.whatsapp || HOMESTAY_DETAILS.whatsapp;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Rooms & Suites', href: '#rooms' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#091510]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#213f32]'
            : 'bg-gradient-to-b from-[#08120e]/90 via-[#08120e]/50 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo - Transparent Emblem in Left Upper Corner */}
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none" aria-label="Vrind Homestay – Himalayan Retreat">
              <div className="relative flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/vrind_logo_white.png"
                  alt="Vrind Homestay Emblem"
                  className="h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-[#fcfaf6] group-hover:text-[#d4af37] transition-colors leading-none">
                  VRIND
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-medium mt-1">
                  Himalayan Retreat
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-[#dfd4c0] hover:text-[#d4af37] transition-colors tracking-wide relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#d4af37] hover:after:w-full after:transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${rawPhone}`}
                className="flex items-center gap-1.5 text-xs text-[#dfd4c0] hover:text-[#d4af37] transition-colors px-2 py-1"
                title="Call Host Directly"
              >
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{phone}</span>
              </a>

              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#0b1712] font-semibold text-sm shadow-lg shadow-[#c59b3f]/25 hover:shadow-[#c59b3f]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Stay</span>
              </button>

              {/* Admin Button */}
              <button
                onClick={onOpenAdmin}
                className="p-2 rounded-full border border-[#234335] text-[#d4af37] hover:bg-[#163326] transition-colors relative group"
                title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Portal Login'}
              >
                <Shield className="w-4 h-4" />
                {isAdmin && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0b1712] animate-pulse" />
                )}
                <span className="sr-only">Admin Portal</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => onOpenBooking()}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#0b1712] font-semibold text-xs shadow-md"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#dfd4c0] hover:text-white rounded-lg focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#091510]/98 border-b border-[#213f32] px-4 pt-3 pb-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#dfd4c0] hover:text-[#d4af37] hover:bg-[#12281e] rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-[#1c382b] flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#0b1712] font-semibold text-sm shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve a Room</span>
                </button>
                <div className="flex items-center justify-between px-2 pt-1">
                  <a
                    href={`https://wa.me/${whatsapp}?text=Hi%20Vrind%20Homestay%2C%20I%20would%20like%20to%20enquire%20about%20staying%20with%20you.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-emerald-400"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Host</span>
                  </a>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#d4af37]"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{isAdmin ? 'Admin (Signed In)' : 'Admin Portal'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
