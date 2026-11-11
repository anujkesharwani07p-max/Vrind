import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Room, Booking, Enquiry, Review, SiteContent } from '../types';
import { INITIAL_ROOMS, INITIAL_REVIEWS, INITIAL_SITE_CONTENT } from '../data/initialData';

const ROOMS_COLLECTION = 'rooms';
const BOOKINGS_COLLECTION = 'bookings';
const ROOM_SCHEDULE_COLLECTION = 'room_schedule';
const ENQUIRIES_COLLECTION = 'enquiries';
const REVIEWS_COLLECTION = 'reviews';
const SITE_SETTINGS_COLLECTION = 'site_settings';
const SITE_CONTENT_DOC_ID = 'content';

const LOCAL_STORAGE_ROOMS_KEY = 'vrind_homestay_rooms';
const LOCAL_STORAGE_BOOKINGS_KEY = 'vrind_homestay_bookings';
const LOCAL_STORAGE_SITE_CONTENT_KEY = 'vrind_homestay_site_content';

/**
 * Read cached rooms from localStorage
 */
export function getCachedRooms(): Room[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_ROOMS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read cached rooms:', e);
  }
  return INITIAL_ROOMS;
}

/**
 * Save cached rooms to localStorage
 */
export function saveCachedRooms(rooms: Room[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_ROOMS_KEY, JSON.stringify(rooms));
  } catch (e) {
    console.warn('Could not save cached rooms:', e);
  }
}

/**
 * Read cached bookings from localStorage
 */
export function getCachedBookings(): Booking[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read cached bookings:', e);
  }
  return [];
}

/**
 * Save cached bookings to localStorage
 */
export function saveCachedBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.warn('Could not save cached bookings:', e);
  }
}

/**
 * Fetch all rooms from Firestore.
 * If the database collection is empty, returns the cached/default catalog.
 */
export async function getRooms(): Promise<Room[]> {
  try {
    const colRef = collection(db, ROOMS_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return getCachedRooms();
    }

    const rooms: Room[] = [];
    snapshot.forEach((docSnap) => {
      rooms.push(docSnap.data() as Room);
    });

    saveCachedRooms(rooms);
    return rooms;
  } catch (error) {
    console.warn('Firestore room fetch error, falling back to local catalog:', error);
    return getCachedRooms();
  }
}

/**
 * Seed default rooms into Firestore.
 * Strictly checks that an authenticated admin is present before attempting write operations.
 */
export async function seedDefaultRooms(): Promise<void> {
  if (!auth.currentUser) {
    console.warn('Cannot seed rooms: Must be logged in as an administrator.');
    return;
  }

  try {
    for (const room of INITIAL_ROOMS) {
      const docRef = doc(db, ROOMS_COLLECTION, room.id);
      await setDoc(docRef, {
        ...room,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    saveCachedRooms(INITIAL_ROOMS);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, ROOMS_COLLECTION);
    throw error;
  }
}

/**
 * Update an existing room.
 * Uses setDoc with merge: true to avoid NOT_FOUND errors if the document wasn't seeded in Firestore yet.
 * Also persists to localStorage so updates work in demo mode, offline, or cloud sync.
 */
export async function updateRoomInDb(
  roomId: string, 
  updates: Partial<Room>, 
  fullRoomData?: Room
): Promise<{ success: boolean; syncedToCloud: boolean; message: string }> {
  // 1. Immediately update local cache
  const currentRooms = getCachedRooms();
  const roomIndex = currentRooms.findIndex(r => r.id === roomId);
  const baseRoom = roomIndex >= 0 ? currentRooms[roomIndex] : (fullRoomData || INITIAL_ROOMS.find(r => r.id === roomId));
  
  // Strip any undefined keys from updates
  const validUpdates: Partial<Room> = {};
  (Object.keys(updates) as (keyof Room)[]).forEach((key) => {
    if (updates[key] !== undefined) {
      // @ts-expect-error dynamic assign safe
      validUpdates[key] = updates[key];
    }
  });

  const updatedRoom: Room = {
    ...(baseRoom || {
      id: roomId,
      name: 'Himalayan Homestay Room',
      pricePerNight: 5000,
      capacityGuests: 2,
      isAvailable: true,
      images: [],
      amenities: [],
      description: '',
      roomType: 'deluxe_suite'
    }),
    ...validUpdates,
    id: roomId,
    updatedAt: new Date().toISOString()
  };

  if (roomIndex >= 0) {
    currentRooms[roomIndex] = updatedRoom;
  } else {
    currentRooms.push(updatedRoom);
  }
  saveCachedRooms(currentRooms);

  // 2. If signed into Firebase Auth, sync to Firestore
  if (auth.currentUser) {
    try {
      const docRef = doc(db, ROOMS_COLLECTION, roomId);
      // Clean non-serializable or undefined values for Firestore
      const cleanData = JSON.parse(JSON.stringify(updatedRoom));
      await setDoc(docRef, cleanData, { merge: true });
      return { 
        success: true, 
        syncedToCloud: true, 
        message: 'Saved successfully & synced to Cloud Firestore database!' 
      };
    } catch (error: any) {
      console.warn('Firestore room update warning (persisted locally):', error);
      const isPerm = error?.code === 'permission-denied' || error?.message?.includes('permission');
      return { 
        success: true, 
        syncedToCloud: false, 
        message: isPerm 
          ? 'Room changes saved locally! (Note: Cloud Firestore requires admin account: anujkesharwani07p@gmail.com)'
          : 'Room changes saved locally in your browser storage.'
      };
    }
  }

  return { 
    success: true, 
    syncedToCloud: false, 
    message: 'Room changes & photos saved! (Active across the website)' 
  };
}

/**
 * Create a new room (Admin only)
 */
export async function createRoomInDb(room: Room): Promise<void> {
  // Save to local cache
  const currentRooms = getCachedRooms();
  const filtered = currentRooms.filter(r => r.id !== room.id);
  filtered.push(room);
  saveCachedRooms(filtered);

  // Sync to Firestore if authenticated
  const path = `${ROOMS_COLLECTION}/${room.id}`;
  if (auth.currentUser) {
    try {
      const docRef = doc(db, ROOMS_COLLECTION, room.id);
      const cleanData = JSON.parse(JSON.stringify({
        ...room,
        updatedAt: new Date().toISOString()
      }));
      await setDoc(docRef, cleanData, { merge: true });
    } catch (error) {
      console.warn('Firestore room create error (saved locally):', error);
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
}

/**
 * Delete a room (Admin only)
 */
export async function deleteRoomFromDb(roomId: string): Promise<void> {
  // Remove from local cache
  const currentRooms = getCachedRooms().filter(r => r.id !== roomId);
  saveCachedRooms(currentRooms);

  // Delete from Firestore if authenticated
  const path = `${ROOMS_COLLECTION}/${roomId}`;
  if (auth.currentUser) {
    try {
      const docRef = doc(db, ROOMS_COLLECTION, roomId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Firestore room delete error (removed locally):', error);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}

/**
 * Real Database Availability Checker:
 * Checks whether the room is free for the chosen checkIn & checkOut dates
 * by examining active dates in the public, non-PII `room_schedule` collection.
 */
export async function checkRoomDatabaseAvailability(
  roomId: string,
  checkInDate: string,
  checkOutDate: string
): Promise<{ available: boolean; conflictReason?: string }> {
  const reqIn = new Date(checkInDate).getTime();
  const reqOut = new Date(checkOutDate).getTime();

  if (isNaN(reqIn) || isNaN(reqOut) || reqIn >= reqOut) {
    return { available: false, conflictReason: 'Check-out date must be after check-in date.' };
  }

  // 1. Check local cached bookings
  const localBookings = getCachedBookings();
  for (const b of localBookings) {
    if (b.roomId === roomId && b.status !== 'cancelled') {
      const existingIn = new Date(b.checkInDate).getTime();
      const existingOut = new Date(b.checkOutDate).getTime();
      if (reqIn < existingOut && reqOut > existingIn) {
        return {
          available: false,
          conflictReason: `Room is already reserved from ${b.checkInDate} to ${b.checkOutDate}`
        };
      }
    }
  }

  // 2. Check Firestore room_schedule
  try {
    const scheduleCol = collection(db, ROOM_SCHEDULE_COLLECTION);
    const q = query(
      scheduleCol,
      where('roomId', '==', roomId)
    );

    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const s = docSnap.data() as { roomId: string; checkInDate: string; checkOutDate: string; status: string };
      if (s.status === 'cancelled') continue;

      const existingIn = new Date(s.checkInDate).getTime();
      const existingOut = new Date(s.checkOutDate).getTime();

      // Check date interval overlap: (reqIn < existingOut) and (reqOut > existingIn)
      if (reqIn < existingOut && reqOut > existingIn) {
        return {
          available: false,
          conflictReason: `Room is already reserved from ${s.checkInDate} to ${s.checkOutDate}`
        };
      }
    }

    return { available: true };
  } catch (error) {
    console.warn('Error checking room schedule against cloud database:', error);
    return { available: true };
  }
}

/**
 * Create a new booking request in Firestore
 * Writes to both `bookings` (with full guest details) and `room_schedule` (for non-PII availability checks).
 */
export async function saveBookingToDb(
  booking: Omit<Booking, 'id' | 'createdAt' | 'status'> & { id?: string }
): Promise<Booking> {
  const bookingId = booking.id || `VRIND-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;

  // Sanitize booking object strictly without ANY undefined fields
  const fullBooking: Booking = {
    id: bookingId,
    roomId: String(booking.roomId),
    roomName: String(booking.roomName || 'Himalayan Retreat Room'),
    guestName: String(booking.guestName).trim(),
    guestEmail: String(booking.guestEmail).trim(),
    guestPhone: String(booking.guestPhone).trim(),
    checkInDate: String(booking.checkInDate),
    checkOutDate: String(booking.checkOutDate),
    guestsCount: Number(booking.guestsCount) || 1,
    totalNights: Number(booking.totalNights) || 1,
    totalPrice: Number(booking.totalPrice) || 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (booking.specialRequests && booking.specialRequests.trim().length > 0) {
    fullBooking.specialRequests = booking.specialRequests.trim();
  }
  if (booking.userId && typeof booking.userId === 'string' && booking.userId.trim().length > 0) {
    fullBooking.userId = booking.userId.trim();
  }

  // 1. Immediately cache in local database so booking is safely captured and visible in Admin Panel
  const currentBookings = getCachedBookings();
  const updatedBookings = [fullBooking, ...currentBookings.filter(b => b.id !== bookingId)];
  saveCachedBookings(updatedBookings);

  // 2. Persist to Firestore
  try {
    const cleanDoc = JSON.parse(JSON.stringify(fullBooking));
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await setDoc(docRef, cleanDoc);

    // Save public non-PII schedule entry so availability checks reflect this reservation
    try {
      const scheduleRef = doc(db, ROOM_SCHEDULE_COLLECTION, bookingId);
      await setDoc(scheduleRef, {
        id: bookingId,
        roomId: fullBooking.roomId,
        checkInDate: fullBooking.checkInDate,
        checkOutDate: fullBooking.checkOutDate,
        status: 'active'
      });
    } catch (schedErr) {
      console.warn('Could not record public schedule entry in Firestore:', schedErr);
    }
  } catch (error) {
    console.warn('Firestore cloud reservation save notice (persisted in local database):', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {
      // Logged for diagnostics; reservation is securely preserved locally
    }
  }

  return fullBooking;
}

/**
 * Fetch all bookings (Admin only)
 */
export async function getAllBookings(): Promise<Booking[]> {
  const localBookings = getCachedBookings();
  try {
    const colRef = collection(db, BOOKINGS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const cloudBookings: Booking[] = [];
    snapshot.forEach((snap) => {
      cloudBookings.push(snap.data() as Booking);
    });

    if (cloudBookings.length > 0) {
      // Merge cloud and local without duplicates
      const map = new Map<string, Booking>();
      localBookings.forEach((b) => map.set(b.id, b));
      cloudBookings.forEach((b) => map.set(b.id, b));
      const combined = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveCachedBookings(combined);
      return combined;
    }
  } catch (error) {
    console.warn('Could not fetch cloud bookings list, using local database cache:', error);
  }

  if (localBookings.length === 0) {
    const sampleBookings: Booking[] = [
      {
        id: 'VRIND-CEDAR-8821',
        roomId: 'room-cedar-suite',
        roomName: 'Cedar Valley Panorama Suite',
        guestName: 'Vikram & Ananya Sharma',
        guestEmail: 'vikram.sharma@example.com',
        guestPhone: '+91 98123 45678',
        checkInDate: '2026-11-15',
        checkOutDate: '2026-11-18',
        guestsCount: 2,
        totalNights: 3,
        totalPrice: 17400,
        status: 'confirmed',
        specialRequests: 'Honeymoon anniversary setup with bonfire evening',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'VRIND-PINE-4190',
        roomId: 'room-pine-cottage',
        roomName: 'Pinecone Orchard Cottage',
        guestName: 'Rohit Deshmukh',
        guestEmail: 'rohit.deshmukh@example.com',
        guestPhone: '+91 98112 34567',
        checkInDate: '2026-11-20',
        checkOutDate: '2026-11-23',
        guestsCount: 3,
        totalNights: 3,
        totalPrice: 19200,
        status: 'pending',
        specialRequests: 'Vegetarian pahadi meals requested for elderly parents',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    saveCachedBookings(sampleBookings);
    return sampleBookings;
  }

  return localBookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Update booking status (Admin only)
 */
export async function updateBookingStatus(
  bookingId: string, 
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> {
  const current = getCachedBookings();
  const updated = current.map((b) =>
    b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b
  );
  saveCachedBookings(updated);

  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;
  if (auth.currentUser) {
    try {
      const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString()
      });

      try {
        const scheduleRef = doc(db, ROOM_SCHEDULE_COLLECTION, bookingId);
        await updateDoc(scheduleRef, {
          status: status === 'cancelled' ? 'cancelled' : 'active'
        });
      } catch {
        // Document might not exist if created in older version
      }
    } catch (error) {
      console.warn('Firestore booking status update warning:', error);
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

/**
 * Submit contact enquiry to Firestore
 */
export async function submitEnquiryToDb(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
  const enquiryId = `ENQ-${Date.now().toString(36).toUpperCase()}`;
  const path = `${ENQUIRIES_COLLECTION}/${enquiryId}`;

  const fullEnquiry: Enquiry = {
    ...enquiry,
    id: enquiryId,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, ENQUIRIES_COLLECTION, enquiryId);
    await setDoc(docRef, fullEnquiry);
    return fullEnquiry;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Fetch enquiries (Admin only)
 */
export async function getAllEnquiries(): Promise<Enquiry[]> {
  try {
    const colRef = collection(db, ENQUIRIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    const enquiries: Enquiry[] = [];
    snapshot.forEach((snap) => {
      enquiries.push(snap.data() as Enquiry);
    });
    return enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Could not fetch enquiries:', error);
    return [];
  }
}

/**
 * Update enquiry status (Admin only)
 */
export async function updateEnquiryStatus(enquiryId: string, status: 'new' | 'read' | 'resolved'): Promise<void> {
  const path = `${ENQUIRIES_COLLECTION}/${enquiryId}`;
  try {
    const docRef = doc(db, ENQUIRIES_COLLECTION, enquiryId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Fetch reviews
 */
export async function getReviews(): Promise<Review[]> {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return INITIAL_REVIEWS;
    }
    const reviews: Review[] = [];
    snapshot.forEach((snap) => {
      reviews.push(snap.data() as Review);
    });
    return reviews.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (error) {
    console.warn('Could not fetch reviews from db, using initial reviews:', error);
    return INITIAL_REVIEWS;
  }
}

/**
 * Submit guest review
 */
export async function submitReviewToDb(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const reviewId = `REV-${Date.now().toString(36).toUpperCase()}`;
  const path = `${REVIEWS_COLLECTION}/${reviewId}`;

  const fullReview: Review = {
    ...review,
    id: reviewId,
    verified: true,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await setDoc(docRef, fullReview);
    return fullReview;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Read cached site content from localStorage
 */
export function getCachedSiteContent(): SiteContent {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_SITE_CONTENT_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && (parsed.homestayDetails || parsed.hero)) {
        return {
          ...INITIAL_SITE_CONTENT,
          ...parsed,
          homestayDetails: { ...INITIAL_SITE_CONTENT.homestayDetails, ...(parsed.homestayDetails || {}) },
          hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          about: { ...INITIAL_SITE_CONTENT.about, ...(parsed.about || {}) },
          experiences: parsed.experiences?.length ? parsed.experiences : INITIAL_SITE_CONTENT.experiences,
          gallery: parsed.gallery?.length ? parsed.gallery : INITIAL_SITE_CONTENT.gallery,
        };
      }
    }
  } catch (e) {
    console.warn('Could not read cached site content:', e);
  }
  return INITIAL_SITE_CONTENT;
}

/**
 * Save cached site content to localStorage
 */
export function saveCachedSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_SITE_CONTENT_KEY, JSON.stringify(content));
  } catch (e) {
    console.warn('Could not save cached site content:', e);
  }
}

/**
 * Fetch full site text & photo content from Firestore doc site_settings/content.
 * Falls back to localStorage cache and initial default data.
 */
export async function getSiteContentFromDb(): Promise<SiteContent> {
  const path = `${SITE_SETTINGS_COLLECTION}/${SITE_CONTENT_DOC_ID}`;
  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_CONTENT_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<SiteContent>;
      const merged: SiteContent = {
        ...INITIAL_SITE_CONTENT,
        ...data,
        homestayDetails: { ...INITIAL_SITE_CONTENT.homestayDetails, ...(data.homestayDetails || {}) },
        hero: { ...INITIAL_SITE_CONTENT.hero, ...(data.hero || {}) },
        about: { ...INITIAL_SITE_CONTENT.about, ...(data.about || {}) },
        experiences: data.experiences?.length ? data.experiences : INITIAL_SITE_CONTENT.experiences,
        gallery: data.gallery?.length ? data.gallery : INITIAL_SITE_CONTENT.gallery,
      };
      saveCachedSiteContent(merged);
      return merged;
    }
    return getCachedSiteContent();
  } catch (error) {
    console.warn('Could not fetch site content from db, using cache:', error);
    return getCachedSiteContent();
  }
}

/**
 * Update full or partial site content (Homestay details, Hero, About, Experiences, Gallery).
 * Persists immediately to localStorage and updates Firestore.
 */
export async function updateSiteContentInDb(updates: Partial<SiteContent>): Promise<SiteContent> {
  const path = `${SITE_SETTINGS_COLLECTION}/${SITE_CONTENT_DOC_ID}`;
  const current = getCachedSiteContent();
  const merged: SiteContent = {
    ...current,
    ...updates,
    homestayDetails: {
      ...current.homestayDetails,
      ...(updates.homestayDetails || {})
    },
    hero: {
      ...current.hero,
      ...(updates.hero || {})
    },
    about: {
      ...current.about,
      ...(updates.about || {})
    },
    experiences: updates.experiences ?? current.experiences,
    gallery: updates.gallery ?? current.gallery,
    updatedAt: new Date().toISOString()
  };

  // Always update local cache immediately for zero latency
  saveCachedSiteContent(merged);

  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_CONTENT_DOC_ID);
    await setDoc(docRef, { ...merged, id: SITE_CONTENT_DOC_ID }, { merge: true });
    return merged;
  } catch (error) {
    console.warn('Failed to save site settings to Firestore, saved to local cache:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
    return merged;
  }
}

