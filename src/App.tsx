import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { testFirestoreConnection } from './lib/firebase';
import { getRooms, getReviews, getSiteContentFromDb, getCachedSiteContent } from './services/dbService';
import { Room, Review, SiteContent } from './types';
import { INITIAL_ROOMS, INITIAL_REVIEWS, INITIAL_SITE_CONTENT } from './data/initialData';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Rooms } from './components/Rooms';
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
  const [siteContent, setSiteContent] = useState<SiteContent>(getCachedSiteContent());
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
        
        // Fetch rooms, reviews, and dynamic site content from Firestore
        const [roomsFromDb, reviewsFromDb, contentFromDb] = await Promise.all([
          getRooms(),
          getReviews(),
          getSiteContentFromDb()
        ]);

        if (roomsFromDb && roomsFromDb.length > 0) {
          setRooms(roomsFromDb);
        }
        if (reviewsFromDb && reviewsFromDb.length > 0) {
          setReviews(reviewsFromDb);
        }
        if (contentFromDb) {
          setSiteContent(contentFromDb);
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

  const handleRefreshSiteContent = async () => {
    try {
      const refreshed = await getSiteContentFromDb();
      setSiteContent(refreshed);
    } catch (err) {
      console.warn('Could not refresh site content:', err);
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const homestayDetails = siteContent.homestayDetails || INITIAL_SITE_CONTENT.homestayDetails;

  return (
    <div className="min-h-screen bg-[#08120e] text-[#f4efe6] font-sans antialiased selection:bg-[#c59b3f] selection:text-[#08120e]">
      {/* Schema.org SEO Structured Data */}
      <SEOJsonLd details={homestayDetails} rooms={rooms} />

      {/* Navigation Header */}
      <Navbar
        details={homestayDetails}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero 
          content={siteContent.hero}
          homestayDetails={homestayDetails}
          onOpenBooking={handleOpenBooking} 
        />

        {/* 2. About Us */}
        <About 
          content={siteContent.about}
          homestayDetails={homestayDetails}
        />

        {/* 3. Rooms & Accommodation */}
        <Rooms
          rooms={rooms}
          onSelectRoom={(room) => setSelectedRoomForModal(room)}
          onBookRoom={(roomId) => handleOpenBooking(roomId)}
        />

        {/* 4. Visual Gallery */}
        <Gallery items={siteContent.gallery} />

        {/* 5. Guest Testimonials */}
        <Testimonials
          reviews={reviews}
          onReviewAdded={handleReviewAdded}
        />

        {/* 6. Contact Us & Travel Directions */}
        <Contact details={homestayDetails} />
      </main>

      {/* 7. Footer */}
      <Footer
        details={homestayDetails}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action WhatsApp */}
      <WhatsAppButton whatsapp={homestayDetails.whatsapp} />

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
        onSiteContentUpdated={handleRefreshSiteContent}
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
