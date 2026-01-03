
// Common interfaces
export interface VendorCategory {
  id: string;
  name: string;
  slug: 'venues' | 'photographers' | 'music' | 'decoration' | 'cakes' | 'other'; // Database keys
  iconName: string;
  count: number;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export type VendorType = 'VENUE' | 'SERVICE';

export interface BaseVendor {
  id: string;
  ownerId?: string; // Firebase Auth UID
  pib?: string;     // Tax ID
  mb?: string;      // Registration Number
  name: string;
  slug: string; // for url
  category_id: string; // link to category
  address: string;
  city: string;
  google_maps_url?: string;
  cover_image: string;
  gallery: string[];
  rating: number;
  reviews_count: number;
  price_range_symbol: '€' | '€€' | '€€€';
  description: string;
  features: string[]; // Generic tags like "WiFi", "Parking", "Drone"
  contact: {
    phone: string;
    email: string;
    website?: string;
    instagram?: string;
  };
}

// Specifics for Venues (Restaurants, Halls)
export interface VenueVendor extends BaseVendor {
  type: 'VENUE';
  venue_type: string; // Event Centar, Restoran, Splav
  capacity: {
    min: number;
    max: number;
    seated: number;
    cocktail: number;
  };
  pricing: {
    per_person_from: number;
    per_person_to?: number;
    rental_fee?: number;
  };
}

// Specifics for Services (Photographers, Bands, Decor)
export interface ServiceVendor extends BaseVendor {
  type: 'SERVICE';
  service_type: string; // "Wedding Photography", "Live Band", "DJ"
  pricing: {
    hourly_rate?: number;
    package_from?: number;
    min_hours?: number;
  };
  experience_years?: number;
}

// Union type for use in components
export type Vendor = VenueVendor | ServiceVendor;
