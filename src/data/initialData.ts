import { Room, Experience, Review, GalleryItem, HeroContent, AboutContent, SiteContent, HomestayDetails } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-cedar-suite',
    name: 'Cedar Valley Panorama Suite',
    tagline: '180° Panoramic Himalayan range views with private cedar wood balcony',
    description: 'Perched on the upper tier of Vrind Homestay, this expansive suite is hand-crafted with aromatic Himalayan deodar cedar wood. Wake up to golden sunrise rays illuminating snow-clad peaks, enjoy morning French press coffee on your private glass-railed balcony, and unwind beside the brass-trimmed stone fireplace.',
    roomType: 'deluxe_suite',
    pricePerNight: 5800,
    capacityGuests: 3,
    bedType: 'King Bed + Daybed',
    sizeSqFt: 480,
    view: 'Snow Peaks & Valley Forest',
    featured: true,
    isAvailable: true,
    rating: 4.95,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Mountain-View Balcony',
      'Traditional Wood Fireplace',
      'Artisanal Himalayan Tea & Coffee Station',
      'Heated Plush Duvets & Electric Blankets',
      'High-Speed Wi-Fi (Fiber 100 Mbps)',
      'Ensuite Rain Shower with Organic Herbal Toiletries',
      'Complimentary Farm-to-Table Breakfast',
      'Handcrafted Wooden Rocking Chairs'
    ]
  },
  {
    id: 'room-pine-cottage',
    name: 'Pinecone Orchard Cottage',
    tagline: 'Independent stone & pine sanctuary nestled amidst wild apple trees',
    description: 'An idyllic independent cottage surrounded by centuries-old apple orchards and deodar trees. Designed in traditional Kathkuni architectural technique with interlocking river stones and timber logs. Features skylight windows for stargazing directly from your bed and a cozy reading alcove.',
    roomType: 'cedar_cottage',
    pricePerNight: 6400,
    capacityGuests: 4,
    bedType: '1 King Bed + 2 Twin Loft Beds',
    sizeSqFt: 540,
    view: 'Apple Orchard & Pine Canopy',
    featured: true,
    isAvailable: true,
    rating: 4.98,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Orchard Patio & Garden',
      'Mezzanine Loft Sleeping Area',
      'Cast-Iron Fire Stove (Bukhari)',
      'Locally Foraged Herbal Tea Collection',
      'Work Desk overlooking Deodar forest',
      'Luxury Brass Bathroom with Hot Geyser',
      'Daily Evening Orchard Tea & Local Snacks'
    ]
  },
  {
    id: 'room-himalayan-attic',
    name: 'Himalayan Stargazer Attic',
    tagline: 'Cozy sloped wooden roof suite with panoramic celestial skylights',
    description: 'Experience true alpine romance in this timber-lined attic haven. Angled cedar wood beams, large slanted roof windows pointing straight to the pristine Himalayan night sky, and panoramic dormer windows looking out at the valley. Ideal for couples, solo writers, and artists seeking undisturbed inspiration.',
    roomType: 'attic_room',
    pricePerNight: 4200,
    capacityGuests: 2,
    bedType: 'Queen Plush Mattress with Goose-Down Pillows',
    sizeSqFt: 360,
    view: 'Clear Himalayan Sky & Pine Valley',
    featured: false,
    isAvailable: true,
    rating: 4.92,
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Celestial Roof Windows for Stargazing',
      'Curated Library of Mountain Literature',
      'Radiant Room Heaters',
      'Bluetooth Acoustic Speaker',
      'Handmade Tibetan Wool Throws',
      'Organic Bath Products',
      'Herbal Morning Infusions'
    ]
  },
  {
    id: 'room-valley-villa',
    name: 'Kailash View Family Haven',
    tagline: 'Spacious two-bedroom retreat designed for families & long mountain retreats',
    description: 'A grand family suite encompassing two connected bedrooms, a warm dining nook, and a wraparound sun deck with 270-degree mountain valley vistas. Filled with handcrafted walnut furniture, Kashmiri carpets, and abundant sunlight throughout the day.',
    roomType: 'valley_villa',
    pricePerNight: 8500,
    capacityGuests: 6,
    bedType: '2 King Beds + Convertible Sofa',
    sizeSqFt: 720,
    view: 'Panoramic Multi-Peak Valley',
    featured: true,
    isAvailable: true,
    rating: 4.97,
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Wraparound Sun-Drenched Timber Deck',
      'Two Master Ensuite Bathrooms',
      'Dedicated Living & Dining Lounge',
      'Mini Pantry with Electric Kettle & Microwave',
      'Ultra-Fast Fiber Optic Internet',
      'Board Games & Mountain Bookshelf',
      'Family Dining Privileges & Chef Customization'
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-forest-trail',
    title: 'Secret Deodar Pine Trail',
    subtitle: 'Guided morning walk through ancient sacred cedar groves',
    description: 'Immerse your senses in crisp mountain air scented with wild thyme, mint, and pine resin. Led by our local naturalist, this gentle 2.5-hour trail winds past hidden babbling brooks, bird-nesting hollows, and panoramic valley vantage points.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    duration: '2.5 Hours',
    difficulty: 'Easy',
    tags: ['Nature Walk', 'Birdwatching', 'Forest Bathing'],
    highlight: 'Spot rare Himalayan monals and songbirds'
  },
  {
    id: 'exp-bonfire-stargazing',
    title: 'Campfire & Himalayan Astronomy',
    subtitle: 'Dark sky observation with telescope and pahadi folk stories',
    description: 'At 7,200 feet above sea level with zero light pollution, the Himalayan sky reveals the Milky Way in crystal clarity. Gather around our stone fire pit, sip hot spiced cider or Kashmiri Kahwa, and observe Saturn rings and nebula through our high-powered telescope.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    duration: 'Evening (8 - 10 PM)',
    difficulty: 'Relaxed',
    tags: ['Stargazing', 'Bonfire', 'Folk Lore'],
    highlight: 'Zero light pollution Milky Way views'
  },
  {
    id: 'exp-pahadi-cuisine',
    title: 'Clay Oven & Organic Pahadi Kitchen',
    subtitle: 'Farm-to-table culinary session with local grandmothers',
    description: 'Harvest fresh greens and mountain herbs from our organic terrace garden. Learn to prepare authentic Siddu (steamed walnut-stuffed buns), fragrant Madra, smoky slow-cooked lentils, and wild rhododendron cordial using age-old clay oven techniques.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    duration: '3 Hours',
    difficulty: 'Relaxed',
    tags: ['Cooking Masterclass', 'Organic Farm', 'Local Culture'],
    highlight: 'Traditional brass-pot slow cooking secrets'
  },
  {
    id: 'exp-waterfall-trek',
    title: 'Hidden Jogini Cascades Hike',
    subtitle: 'Scenic ridge trek to secluded glacier-fed mountain pools',
    description: 'For those who love adventure, a moderate 4-hour trek across alpine meadows and boulder trails brings you to a thundering two-tier waterfall fed by perpetual snowfields. Perfect for a brisk dip or meditation by the rapids.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    duration: '4 Hours',
    difficulty: 'Moderate',
    tags: ['Alpine Trek', 'Waterfall', 'Photography'],
    highlight: 'Picnic basket with homemade mountain sandwiches included'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    category: 'mountains',
    title: 'Sunrise over Pir Panjal Peaks',
    subtitle: 'View straight from the homestay front lawn',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g2',
    category: 'rooms',
    title: 'Cedar Valley Panorama Suite',
    subtitle: 'Warm wood and cozy fleece throws',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g3',
    category: 'property',
    title: 'Stone & Timber Kathkuni Architecture',
    subtitle: 'Sustainable heritage construction',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g4',
    category: 'nature',
    title: 'Wild Pine Canopy in Autumn',
    subtitle: 'Bordering the Great Himalayan National Park buffer',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g5',
    category: 'dining',
    title: 'Morning Breakfast on the Orchard Deck',
    subtitle: 'Fresh farm eggs, local honey, and apple preserves',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g6',
    category: 'nature',
    title: 'Misty Valleys at Twilight',
    subtitle: 'Sea of clouds rolling below the retreat',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g7',
    category: 'rooms',
    title: 'Stargazer Attic Mezzanine',
    subtitle: 'Look up into the cosmos from warm bed',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'g8',
    category: 'property',
    title: 'Evening Fire Pit Gathering',
    subtitle: 'Warm flames under the starlit sky',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Sunita & Vikram Malhotra',
    authorLocation: 'New Delhi',
    rating: 5,
    comment: 'Staying at Vrind Homestay was the most therapeutic week of our year. The Cedar Valley Suite had views that looked like an oil painting. The host family treated us like cherished relatives — freshly made Siddu with homemade ghee, hot ginger water, and serene silence. We are already booking our Diwali retreat here.',
    roomStayed: 'Cedar Valley Panorama Suite',
    stayDate: 'October 2026',
    verified: true,
    createdAt: '2026-10-10T14:30:00.000Z'
  },
  {
    id: 'rev-2',
    authorName: 'David K. Richardson',
    authorLocation: 'Bristol, United Kingdom',
    rating: 5,
    comment: 'As a writer and landscape photographer, I have stayed across the Swiss Alps and Rockies. Vrind Homestay has a soul that commercial hotels cannot replicate. The high-speed fiber internet made remote work effortless, while the pine forest trails right behind the cottage provided absolute peace. 10/10.',
    roomStayed: 'Pinecone Orchard Cottage',
    stayDate: 'September 2026',
    verified: true,
    createdAt: '2026-09-28T09:15:00.000Z'
  },
  {
    id: 'rev-3',
    authorName: 'Ananya Deshmukh',
    authorLocation: 'Pune, Maharashtra',
    rating: 5,
    comment: 'The Stargazer Attic is pure magic! Looking up at shooting stars from inside a warm wooden room while sipping chamomile tea was unforgettable. Clean, pristine linen, heated blankets, and the warmest hospitality. Thank you Vrind family!',
    roomStayed: 'Himalayan Stargazer Attic',
    stayDate: 'October 2026',
    verified: true,
    createdAt: '2026-10-04T18:40:00.000Z'
  }
];

export const HOMESTAY_DETAILS: HomestayDetails = {
  name: 'Vrind Homestay – Himalayan Retreat',
  tagline: 'Experience Peace in the Heart of the Himalayas',
  address: 'Shanag Road, Burwa, Manali, Himachal Pradesh 175103',
  coordinates: { lat: 32.2885, lng: 77.1682 },
  phone: '+91 7807126530',
  phoneFormatted: '+91 78071 26530',
  whatsapp: '917807126530',
  email: 'retreat@vrindhomestay.com',
  checkInTime: '13:00 PM',
  checkOutTime: '11:00 AM',
  altitude: '7,200 ft (2,195 m)',
  nearestAirport: 'Bhuntar / Kullu-Manali (KUU) – 48 km',
  nearestRailway: 'Chandigarh Junction (CDG) – 275 km / Amb Andaura – 180 km',
  drivingDistance: 'From New Delhi: 510 km (Scenic 10-12 hrs drive via NH21/Four-Lane Expressway)'
};

export const INITIAL_HERO: HeroContent = {
  badge: '7,200 Ft Elevation • Manali Heritage Valley',
  headline: 'Experience Peace in the Heart of the Himalayas',
  subtitle: 'Tucked away in sacred deodar pine forests and fragrant apple orchards, Vrind Homestay offers handcrafted Kathkuni cedar suites, farm-fresh organic dining, and the undisturbed stillness of high mountain peaks.',
  heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85'
};

export const INITIAL_ABOUT: AboutContent = {
  title: 'A Serene Sanctuary Built with Deodar Wood & Pure Warmth',
  subtitle: 'About Vrind Homestay',
  storyP1: 'Vrind Homestay was born from a simple devotion: to create a mindful refuge where travelers can disconnect from the frenetic pace of modern life and reconnect with the raw majesty of the Pir Panjal and Dhauladhar mountains.',
  storyP2: 'Constructed by master local artisans using traditional Kathkuni architecture — an age-old Himalayan technique of interlocking river stones and aromatic deodar cedar logs without mortar — our homestay remains naturally warm during winter snowfalls and pleasantly breezy in Himalayan summers.',
  mainImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
  secondaryImage: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80',
  badgeText: 'Kathkuni Wood & River-Stone Craft',
  elevationBadge: '7,200 ft (2,195 m)'
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  homestayDetails: HOMESTAY_DETAILS,
  hero: INITIAL_HERO,
  about: INITIAL_ABOUT,
  experiences: EXPERIENCES,
  gallery: GALLERY_ITEMS
};
