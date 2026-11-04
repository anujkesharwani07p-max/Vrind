import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Printer, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Room, Booking } from '../types';
import { checkRoomDatabaseAvailability, saveBookingToDb, getCachedBookings } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { HOMESTAY_DETAILS } from '../data/initialData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoomId?: string;
  initialDates?: { checkIn: string; checkOut: string; guests: number };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  selectedRoomId,
  initialDates
}) => {
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

  const [roomId, setRoomId] = useState<string>(selectedRoomId || rooms[0]?.id || '');
  const [checkInDate, setCheckInDate] = useState<string>(initialDates?.checkIn || tomorrowStr);
  const [checkOutDate, setCheckOutDate] = useState<string>(initialDates?.checkOut || threeDaysStr);
  const [guestsCount, setGuestsCount] = useState<number>(initialDates?.guests || 2);
  
  // Guest Details
  const [guestName, setGuestName] = useState<string>(user?.displayName || '');
  const [guestEmail, setGuestEmail] = useState<string>(user?.email || '');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Availability State
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const [isAvailableInDb, setIsAvailableInDb] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');

  // Submitting State & Confirmation
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedRoomId) {
      setRoomId(selectedRoomId);
    } else if (rooms.length > 0 && !roomId) {
      setRoomId(rooms[0].id);
    }
    if (initialDates) {
      setCheckInDate(initialDates.checkIn);
      setCheckOutDate(initialDates.checkOut);
      setGuestsCount(initialDates.guests);
    }
  }, [selectedRoomId, initialDates, rooms]);

  const selectedRoom = rooms.find((r) => r.id === roomId) || rooms[0];

  // Calculate nights & price
  const calculateNights = () => {
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const roomPricePerNight = selectedRoom ? selectedRoom.pricePerNight : 5000;
  const subtotal = roomPricePerNight * nights;
  const taxesAndCess = Math.round(subtotal * 0.05); // 5% eco & tourism cess
  const totalPrice = subtotal + taxesAndCess;

  // Run database availability check whenever room or dates change
  useEffect(() => {
    let isCancelled = false;
    async function verifyDb() {
      if (!roomId || !checkInDate || !checkOutDate) return;
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        setIsAvailableInDb(false);
        setAvailabilityMessage('Check-out date must be after check-in date.');
        return;
      }

      setCheckingAvailability(true);
      setAvailabilityMessage('');

      const result = await checkRoomDatabaseAvailability(roomId, checkInDate, checkOutDate);
      if (!isCancelled) {
        setCheckingAvailability(false);
        setIsAvailableInDb(result.available);
        if (result.available) {
          setAvailabilityMessage('Room is verified available in the database for your dates!');
        } else {
          setAvailabilityMessage(result.conflictReason || 'Room is already booked for these dates.');
        }
      }
    }

    verifyDb();
    return () => {
      isCancelled = true;
    };
  }, [roomId, checkInDate, checkOutDate]);

  if (!isOpen) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAvailableInDb) {
      setSubmitError('Cannot submit booking: Selected room is already reserved for these dates in the database.');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setSubmitError('Please complete your name, email, and contact phone number.');
      return;
    }

    try {
      setSubmitting(true);
      const newBooking = await saveBookingToDb({
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        checkInDate,
        checkOutDate,
        guestsCount,
        totalNights: nights,
        totalPrice,
        specialRequests: specialRequests.trim() || undefined,
        userId: user?.uid || undefined
      });

      setConfirmedBooking(newBooking);
    } catch (err: unknown) {
      console.error('Booking submission error:', err);
      // Check if safely captured in local database
      const cached = getCachedBookings();
      const match = cached.find(
        (b) => b.roomId === selectedRoom.id && b.guestEmail === guestEmail.trim()
      );
      if (match) {
        setConfirmedBooking(match);
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Please check your information and try again.';
        setSubmitError(`Failed to record reservation: ${errorMsg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={() => {
          if (!submitting) onClose();
        }} 
      />

      <div className="relative w-full max-w-2xl bg-[#0c1a14] border border-[#234335] rounded-3xl shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0e241b] to-[#122e23] border-b border-[#234335] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/40">
              <Calendar className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-[#fcfaf6]">
                {confirmedBooking ? 'Reservation Confirmed' : 'Reserve Your Stay'}
              </h3>
              <p className="text-xs text-[#a89d89]">Vrind Homestay – Himalayan Retreat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#a89d89] hover:text-white hover:bg-[#08120e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation State View */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="font-cinzel text-2xl font-bold text-[#fcfaf6] mb-2">
                Booking Request Successfully Placed!
              </h4>
              <p className="text-sm text-[#b8ab94] max-w-md mx-auto">
                Your reservation has been saved in our verified database. Our retreat team will contact you directly on WhatsApp/Phone.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#08120e] border border-[#214333] rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b382a]">
                <span className="text-[#a89d89] uppercase tracking-wider font-semibold">Booking Reference</span>
                <span className="font-mono text-sm font-bold text-[#d4af37] bg-[#11291f] px-2.5 py-1 rounded border border-[#d4af37]/30">
                  {confirmedBooking.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-[#a89d89] block">Room Reserved</span>
                  <span className="font-semibold text-[#f4efe6]">{confirmedBooking.roomName}</span>
                </div>
                <div>
                  <span className="text-[#a89d89] block">Guest Name</span>
                  <span className="font-semibold text-[#f4efe6]">{confirmedBooking.guestName}</span>
                </div>
                <div>
                  <span className="text-[#a89d89] block">Check-In</span>
                  <span className="font-semibold text-[#f4efe6]">{confirmedBooking.checkInDate} (From 1:00 PM)</span>
                </div>
                <div>
                  <span className="text-[#a89d89] block">Check-Out</span>
                  <span className="font-semibold text-[#f4efe6]">{confirmedBooking.checkOutDate} (Until 11:00 AM)</span>
                </div>
                <div>
                  <span className="text-[#a89d89] block">Total Duration</span>
                  <span className="font-semibold text-[#f4efe6]">{confirmedBooking.totalNights} Nights • {confirmedBooking.guestsCount} Guests</span>
                </div>
                <div>
                  <span className="text-[#a89d89] block">Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-400 uppercase tracking-wide">
                    <Clock className="w-3 h-3" />
                    <span>{confirmedBooking.status}</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b382a] flex items-center justify-between">
                <span className="text-sm font-medium text-[#ebe3d5]">Total Estimated Amount</span>
                <span className="font-cinzel text-lg font-bold text-[#d4af37]">
                  ₹{confirmedBooking.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${HOMESTAY_DETAILS.whatsapp}?text=Hi%20Vrind%20Homestay%2C%20I%20have%20submitted%20booking%20${confirmedBooking.id}%20for%20${encodeURIComponent(confirmedBooking.roomName)}%20from%20${confirmedBooking.checkInDate}%20to%20${confirmedBooking.checkOutDate}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Notify Host on WhatsApp</span>
              </a>

              <button
                onClick={handlePrint}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-[#234335] text-[#dfd4c0] hover:bg-[#12281e] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  onClose();
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6">
            
            {/* Room Picker */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-2">
                1. Select Room / Suite
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-4 py-3 text-sm text-[#fcfaf6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} — ₹{room.pricePerNight.toLocaleString('en-IN')}/night (Up to {room.capacityGuests} Guests)
                  </option>
                ))}
              </select>
            </div>

            {/* Dates & Guests */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-2">
                2. Stay Dates & Party Size
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="block text-[10px] uppercase text-[#a89d89] mb-1 font-semibold">Check-In</span>
                  <input
                    type="date"
                    value={checkInDate}
                    min={todayStr}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <span className="block text-[10px] uppercase text-[#a89d89] mb-1 font-semibold">Check-Out</span>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate || todayStr}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <span className="block text-[10px] uppercase text-[#a89d89] mb-1 font-semibold">Number of Guests</span>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                  >
                    {[...Array(selectedRoom?.capacityGuests || 4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Database Availability Status Indicator */}
              <div className="mt-3 p-3 rounded-xl bg-[#08120e] border border-[#1b382a] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {checkingAvailability ? (
                    <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                  ) : isAvailableInDb ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className={isAvailableInDb ? 'text-emerald-300' : 'text-amber-300'}>
                    {checkingAvailability ? 'Checking database availability...' : availabilityMessage}
                  </span>
                </div>
                <div className="text-[10px] text-[#a89d89] shrink-0">
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-2">
                3. Primary Guest Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number *"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Arrival time or special request"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a] space-y-2 text-xs">
              <div className="flex justify-between text-[#a89d89]">
                <span>₹{roomPricePerNight.toLocaleString('en-IN')} × {nights} nights</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#a89d89]">
                <span>Himalayan Eco Cess & Tourism Tax (5%)</span>
                <span>₹{taxesAndCess.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#a89d89]">
                <span>Farm-to-Table Breakfast & Bonfire</span>
                <span className="text-emerald-400">Included Complimentary</span>
              </div>
              <div className="pt-2 border-t border-[#1b382a] flex justify-between items-baseline font-semibold">
                <span className="text-[#fcfaf6] text-sm">Estimated Total Amount</span>
                <span className="font-cinzel text-lg text-[#d4af37]">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-[#a89d89]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Guaranteed Zero Spam</span>
              </div>

              <button
                type="submit"
                disabled={submitting || checkingAvailability || isAvailableInDb === false}
                className={`px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                  submitting || isAvailableInDb === false
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] hover:brightness-110 shadow-[#c59b3f]/25'
                }`}
              >
                {submitting ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <span>Confirm Booking Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
