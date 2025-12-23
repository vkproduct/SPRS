
export interface VendorCategory {
  id: string;
  name: string;
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

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Venue {
  name: string;
  url: string;
  address: string;
  municipality?: string;
  google_maps_url: string;
  capacity_min: number;
  capacity_max: number;
  price_from_eur: number | null;
  price_to_eur: number | null;
  venue_type: string;
  description?: string;
  amenities?: {
    music?: string;
    decoration?: string;
    discounts_for_newlyweds?: boolean;
    parking?: boolean;
    photographer?: string;
    bridal_apartment?: boolean;
  };
  comments_count: number | null;
}
