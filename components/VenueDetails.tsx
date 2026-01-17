
import React, { useState } from 'react';
import { 
  MapPin, Users, Euro, Check, X, Star, Share2, Heart,
  Mail, Phone, Clock, ChevronLeft, ChevronRight, ShoppingBag, CheckCircle
} from 'lucide-react';
import { Vendor, ProductVendor, ServiceVendor, VenueVendor } from '../types';
import { submitInquiry } from '../services/vendorService';
import { SEOManager } from './SEOManager';

interface VenueDetailsProps {
  venue: Vendor; 
  onBack: () => void;
}

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
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
      date: '',
      count: '',
      name: '',
      contact: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
          ...formData,
          [e.target.type === 'date' ? 'date' : e.target.placeholder.includes('Br') ? 'count' : e.target.placeholder.includes('Vaše') ? 'name' : 'contact']: e.target.value
      });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await submitInquiry({
        vendorId: vendor.id,
        vendorName: vendor.name,
        date: formData.date,
        guestCount: parseInt(formData.count) || 0,
        userName: formData.name,
        contact: formData.contact
    });

    setLoading(false);
    if (success) {
        setInquirySent(true);
    } else {
        alert("Došlo je do greške. Molimo pokušajte ponovo.");
    }
  };

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex === null) return;
    const next = selectedImageIndex === vendor.gallery.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(next);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex === null) return;
    const prev = selectedImageIndex === 0 ? vendor.gallery.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(prev);
  };

  const isVenue = vendor.type === 'VENUE';
  const mapQuery = encodeURIComponent(`${vendor.address}, ${vendor.city}`);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const externalMapUrl = vendor.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const renderPriceInfo = () => {
      if (vendor.type === 'VENUE') return `od ${vendor.pricing.per_person_from}€ / os`;
      if (vendor.type === 'PRODUCT') {
          const p = vendor.pricing;
          return p.buy_price_from ? `od ${p.buy_price_from}€` : `najam od ${p.rent_price_from}€`;
      }
      return vendor.pricing.package_from 
        ? `od ${vendor.pricing.package_from}€` 
        : `${vendor.pricing.hourly_rate}€ / h`;
  };

  // --- JSON-LD Schema Generator ---
  const generateSchema = () => {
    const base = {
      "@context": "https://schema.org",
      "name": vendor.name,
      "image": vendor.gallery,
      "description": vendor.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": vendor.address,
        "addressLocality": vendor.city,
        "addressCountry": "RS"
      },
      "telephone": vendor.contact.phone,
      "priceRange": vendor.price_range_symbol,
      "url": `https://svezaproslavu.rs/vendor/${vendor.slug}`,
      "aggregateRating": vendor.reviews_count > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": vendor.rating,
        "reviewCount": vendor.reviews_count
      } : undefined
    };

    if (vendor.type === 'VENUE') {
      const v = vendor as VenueVendor;
      return { 
          ...base, 
          "@type": ["LocalBusiness", "EventVenue"],
          "amenityFeature": v.features.map(f => ({
             "@type": "LocationFeatureSpecification",
             "name": f,
             "value": true
          })),
          "maximumAttendeeCapacity": v.capacity.max
      };
    } else if (vendor.type === 'PRODUCT') {
      const p = vendor as ProductVendor;
      return { 
          ...base, 
          "@type": "Product",
          "offers": {
             "@type": "Offer",
             "price": p.pricing.buy_price_from || p.pricing.rent_price_from,
             "priceCurrency": "EUR",
             "availability": "https://schema.org/InStock",
             "url": `https://svezaproslavu.rs/vendor/${vendor.slug}`
          }
      };
    } else {
      return { ...base, "@type": "ProfessionalService" }; // Photographer, Band
    }
  };

  return (
    <article className="bg-white min-h-screen pt-36 pb-12 animate-fade-in">
      
      <SEOManager 
        title={`${vendor.name} - ${vendor.city} | Cene i Iskustva`}
        description={`${vendor.name} (${vendor.city}). ${vendor.description.substring(0, 150)}... Pogledajte cene, slike i slobodne termine.`}
        image={vendor.cover_image}
        canonical={`https://svezaproslavu.rs/vendor/${vendor.slug}`}
        type="business.business"
        jsonLd={generateSchema()}
      />

      {/* LIGHTBOX */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
            <button className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2" onClick={closeLightbox} aria-label="Zatvori galeriju">
                <X size={32} />
            </button>
            <img 
                src={vendor.gallery[selectedImageIndex] || vendor.cover_image} 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()} 
                alt={`${vendor.name} slika galerije ${selectedImageIndex + 1}`}
            />
            {vendor.gallery.length > 1 && (
                <>
                    <button className="absolute left-4 md:left-8 text-white p-2 bg-black/20 rounded-full" onClick={prevImage} aria-label="Prethodna slika"><ChevronLeft size={40} /></button>
                    <button className="absolute right-4 md:right-8 text-white p-2 bg-black/20 rounded-full" onClick={nextImage} aria-label="Sledeća slika"><ChevronRight size={40} /></button>
                </>
            )}
        </div>
      )}

      {/* Nav */}
      <nav className="container mx-auto px-6 md:px-12 py-4 border-b border-gray-100 mb-6 flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-portal-dark font-medium hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
          <ChevronLeft size={20} /> Nazad na pretragu
        </button>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center gap-2 text-sm font-medium"><Share2 size={18} /> <span className="hidden md:inline">Podeli</span></button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center gap-2 text-sm font-medium"><Heart size={18} /> <span className="hidden md:inline">Sačuvaj</span></button>
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-12">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-portal-dark mb-2">{vendor.name}</h1>
          <address className="flex flex-wrap items-center gap-4 text-sm text-gray-600 not-italic">
            <span className="flex items-center gap-1 font-medium text-portal-dark underline cursor-pointer">
              <Star size={14} fill="currentColor" /> {vendor.rating} <span className="text-gray-500 font-normal no-underline">({vendor.reviews_count} utisaka)</span>
            </span>
            <span className="hidden md:inline">·</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {vendor.address}, {vendor.city}</span>
            <span className="hidden md:inline">·</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide text-gray-600">
                {vendor.type === 'VENUE' ? vendor.venue_type : (vendor.type === 'PRODUCT' ? (vendor as ProductVendor).product_type : (vendor as ServiceVendor).service_type)}
            </span>
          </address>
        </header>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10 relative select-none">
          <div className="col-span-2 h-full relative group cursor-pointer" onClick={() => openLightbox(0)}>
            <img src={vendor.gallery[0]} alt={`Glavna slika ${vendor.name}`} className="w-full h-full object-cover transition-opacity hover:opacity-95" />
          </div>
          <div className="col-span-1 flex flex-col gap-2 h-full">
            <div className="h-1/2 overflow-hidden relative group cursor-pointer" onClick={() => openLightbox(1)}>
                <img src={vendor.gallery[1] || vendor.cover_image} alt={`Detalj ${vendor.name} 1`} className="w-full h-full object-cover transition-opacity hover:opacity-95" />
            </div>
            <div className="h-1/2 overflow-hidden relative group cursor-pointer" onClick={() => openLightbox(2)}>
                <img src={vendor.gallery[2] || vendor.cover_image} alt={`Detalj ${vendor.name} 2`} className="w-full h-full object-cover transition-opacity hover:opacity-95" />
                <button className="absolute bottom-4 right-4 bg-white/90 text-portal-dark text-xs font-bold px-4 py-2 rounded-lg pointer-events-none">
                    Pogledaj sve slike ({vendor.gallery.length})
                </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          <div className="lg:col-span-2">
            
            <section className="flex justify-between items-center py-6 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">{isVenue ? 'Kapacitet' : 'Iskustvo/Dostupnost'}</span>
                    <span className="font-semibold text-lg flex items-center gap-2">
                        {isVenue ? <Users size={20} className="text-portal-dark" /> : <Clock size={20} className="text-portal-dark" />}
                        {isVenue ? `${vendor.capacity.min} - ${vendor.capacity.max} osoba` : (vendor.type === 'PRODUCT' ? 'Dostupno' : `${(vendor as ServiceVendor).experience_years || 2}+ godina`)}
                    </span>
                </div>
                <div className="w-[1px] h-10 bg-gray-100"></div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">Cena</span>
                    <span className="font-semibold text-lg flex items-center gap-2">
                        <Euro size={20} className="text-portal-dark" /> {renderPriceInfo()}
                    </span>
                </div>
            </section>

            <section className="py-8 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-4">Opis</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vendor.description || "Nema detaljnog opisa."}</p>
            </section>

            <section className="py-8 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-6">Karakteristike</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {vendor.features?.map((feature, idx) => (
                         <div key={idx} className="flex items-center gap-3 text-gray-700"><Check size={20} className="text-primary" /> <span>{feature}</span></div>
                    ))}
                </div>
            </section>

            <section className="py-8 border-b border-gray-100">
                 <h3 className="text-xl font-bold mb-4">Lokacija</h3>
                 <p className="text-gray-600 mb-4">{vendor.address}, {vendor.city}</p>
                 <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner group">
                    <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={mapEmbedUrl} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" title={`Mapa za ${vendor.name}`}></iframe>
                    <a href={externalMapUrl} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 bg-white px-5 py-2.5 rounded-full shadow-lg font-bold text-sm text-portal-dark hover:bg-gray-50 flex items-center gap-2"><MapPin size={16} className="text-primary" /> Otvori u Google Maps</a>
                 </div>
            </section>

             <section className="py-8">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star fill="#FF385C" className="text-primary" /> Utisci gostiju
                 </h3>
                 {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((rev, i) => (
                            <div key={i} className="p-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">{rev.user.charAt(0)}</div>
                                    <div><div className="font-bold text-sm text-portal-dark">{rev.user}</div><div className="text-xs text-gray-500">{rev.date}</div></div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{rev.text}</p>
                            </div>
                        ))}
                    </div>
                 ) : <p className="text-gray-500">Budite prvi koji će ostaviti utisak.</p>}
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-36 bg-white border border-gray-200 rounded-xl shadow-floating p-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-2xl font-bold text-portal-dark">
                            {(() => {
                                if (vendor.type === 'VENUE') return `€${vendor.pricing.per_person_from}`;
                                if (vendor.type === 'PRODUCT') return `€${vendor.pricing.buy_price_from || vendor.pricing.rent_price_from}`;
                                return `€${vendor.pricing.package_from || vendor.pricing.hourly_rate}`;
                            })()}
                        </span>
                        <span className="text-gray-500 text-sm">
                             {vendor.type === 'VENUE' ? ' / po osobi' : (vendor.type === 'PRODUCT' ? ' / komad' : ' / paket')}
                        </span>
                    </div>
                </div>

                {!inquirySent ? (
                    <form onSubmit={handleInquirySubmit} className="flex flex-col gap-3">
                        {/* Form Inputs simplified for brevity */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="border border-gray-300 rounded-lg p-2"><label className="block text-[10px] font-bold text-gray-500 uppercase">Datum</label><input type="date" onChange={handleInputChange} className="w-full text-sm outline-none" required /></div>
                            <div className="border border-gray-300 rounded-lg p-2"><label className="block text-[10px] font-bold text-gray-500 uppercase">Gosti</label><input type="number" onChange={handleInputChange} placeholder="Br." className="w-full text-sm outline-none" min="1" required /></div>
                        </div>
                        <div className="border border-gray-300 rounded-lg p-2"><label className="block text-[10px] font-bold text-gray-500 uppercase">Ime</label><input type="text" onChange={handleInputChange} placeholder="Vaše ime" className="w-full text-sm outline-none" required /></div>
                        <div className="border border-gray-300 rounded-lg p-2"><label className="block text-[10px] font-bold text-gray-500 uppercase">Kontakt</label><input type="text" onChange={handleInputChange} placeholder="Email/Tel" className="w-full text-sm outline-none" required /></div>

                        <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-rose-600 transition-colors mt-2 text-lg shadow-md disabled:opacity-70 flex justify-center">
                            {loading ? <div className="animate-spin w-6 h-6 border-2 border-white rounded-full"></div> : 'Proveri dostupnost'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-green-50 text-center py-8 rounded-lg"><CheckCircle className="mx-auto text-green-600 mb-2" size={32} /><h4 className="font-bold">Upit poslat!</h4></div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between text-gray-600 text-sm"><span className="flex items-center gap-2"><Phone size={16} /> Direktno</span><a href={`tel:${vendor.contact.phone}`} className="font-medium hover:underline text-portal-dark">{vendor.contact.phone}</a></div>
                    <div className="flex justify-between text-gray-600 text-sm"><span className="flex items-center gap-2"><Mail size={16} /> Email</span><a href={`mailto:${vendor.contact.email}`} className="font-medium hover:underline text-portal-dark">Pošalji mail</a></div>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
