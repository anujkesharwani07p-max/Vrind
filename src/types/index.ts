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
