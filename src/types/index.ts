export interface Room {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  roomType: 'deluxe_suite' | 'cedar_cottage' | 'attic_room' | 'valley_villa';
  pricePerNight: number;
  capacityGuests: number;
  bedType?: string;
  sizeSqFt?: number;
  view?: string;
  featured?: boolean;
  isAvailable: boolean;
  rating?: number;
  images: string[];
  amenities: string[];
  updatedAt?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalNights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  comment: string;
  roomStayed?: string;
  stayDate?: string;
  verified?: boolean;
  createdAt?: string;
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Relaxed';
  tags: string[];
  highlight: string;
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface HomestayDetails {
  name: string;
  tagline: string;
  address: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  phoneFormatted: string;
  whatsapp: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  altitude: string;
  nearestAirport: string;
  nearestRailway: string;
  drivingDistance: string;
}

export interface HeroContent {
  badge: string;
  headline: string;
  subtitle: string;
  heroImage: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  storyP1: string;
  storyP2: string;
  mainImage: string;
  secondaryImage: string;
  badgeText: string;
  elevationBadge: string;
}

export interface SiteContent {
  homestayDetails: HomestayDetails;
  hero: HeroContent;
  about: AboutContent;
  experiences: Experience[];
  gallery: GalleryItem[];
  updatedAt?: string;
}

