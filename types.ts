

// Common interfaces
export interface VendorCategory {
  id: string;
  name: string;
  slug: 'venues' | 'photographers' | 'music' | 'decoration' | 'cakes' | 'other' | 'products' | 'videography' | 'catering' | 'beauty' | 'transport' | 'fireworks'; // Database keys
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

export type VendorType = 'VENUE' | 'SERVICE' | 'PRODUCT';

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

// Specifics for Products (Dresses, Suits, Rings)
export interface ProductVendor extends BaseVendor {
  type: 'PRODUCT';
  product_type: string; // "Wedding Dress", "Suit", "Rings"
  sale_options: ('SALE' | 'RENT')[]; // Can buy, rent or both
  pricing: {
    buy_price_from?: number;
    rent_price_from?: number;
  };
}

// Union type for use in components
export type Vendor = VenueVendor | ServiceVendor | ProductVendor;

export interface Inquiry {
  id: string;
  vendorId: string;
  vendorName: string;
  userName: string;
  contact: string;
  date: string; // Event date
  guestCount: number;
  status: 'new' | 'read' | 'replied';
  createdAt: any; // Firestore Timestamp
}

// --- NEW AUTH INTERFACES ---

export type UserRole = 'user' | 'contractor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  createdAt: any;
  // Specific for event organizers
  eventDate?: string;
  eventType?: 'wedding' | 'baptism' | 'birthday' | 'other';
  guestCount?: number;
  preferences?: {
    location?: string;
    budget?: string;
    style?: string;
  };
}

export interface AuthState {
  user: UserProfile | null;
  vendorProfile: Vendor | null; // If role is contractor
  loading: boolean;
}
