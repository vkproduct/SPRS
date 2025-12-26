
import React, { useState } from 'react';
import { 
  MapPin, Users, Euro, Check, X, Music, Camera, Car, 
  Utensils, Calendar, ChevronLeft, Star, Share2, Heart,
  Mail, Phone, Clock
} from 'lucide-react';
import { Vendor } from '../types';

interface VenueDetailsProps {
  venue: Vendor; // Using 'venue' prop name to minimize parent changes, but types are updated
  onBack: () => void;
}

// Mock reviews generator
const generateReviews = (count: number) => {
  if (count === 0) return [];
  return [
    { user: "Ana Marković", date: "Oktobar 2023", rating: 5, text: "Sve je bilo savršeno! Usluga i profesionalnost na najvišem nivou." },
    { user: "Stefan Jović", date: "Septembar 2023", rating: 4.8, text: "Odlična saradnja. Preporuka za sve mladence." },
  ];
};

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue: vendor, onBack }) => {
  const reviews = generateReviews(vendor.reviews_count);
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  const isVenue = vendor.type === 'VENUE';

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
          <h1 className="text-3xl md:text-4xl font-bold text-portal-dark mb-2">{vendor.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1 font-medium text-portal-dark underline cursor-pointer">
              <Star size={14} fill="currentColor" /> 
              {vendor.rating}
              <span className="text-gray-500 font-normal no-underline">({vendor.reviews_count} utisaka)</span>
            </span>
            <span className="hidden md:inline">·</span>
            <span className="flex items-center gap-1">
                <MapPin size={14} /> {vendor.address}, {vendor.city}
            </span>
            <span className="hidden md:inline">·</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide text-gray-600">
                {isVenue ? vendor.venue_type : vendor.service_type}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10 relative">
          <div className="col-span-2 h-full">
            <img src={vendor.gallery[0]} alt={vendor.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
          </div>
          <div className="col-span-1 flex flex-col gap-2 h-full">
            <div className="h-1/2 overflow-hidden">
                <img src={vendor.gallery[1] || vendor.cover_image} alt="Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="h-1/2 overflow-hidden relative">
                <img src={vendor.gallery[2] || vendor.cover_image} alt="Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
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
                    <span className="text-gray-500 text-sm">{isVenue ? 'Kapacitet' : 'Iskustvo'}</span>
                    <span className="font-semibold text-lg flex items-center gap-2">
                        {isVenue ? <Users size={20} className="text-portal-dark" /> : <Clock size={20} className="text-portal-dark" />}
                        {isVenue 
                            ? `${vendor.capacity.min} - ${vendor.capacity.max} osoba`
                            : `${(vendor as any).experience_years || 2}+ godina`
                        }
                    </span>
                </div>
                <div className="w-[1px] h-10 bg-gray-100"></div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">Cena</span>
                    <span className="font-semibold text-lg flex items-center gap-2">
                        <Euro size={20} className="text-portal-dark" /> 
                        {isVenue 
                             ? `od ${vendor.pricing.per_person_from}€ / os` 
                             : (vendor.pricing.package_from 
                                  ? `od ${vendor.pricing.package_from}€` 
                                  : `${vendor.pricing.hourly_rate}€ / h`)
                        }
                    </span>
                </div>
                <div className="w-[1px] h-10 bg-gray-100"></div>
                 <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">Tip</span>
                    <span className="font-semibold text-lg capitalize">
                        {isVenue ? 'Prostor' : 'Usluga'}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-4">Opis</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {vendor.description || "Nema detaljnog opisa."}
                </p>
            </div>

            {/* Amenities / Features */}
            <div className="py-8 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-6">Karakteristike</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {vendor.features && vendor.features.length > 0 ? (
                        vendor.features.map((feature, idx) => (
                             <div key={idx} className="flex items-center gap-3 text-gray-700">
                                <Check size={20} className="text-primary" />
                                <span>{feature}</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500 italic">Nema dodatnih karakteristika.</span>
                    )}
                </div>
            </div>

            {/* Location (Static Map Placeholder) */}
            <div className="py-8 border-b border-gray-100">
                 <h3 className="text-xl font-bold mb-4">Lokacija</h3>
                 <p className="text-gray-600 mb-4">{vendor.address}, {vendor.city}</p>
                 <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <img 
                        src="https://www.google.com/maps/vt/data=lyt1K-p8yiM" 
                        alt="Map placeholder" 
                        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" 
                    />
                    {vendor.google_maps_url && (
                        <a 
                            href={vendor.google_maps_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute bg-white px-6 py-3 rounded-full shadow-lg font-bold text-portal-dark hover:bg-gray-50 transition-transform hover:scale-105 flex items-center gap-2"
                        >
                            <MapPin size={18} className="text-primary" /> Otvori u Google Maps
                        </a>
                    )}
                 </div>
            </div>

             {/* Reviews */}
             <div className="py-8">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star fill="#FF385C" className="text-primary" /> 
                    {vendor.reviews_count ? "Utisci gostiju" : "Nema recenzija"}
                    <span className="text-gray-400 font-normal text-lg">{vendor.reviews_count ? `(${vendor.reviews_count})` : ''}</span>
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
                         <p className="text-gray-500">Budite prvi koji će ostaviti utisak o ovom profilu.</p>
                     </div>
                 )}
            </div>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-xl shadow-floating p-6">
                
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-2xl font-bold text-portal-dark">
                             {isVenue 
                             ? `€${vendor.pricing.per_person_from}` 
                             : `€${vendor.pricing.package_from || vendor.pricing.hourly_rate}`
                            }
                        </span>
                        <span className="text-gray-500 text-sm">
                             {isVenue ? ' / po osobi' : (vendor.pricing.package_from ? ' / paket' : ' / sat')}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 underline">
                        {vendor.reviews_count || 0} utisaka
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
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">
                                    {isVenue ? 'Gosti' : 'Sati'}
                                </label>
                                <input type="number" placeholder="Br." className="w-full text-sm outline-none text-portal-dark" min="1" required />
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
                        <p className="text-sm text-gray-600 mb-4">Isporučilac usluge će vas kontaktirati uskoro.</p>
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
                        <a href={`tel:${vendor.contact.phone}`} className="font-medium hover:underline text-portal-dark">{vendor.contact.phone}</a>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span className="flex items-center gap-2"><Mail size={16} /> Email</span>
                        <a href={`mailto:${vendor.contact.email}`} className="font-medium hover:underline text-portal-dark">Pošalji mail</a>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
