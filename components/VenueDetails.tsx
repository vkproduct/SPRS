
import React, { useState } from 'react';
import { 
  MapPin, Users, Euro, Check, X, Music, Camera, Car, 
  Utensils, Calendar, ChevronLeft, Star, Share2, Heart,
  Mail, Phone
} from 'lucide-react';
import { Venue } from '../types';

interface VenueDetailsProps {
  venue: Venue;
  onBack: () => void;
}

// Mock generic images for the gallery since we don't have real ones in JSON
const galleryImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?auto=format&fit=crop&w=800&q=80"
];

// Mock reviews generator
const generateReviews = (count: number | null) => {
  const reviewCount = count || 0;
  if (reviewCount === 0) return [];
  
  return [
    { user: "Ana Marković", date: "Oktobar 2023", rating: 5, text: "Sve je bilo savršeno! Hrana, usluga i ambijent su nadmašili naša očekivanja." },
    { user: "Stefan Jović", date: "Septembar 2023", rating: 4.8, text: "Odlična organizacija i prelep prostor. Preporuka za sve mladence." },
    { user: "Milica Petrović", date: "Avgust 2023", rating: 5, text: "Najlepši dan u životu zahvaljujući profesionalnom osoblju." }
  ];
};

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue, onBack }) => {
  const reviews = generateReviews(venue.comments_count);
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="bg-white min-h-screen pt-20 pb-12 animate-fade-in">
      {/* Navbar Placeholder / Back Button */}
      <div className="container mx-auto px-6 md:px-12 py-4 border-b border-gray-100 mb-6 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-portal-dark font-medium hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} /> Nazad na pretragu
        </button>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center gap-2 text-sm font-medium">
                <Share2 size={18} /> <span className="hidden md:inline">Podeli</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center gap-2 text-sm font-medium">
                <Heart size={18} /> <span className="hidden md:inline">Sačuvaj</span>
            </button>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-portal-dark mb-2">{venue.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1 font-medium text-portal-dark underline cursor-pointer">
              <Star size={14} fill="currentColor" /> 
              {reviews.length > 0 ? "4.9" : "Novi prostor"}
              <span className="text-gray-500 font-normal no-underline">({venue.comments_count || 0} utisaka)</span>
            </span>
            <span className="hidden md:inline">·</span>
            <span className="flex items-center gap-1">
                <MapPin size={14} /> {venue.address} {venue.municipality ? `, ${venue.municipality}` : ''}
            </span>
            <span className="hidden md:inline">·</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide text-gray-600">
                {venue.venue_type}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10 relative">
          <div className="col-span-2 h-full">
            <img src={galleryImages[0]} alt={venue.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
          </div>
          <div className="col-span-1 flex flex-col gap-2 h-full">
            <div className="h-1/2 overflow-hidden">
                <img src={galleryImages[1]} alt="Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="h-1/2 overflow-hidden relative">
                <img src={galleryImages[2]} alt="Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
                <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-portal-dark text-xs font-bold px-4 py-2 rounded-lg shadow-md border border-gray-200">
                    Pogledaj sve slike
                </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            
            {/* Quick Stats Bar */}
            <div className="flex justify-between items-center py-6 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">Kapacitet</span>
                    <span className="font-semibold text-lg flex items-center gap-2">
                        <Users size={20} className="text-portal-dark" /> 
                        {venue.capacity_min} - {venue.capacity_max} osoba
                    </span>
                </div>
                <div className="w-[1px] h-10 bg-gray-100"></div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">Cena menija</span>
                    <span className="font-semibold text-lg flex items-center gap-2">
                        <Euro size={20} className="text-portal-dark" /> 
                        {venue.price_from_eur ? `od ${venue.price_from_eur}€` : 'Na upit'} 
                        {venue.price_to_eur && ` - ${venue.price_to_eur}€`}
                    </span>
                </div>
                <div className="w-[1px] h-10 bg-gray-100"></div>
                 <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">Tip prostora</span>
                    <span className="font-semibold text-lg capitalize">
                        {venue.venue_type.toLowerCase()}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-4">O prostoru</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {venue.description || "Ovaj prostor još uvek nema detaljan opis. Kontaktirajte vlasnika za više informacija o ambijentu, uslugama i dostupnim terminima."}
                </p>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-6">Šta ovaj prostor nudi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {venue.amenities ? (
                        <>
                             <div className="flex items-center gap-3 text-gray-700">
                                <Music size={20} />
                                <span>Muzika: <strong>{venue.amenities.music || 'Po dogovoru'}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Camera size={20} />
                                <span>Fotograf: <strong>{venue.amenities.photographer || 'Po dogovoru'}</strong></span>
                            </div>
                             <div className="flex items-center gap-3 text-gray-700">
                                <Utensils size={20} />
                                <span>Dekoracija: <strong>{venue.amenities.decoration || 'Po dogovoru'}</strong></span>
                            </div>
                             <div className="flex items-center gap-3 text-gray-700">
                                <Car size={20} />
                                <span>Parking: <strong>{venue.amenities.parking ? 'Obezbeđen' : 'Nije navedeno'}</strong></span>
                            </div>
                             <div className="flex items-center gap-3 text-gray-700">
                                <Check size={20} />
                                <span>Popust za mladence: <strong>{venue.amenities.discounts_for_newlyweds ? 'Dostupan' : 'Nema'}</strong></span>
                            </div>
                             <div className="flex items-center gap-3 text-gray-700">
                                <Check size={20} />
                                <span>Apartman: <strong>{venue.amenities.bridal_apartment ? 'Uključen' : 'Nema'}</strong></span>
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-500 italic">Detalji o uslugama nisu dostupni.</span>
                    )}
                </div>
            </div>

            {/* Location (Static Map Placeholder) */}
            <div className="py-8 border-b border-gray-100">
                 <h3 className="text-xl font-bold mb-4">Lokacija</h3>
                 <p className="text-gray-600 mb-4">{venue.address}</p>
                 <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <img 
                        src="https://www.google.com/maps/vt/data=lyt1K-p8yiM" 
                        alt="Map placeholder" 
                        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" 
                    />
                    <a 
                        href={venue.google_maps_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute bg-white px-6 py-3 rounded-full shadow-lg font-bold text-portal-dark hover:bg-gray-50 transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <MapPin size={18} className="text-primary" /> Otvori u Google Maps
                    </a>
                 </div>
            </div>

             {/* Reviews */}
             <div className="py-8">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star fill="#FF385C" className="text-primary" /> 
                    {venue.comments_count ? "Utisci gostiju" : "Nema recenzija"}
                    <span className="text-gray-400 font-normal text-lg">{venue.comments_count ? `(${venue.comments_count})` : ''}</span>
                 </h3>
                 
                 {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((rev, i) => (
                            <div key={i} className="p-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        {rev.user.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-portal-dark">{rev.user}</div>
                                        <div className="text-xs text-gray-500">{rev.date}</div>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {rev.text}
                                </p>
                            </div>
                        ))}
                    </div>
                 ) : (
                     <div className="bg-gray-50 p-6 rounded-xl text-center">
                         <p className="text-gray-500">Budite prvi koji će ostaviti utisak o ovom prostoru.</p>
                     </div>
                 )}
                 
                 {reviews.length > 0 && (
                     <button className="mt-6 border border-gray-900 rounded-lg px-6 py-3 font-semibold text-portal-dark hover:bg-gray-50 transition-colors">
                         Prikaži svih {venue.comments_count} utisaka
                     </button>
                 )}
            </div>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-xl shadow-floating p-6">
                
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-2xl font-bold text-portal-dark">
                            {venue.price_from_eur ? `€${venue.price_from_eur}` : 'Na upit'}
                        </span>
                        {venue.price_from_eur && <span className="text-gray-500 text-sm"> / po osobi</span>}
                    </div>
                    <div className="text-sm text-gray-500 underline">
                        {venue.comments_count || 0} utisaka
                    </div>
                </div>

                {!inquirySent ? (
                    <form onSubmit={handleInquirySubmit} className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="border border-gray-300 rounded-lg p-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Datum</label>
                                <input type="date" className="w-full text-sm outline-none text-portal-dark" required />
                            </div>
                            <div className="border border-gray-300 rounded-lg p-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Gosti</label>
                                <input type="number" placeholder="Br. ljudi" className="w-full text-sm outline-none text-portal-dark" min={venue.capacity_min} max={venue.capacity_max} required />
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Ime i Prezime</label>
                            <input type="text" placeholder="Vaše ime" className="w-full text-sm outline-none text-portal-dark" required />
                        </div>
                        
                        <div className="border border-gray-300 rounded-lg p-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Email / Telefon</label>
                            <input type="text" placeholder="Kontakt podaci" className="w-full text-sm outline-none text-portal-dark" required />
                        </div>

                        <button type="submit" className="bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-rose-600 transition-colors mt-2 text-lg shadow-md">
                            Proveri dostupnost
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-1">Nećete biti naplaćeni odmah.</p>
                    </form>
                ) : (
                    <div className="bg-green-50 text-center py-8 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Check size={24} />
                        </div>
                        <h4 className="font-bold text-portal-dark mb-1">Upit poslat!</h4>
                        <p className="text-sm text-gray-600 mb-4">Menadžer prostora će vas kontaktirati uskoro.</p>
                        <button 
                            onClick={() => setInquirySent(false)}
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            Pošalji novi upit
                        </button>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span className="flex items-center gap-2"><Phone size={16} /> Direktno</span>
                        <a href="tel:+381601234567" className="font-medium hover:underline text-portal-dark">+381 60 123 4567</a>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span className="flex items-center gap-2"><Mail size={16} /> Email</span>
                        <a href="mailto:info@prostor.rs" className="font-medium hover:underline text-portal-dark">Pošalji mail</a>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
