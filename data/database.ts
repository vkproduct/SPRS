
import { Vendor, VendorCategory } from '../types';

// 1. Categories Table (Main Categories)
export const categories: VendorCategory[] = [
  { id: '1', slug: 'venues', name: 'Restorani i Sale', iconName: 'Home', count: 120, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { id: '2', slug: 'photographers', name: 'Fotografi', iconName: 'Camera', count: 85, image: 'https://images.unsplash.com/photo-1623783356340-95375aac85ce?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '3', slug: 'music', name: 'Muzika', iconName: 'Music', count: 64, image: 'https://images.unsplash.com/photo-1617136778830-e15aea8ba3f2?q=80&w=1805&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '4', slug: 'cakes', name: 'Torte', iconName: 'Utensils', count: 45, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80' },
  { id: '5', slug: 'decoration', name: 'Dekoracija', iconName: 'Flower', count: 32, image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80' },
  { id: '6', slug: 'videography', name: 'Videografi', iconName: 'Video', count: 42, image: 'https://images.unsplash.com/photo-1611784237436-6a546dce9a89?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '7', slug: 'hosts', name: 'Voditelji', iconName: 'Mic', count: 28, image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&w=800&q=80' },
  { id: '8', slug: 'beauty', name: 'Šminka i Frizura', iconName: 'Sparkles', count: 56, image: 'https://images.unsplash.com/photo-1522337360705-2b1cc3d549e6?auto=format&fit=crop&w=800&q=80' },
];

// Specific Venue Types for the Filter Dropdown
export const venueSubcategories = [
    { id: 'Restoran', name: 'Restoran' },
    { id: 'Svečana sala', name: 'Svečana sala (Banket)' }, // Maps to Event Centar/Hall
    { id: 'Šator', name: 'Šator' },
    { id: 'Veranda', name: 'Veranda' },
    { id: 'Hotel', name: 'Restoran u hotelu' },
    { id: 'Klub', name: 'Seoski klub / Etnoselo' },
    { id: 'Loft', name: 'Loft' },
    { id: 'Splav', name: 'Splav / Jaht klub' },
    { id: 'Vila', name: 'Vila / Osobnik' }
];

// Specific Product Types
export const productSubcategories = [
    { id: 'Venčanice', name: 'Venčanice', image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80' },
    { id: 'Odela', name: 'Muška Odela', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
    { id: 'Burme', name: 'Burme i Nakit', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' },
    { id: 'Cipele', name: 'Obuća', image: 'https://images.unsplash.com/photo-1549643444-0985223c6838?auto=format&fit=crop&w=800&q=80' },
    { id: 'Pozivnice', name: 'Pozivnice', image: 'https://images.unsplash.com/photo-1551642875-97e3a985df77?auto=format&fit=crop&w=800&q=80' },
    { id: 'Pokloni', name: 'Pokloni za goste', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80' },
    { id: 'Dekoracija', name: 'Dekoracija (Prodaja)', image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80' },
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
    ],
    dresses: [
        "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1549416878-b9ca95e282de?auto=format&fit=crop&w=1200&q=80"
    ],
    rings: [
         "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"
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

    // --- PHOTOGRAPHERS ---
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

    // --- MUSIC ---
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
    
    // --- PRODUCTS (New Data) ---
    {
        id: 'prod-1',
        type: 'PRODUCT',
        name: "Salon Venčanica 'Bella'",
        slug: "salon-bella",
        category_id: 'Venčanice', // Matches subcategory ID
        product_type: "Venčanice",
        address: "Terazije 12",
        city: "Beograd",
        cover_image: images.dresses[0],
        gallery: images.dresses,
        rating: 4.9,
        reviews_count: 220,
        price_range_symbol: '€€',
        description: "Najnoviji modeli svetskih dizajnera. Pronađite haljinu iz snova.",
        features: ["Vera Wang", "Pronovias", "Šivenje po meri", "Besplatne probe"],
        sale_options: ['SALE', 'RENT'],
        contact: { phone: "+38162123456", email: "info@bella.rs" },
        pricing: { buy_price_from: 1200, rent_price_from: 400 }
    },
    {
        id: 'prod-2',
        type: 'PRODUCT',
        name: "Zlatara 'Infinitum'",
        slug: "zlatara-infinitum",
        category_id: 'Burme',
        product_type: "Burme",
        address: "Zmaj Jovina 4",
        city: "Novi Sad",
        cover_image: images.rings[0],
        gallery: images.rings,
        rating: 4.8,
        reviews_count: 55,
        price_range_symbol: '€€',
        description: "Ručno rađene burme od belog, žutog i roze zlata sa dijamantima.",
        features: ["Doživotna garancija", "Besplatno graviranje", "Sertifikat"],
        sale_options: ['SALE'],
        contact: { phone: "+38121123456", email: "shop@infinitum.rs" },
        pricing: { buy_price_from: 300 }
    },
    {
        id: 'prod-3',
        type: 'PRODUCT',
        name: "Magic Dress Atelier",
        slug: "magic-dress",
        category_id: 'Venčanice',
        product_type: "Venčanice",
        address: "Bulevar Nemanjića 25",
        city: "Niš",
        cover_image: images.dresses[1],
        gallery: images.dresses,
        rating: 4.7,
        reviews_count: 34,
        price_range_symbol: '€',
        description: "Pristupačne i moderne venčanice za mlade koje znaju šta žele.",
        features: ["Rasprodaja", "Outlet", "Hemijsko čišćenje"],
        sale_options: ['RENT'],
        contact: { phone: "+38163999888", email: "nis@magicdress.rs" },
        pricing: { rent_price_from: 250 }
    }
];
