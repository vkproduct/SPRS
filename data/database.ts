
import { Vendor, VendorCategory } from '../types';

// 1. Categories Table
export const categories: VendorCategory[] = [
  { id: '1', slug: 'venues', name: 'Restorani i Sale', iconName: 'Home', count: 120, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { id: '2', slug: 'photographers', name: 'Fotografi', iconName: 'Camera', count: 85, image: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=800&q=80' },
  { id: '3', slug: 'music', name: 'Muzika', iconName: 'Music', count: 64, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
  { id: '4', slug: 'cakes', name: 'Torte', iconName: 'Utensils', count: 45, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80' },
  { id: '5', slug: 'decoration', name: 'Dekoracija', iconName: 'Flower', count: 32, image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80' },
];

// Helper images
const images = {
    venue: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    photo: [
        "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80"
    ],
    music: [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
    ]
};

// 2. Vendors Table (Mixed Types)
export const vendors: Vendor[] = [
    // --- VENUES (Migrated from previous data) ---
    {
        id: 'v-1',
        type: 'VENUE',
        name: "FOREST HALL Event Centar",
        slug: "forest-hall",
        category_id: '1',
        venue_type: "EVENT CENTAR",
        address: "Vukašina Antića 28d",
        city: "Beograd",
        google_maps_url: "https://www.google.com/maps/place/Forest+hall",
        cover_image: images.venue[0],
        gallery: images.venue,
        rating: 4.9,
        reviews_count: 20,
        price_range_symbol: '€€',
        description: "Savremeni event centar koji kombinuje luksuz, eleganciju i prirodnu harmoniju sa baštom i paviljonom.",
        features: ["Parking", "Bazen", "Apartman za mladence", "Dekoracija uključena"],
        contact: { phone: "+381601234567", email: "info@foresthall.rs" },
        capacity: { min: 150, max: 250, seated: 230, cocktail: 300 },
        pricing: { per_person_from: 80 }
    },
    {
        id: 'v-2',
        type: 'VENUE',
        name: "Restoran FILMSKA ZVEZDA",
        slug: "filmska-zvezda",
        category_id: '1',
        venue_type: "RESTORAN",
        address: "Kneza Višeslava 86b",
        city: "Beograd",
        google_maps_url: "https://goo.gl/maps/xyz",
        cover_image: images.venue[1],
        gallery: images.venue,
        rating: 4.7,
        reviews_count: 118,
        price_range_symbol: '€',
        description: "Kultno mesto u Košutnjaku sa prelepim pogledom na grad.",
        features: ["Parking", "Bašta", "WiFi"],
        contact: { phone: "+381601234567", email: "info@zvezda.rs" },
        capacity: { min: 50, max: 320, seated: 300, cocktail: 400 },
        pricing: { per_person_from: 37 }
    },
    {
        id: 'v-3',
        type: 'VENUE',
        name: "Hotel MOSKVA",
        slug: "hotel-moskva",
        category_id: '1',
        venue_type: "HOTEL",
        address: "Balkanska 1",
        city: "Beograd",
        google_maps_url: "https://goo.gl/maps/abc",
        cover_image: images.venue[2],
        gallery: images.venue,
        rating: 4.8,
        reviews_count: 60,
        price_range_symbol: '€€€',
        description: "Istorijski hotel u centru Beograda za ekskluzivne proslave.",
        features: ["Smeštaj", "Centar grada", "Spa"],
        contact: { phone: "+381601234567", email: "events@moskva.rs" },
        capacity: { min: 20, max: 100, seated: 80, cocktail: 120 },
        pricing: { per_person_from: 80, per_person_to: 130 }
    },

    // --- PHOTOGRAPHERS (New Data) ---
    {
        id: 'p-1',
        type: 'SERVICE',
        name: "Marko Jovanović Photography",
        slug: "marko-jovanovic-photo",
        category_id: '2',
        service_type: "Wedding Photographer",
        address: "Novi Beograd",
        city: "Beograd",
        cover_image: images.photo[0],
        gallery: images.photo,
        rating: 5.0,
        reviews_count: 45,
        price_range_symbol: '€€',
        description: "Spontane i emotivne fotografije. Hvatam trenutke koje ćete pamtiti zauvek.",
        features: ["Dron", "Wedding Book", "Online galerija", "2 fotografa"],
        contact: { phone: "+38161111222", email: "marko@photo.rs", instagram: "@markophoto" },
        pricing: { package_from: 800, hourly_rate: 100 },
        experience_years: 7
    },
    {
        id: 'p-2',
        type: 'SERVICE',
        name: "Studio 'Uspomena'",
        slug: "studio-uspomena",
        category_id: '2',
        service_type: "Foto & Video",
        address: "Centar",
        city: "Novi Sad",
        cover_image: images.photo[1],
        gallery: images.photo,
        rating: 4.6,
        reviews_count: 82,
        price_range_symbol: '€',
        description: "Kompletan tim za snimanje i fotografisanje vašeg venčanja.",
        features: ["Video 4K", "Same-day edit", "Dron"],
        contact: { phone: "+38163333444", email: "studio@uspomena.rs" },
        pricing: { package_from: 1200 },
        experience_years: 12
    },

    // --- MUSIC (New Data) ---
    {
        id: 'm-1',
        type: 'SERVICE',
        name: "Bend 'Noćne Ptice'",
        slug: "nocne-ptice",
        category_id: '3',
        service_type: "Bend za svadbe",
        address: "Vračar",
        city: "Beograd",
        cover_image: images.music[0],
        gallery: images.music,
        rating: 4.9,
        reviews_count: 150,
        price_range_symbol: '€€€',
        description: "Energičan bend sa širokim repertoarom od pop-rocka do narodne muzike.",
        features: ["Muški i ženski vokal", "Saksofon", "Sopstveno ozvučenje", "Dim mašina"],
        contact: { phone: "+38164555666", email: "bend@ptice.rs" },
        pricing: { package_from: 2500 },
        experience_years: 10
    },
    {
        id: 'm-2',
        type: 'SERVICE',
        name: "DJ Alex",
        slug: "dj-alex",
        category_id: '3',
        service_type: "DJ",
        address: "Palilula",
        city: "Niš",
        cover_image: images.music[1],
        gallery: images.music,
        rating: 4.8,
        reviews_count: 30,
        price_range_symbol: '€',
        description: "Moderni hitovi za urbane svadbe i punoletstva.",
        features: ["Rasveta", "Dim", "House & Pop"],
        contact: { phone: "+38165777888", email: "dj@alex.rs" },
        pricing: { package_from: 300, hourly_rate: 50 },
        experience_years: 4
    }
];
