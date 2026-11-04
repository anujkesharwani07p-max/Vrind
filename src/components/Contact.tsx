import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Navigation, 
  Plane, 
  Train, 
  Car,
  Clock,
  Sparkles
} from 'lucide-react';
import { HOMESTAY_DETAILS } from '../data/initialData';
import { submitEnquiryToDb } from '../services/dbService';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Message).');
      return;
    }

    try {
      setSubmitting(true);
      await submitEnquiryToDb({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim()
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error('Enquiry submission error:', err);
      setErrorMsg('Failed to transmit message. Please contact us directly via WhatsApp or Phone.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#091510] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-3">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>Connect & Reach Vrind</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fcfaf6] mb-4">
            We Welcome You to the Mountains
          </h2>
          <p className="text-[#ebe3d5] text-sm sm:text-base font-light leading-relaxed">
            Have questions about seasonal snowfalls, customized family meals, or transport assistance? 
            Reach out via our enquiry form, WhatsApp, or direct phone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Left Column: Direct Contact Details & How to Reach */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-[#0c1a14] border border-[#1e3b2e] rounded-3xl p-6 sm:p-7 shadow-xl">
              <h3 className="font-cinzel text-xl font-bold text-[#fcfaf6] mb-6">
                Retreat Contacts
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#132c21] flex items-center justify-center shrink-0 border border-[#234335]">
                    <Phone className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-[#a89d89] text-[11px] block">Direct Reservations & Front Desk</span>
                    <a
                      href={`tel:${HOMESTAY_DETAILS.phone}`}
                      className="font-semibold text-[#f4efe6] hover:text-[#d4af37] transition-colors"
                    >
                      {HOMESTAY_DETAILS.phoneFormatted}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[#a89d89] text-[11px] block">Instant WhatsApp Chat</span>
                    <a
                      href={`https://wa.me/${HOMESTAY_DETAILS.whatsapp}?text=Hi%20Vrind%20Homestay%2C%20I%20have%20an%20enquiry%20regarding%20a%20booking.`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Click to Chat ({HOMESTAY_DETAILS.phoneFormatted})
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#132c21] flex items-center justify-center shrink-0 border border-[#234335]">
                    <Mail className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-[#a89d89] text-[11px] block">Official Email</span>
                    <a
                      href={`mailto:${HOMESTAY_DETAILS.email}`}
                      className="font-semibold text-[#f4efe6] hover:text-[#d4af37] transition-colors"
                    >
                      {HOMESTAY_DETAILS.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#132c21] flex items-center justify-center shrink-0 border border-[#234335]">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-[#a89d89] text-[11px] block">Homestay Address</span>
                    <p className="font-medium text-[#f4efe6] leading-relaxed">
                      {HOMESTAY_DETAILS.address}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 pt-3 border-t border-[#18392c]">
                  <div className="w-10 h-10 rounded-2xl bg-[#132c21] flex items-center justify-center shrink-0 border border-[#234335]">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-[#a89d89] text-[11px] block">Standard Hospitality Hours</span>
                    <p className="text-xs text-[#dfd4c0]">
                      Check-In: <strong>{HOMESTAY_DETAILS.checkInTime}</strong> • Check-Out: <strong>{HOMESTAY_DETAILS.checkOutTime}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Guide Card */}
            <div className="bg-[#0c1a14] border border-[#1e3b2e] rounded-3xl p-6 shadow-xl space-y-3 text-xs">
              <h4 className="font-cinzel text-base font-bold text-[#fcfaf6] flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-[#d4af37]" />
                <span>How to Reach Vrind Homestay</span>
              </h4>

              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#f4efe6]">By Air:</strong> {HOMESTAY_DETAILS.nearestAirport}. Taxis and homestay private transfers available on request.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#f4efe6]">By Road:</strong> {HOMESTAY_DETAILS.drivingDistance}. Paved tarmac road leads straight to property with private guest parking.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#f4efe6]">By Train:</strong> {HOMESTAY_DETAILS.nearestRailway}. Express Volvo buses run daily to Manali.
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Enquiry Form & Embedded Styled Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Enquiry Form */}
            <div className="bg-[#0c1a14] border border-[#1e3b2e] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1b382a]">
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fcfaf6]">
                    Send a Direct Enquiry
                  </h3>
                  <p className="text-xs text-[#a89d89] mt-0.5">
                    We usually respond within 1 to 2 hours with availability & answers.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#d4af37]">
                  <Sparkles className="w-4 h-4" />
                  <span>Personalized Itineraries</span>
                </div>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="font-cinzel text-xl font-bold text-[#fcfaf6]">
                    Enquiry Received!
                  </h4>
                  <p className="text-xs text-[#b8ab94] max-w-md mx-auto leading-relaxed">
                    Thank you for writing to Vrind Homestay. Your enquiry has been registered in our database. 
                    Our host will reach out to you directly via email or WhatsApp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#11291f] text-[#d4af37] text-xs font-semibold hover:bg-[#183a2d] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#a89d89] mb-1 font-semibold uppercase text-[10px]">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-4 py-3 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a89d89] mb-1 font-semibold uppercase text-[10px]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-4 py-3 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#a89d89] mb-1 font-semibold uppercase text-[10px]">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-4 py-3 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a89d89] mb-1 font-semibold uppercase text-[10px]">
                        Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-4 py-3 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Long Stay / Workation">Long Stay / Workation Package</option>
                        <option value="Full Property Booking">Entire Homestay Booking</option>
                        <option value="Trek & Guide Assistance">Trekking & Outdoor Guide</option>
                        <option value="Special Dietary Food Request">Organic Food Customization</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#a89d89] mb-1 font-semibold uppercase text-[10px]">
                      Message / Dates of Interest *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please let us know your planned stay dates, number of guests, or any specific questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-4 py-3 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-500/30">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#a89d89]">Database Secured • Verified Host Response</span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                    >
                      {submitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Visual Location Map Representation */}
            <div className="bg-[#0c1a14] border border-[#1e3b2e] rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0e241b] border-b border-[#1b382a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-semibold text-[#fcfaf6]">Retreat Coordinates & Location</span>
                </div>
                <span className="text-[10px] text-[#a89d89]">32.2885° N, 77.1682° E</span>
              </div>
              
              {/* Styled Interactive Map Embed */}
              <div className="relative h-60 w-full bg-[#08120e]">
                <iframe
                  title="Google Maps Location for Vrind Homestay, Shanag Road, Burwa, Manali"
                  src="https://maps.google.com/maps?q=Shanag+Road,+Burwa,+Manali,+Himachal+Pradesh+175103&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter contrast-125 opacity-85 hover:opacity-100 transition-opacity"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 left-4 bg-[#08120e]/90 backdrop-blur-md border border-[#d4af37]/50 rounded-xl p-2.5 text-xs text-[#fcfaf6] shadow-lg pointer-events-none">
                  <p className="font-bold text-[#d4af37]">Vrind Homestay</p>
                  <p className="text-[10px] text-[#ebe3d5]">Shanag Road, Burwa, Manali 175103</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
