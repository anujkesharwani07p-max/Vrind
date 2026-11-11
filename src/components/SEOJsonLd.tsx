import { HOMESTAY_DETAILS, INITIAL_ROOMS } from '../data/initialData';
import { HomestayDetails, Room } from '../types';

interface SEOJsonLdProps {
  details?: HomestayDetails;
  rooms?: Room[];
}

export const SEOJsonLd: React.FC<SEOJsonLdProps> = ({ details = HOMESTAY_DETAILS, rooms = INITIAL_ROOMS }) => {
  const info = details || HOMESTAY_DETAILS;
  const roomList = rooms && rooms.length > 0 ? rooms : INITIAL_ROOMS;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BedAndBreakfast',
    'name': info.name,
    'description': 'Handcrafted Kathkuni Himalayan homestay at 7,200 ft elevation with panoramic valley views, organic farm dining, and cozy wood-burning suites.',
    'url': window.location.origin,
    'telephone': info.phone,
    'email': info.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Shanag Road, Burwa',
      'addressLocality': 'Manali',
      'addressRegion': 'Himachal Pradesh',
      'postalCode': '175103',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': info.coordinates?.lat || 32.2885,
      'longitude': info.coordinates?.lng || 77.1682
    },
    'priceRange': '₹4,200 - ₹8,500',
    'checkinTime': info.checkInTime,
    'checkoutTime': info.checkOutTime,
    'petsAllowed': 'True (upon prior inquiry)',
    'amenityFeature': [
      { '@type': 'LocationFeatureSpecification', 'name': 'High-Speed Wi-Fi', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Traditional Kathkuni Fireplace', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Organic Farm-to-Table Breakfast', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Mountain Valley View Balconies', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Stargazing Campfire', 'value': true }
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Himalayan Homestay Suites',
      'itemListElement': roomList.map((room) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'HotelRoom',
          'name': room.name,
          'description': room.description,
          'occupancy': {
            '@type': 'QuantitativeValue',
            'maxValue': room.capacityGuests
          }
        },
        'price': room.pricePerNight,
        'priceCurrency': 'INR'
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
