import React from 'react';
import { HOMESTAY_DETAILS, INITIAL_ROOMS } from '../data/initialData';

export const SEOJsonLd: React.FC = () => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BedAndBreakfast',
    'name': HOMESTAY_DETAILS.name,
    'description': 'Handcrafted Kathkuni Himalayan homestay at 7,200 ft elevation with panoramic valley views, organic farm dining, and cozy wood-burning suites.',
    'url': window.location.origin,
    'telephone': HOMESTAY_DETAILS.phone,
    'email': HOMESTAY_DETAILS.email,
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
      'latitude': HOMESTAY_DETAILS.coordinates.lat,
      'longitude': HOMESTAY_DETAILS.coordinates.lng
    },
    'priceRange': '₹4,200 - ₹8,500',
    'checkinTime': HOMESTAY_DETAILS.checkInTime,
    'checkoutTime': HOMESTAY_DETAILS.checkOutTime,
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
      'itemListElement': INITIAL_ROOMS.map((room) => ({
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
