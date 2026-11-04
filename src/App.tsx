import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { testFirestoreConnection } from './lib/firebase';
import { getRooms, getReviews } from './services/dbService';
import { Room, Review } from './types';
import { INITIAL_ROOMS, INITIAL_REVIEWS } from './data/initialData';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Rooms } from './components/Rooms';
import { Experiences } from './components/Experiences';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { RoomModal } from './components/RoomModal';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SEOJsonLd } from './components/SEOJsonLd';

export function VrindHomestayApp() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | undefined>(undefined);
  const [bookingInitialDates, setBookingInitialDates] = useState<
    { checkIn: string; checkOut: string; guests: number } | undefined
  >(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Initial data loading & connection test
  useEffect(() => {
    async function initApp() {
      try {
        // Test connection according to Firebase integration guidelines
        await testFirestoreConnection();
        
        // Fetch rooms and reviews from Firestore
        const [roomsFromDb, reviewsFromDb] = await Promise.all([
          getRooms(),
          getReviews()
        ]);

        if (roomsFromDb && roomsFromDb.length > 0) {
          setRooms(roomsFromDb);
        }
        if (reviewsFromDb && reviewsFromDb.length > 0) {
          setReviews(reviewsFromDb);
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      } finally {
        setLoading(false);
      }
    }

    initApp();
  }, []);

  const handleOpenBooking = (
    roomId?: string,
    defaultDates?: { checkIn: string; checkOut: string; guests: number }
  ) => {
    setBookingRoomId(roomId);
    setBookingInitialDates(defaultDates);
    setIsBookingModalOpen(true);
  };

  const handleRefreshRooms = async () => {
    try {
      const refreshed = await getRooms();
      setRooms(refreshed);
    } catch (err) {
      console.warn('Could not refresh rooms:', err);
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#08120e] text-[#f4efe6] font-sans antialiased selection:bg-[#c59b3f] selection:text-[#08120e]">
      {/* Schema.org SEO Structured Data */}
      <SEOJsonLd />

      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* 2. About Us */}
        <About />

        {/* 3. Rooms & Accommodation */}
        <Rooms
          rooms={rooms}
          onSelectRoom={(room) => setSelectedRoomForModal(room)}
          onBookRoom={(roomId) => handleOpenBooking(roomId)}
        />

        {/* 4. Curated Experiences */}
        <Experiences />

        {/* 5. Visual Gallery */}
        <Gallery />

        {/* 6. Guest Testimonials */}
        <Testimonials
          reviews={reviews}
          onReviewAdded={handleReviewAdded}
        />

        {/* 7. Contact Us & Travel Directions */}
        <Contact />
      </main>

      {/* 8. Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action WhatsApp */}
      <WhatsAppButton />

      {/* Modals & Dialogs */}
      <RoomModal
        room={selectedRoomForModal}
        onClose={() => setSelectedRoomForModal(null)}
        onBook={(roomId) => handleOpenBooking(roomId)}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={rooms}
        selectedRoomId={bookingRoomId}
        initialDates={bookingInitialDates}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRoomsUpdated={handleRefreshRooms}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VrindHomestayApp />
    </AuthProvider>
  );
}
