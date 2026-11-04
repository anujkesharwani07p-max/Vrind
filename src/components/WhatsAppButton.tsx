import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { HOMESTAY_DETAILS } from '../data/initialData';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#091510] text-[#f4efe6] border border-emerald-500/40 text-xs py-2 px-3.5 rounded-2xl shadow-xl shadow-black/60 animate-in fade-in slide-in-from-right-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Need help? Chat with Host</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#a89d89] hover:text-white ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${HOMESTAY_DETAILS.whatsapp}?text=Hi%20Vrind%20Homestay%2C%20I%20am%20planning%20a%20stay%20and%20would%20like%20to%20enquire%20about%20room%20availability.`}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-emerald-500/20 group"
        aria-label="Direct WhatsApp Chat with Vrind Host"
      >
        <MessageSquare className="w-7 h-7 fill-white group-hover:rotate-6 transition-transform" />
      </a>
    </div>
  );
};
