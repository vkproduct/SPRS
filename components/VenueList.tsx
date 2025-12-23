
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Users, Euro, Filter, ChevronDown, SlidersHorizontal, ArrowUpRight, MessageCircle } from 'lucide-react';
import { venuesData } from '../data/venues';
import { Venue } from '../types';

// Placeholder images since JSON doesn't have them
const placeholderImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507503741548-5c421e427d88?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507915977619-6ccfe8003ae6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80"
];

const getImageForVenue = (index: number) => {
  return placeholderImages[index % placeholderImages.length];
};

interface VenueListProps {
  onVenueSelect?: (venue: Venue) => void;
}

export const VenueList: React.FC<VenueListProps> = ({ onVenueSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Svi tipovi');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique venue types
  const venueTypes = ['Svi tipovi', ...new Set(venuesData.map(v => v.venue_type))];

  const filteredVenues = useMemo(() => {
    return venuesData.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            venue.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'Svi tipovi' || venue.venue_type === selectedType;
      
      const matchesCapacity = minCapacity === '' || venue.capacity_max >= parseInt(minCapacity);
      
      // If venue price is null, we assume it matches since we don't know the upper limit, 
      // or we could strict filter. Here flexible is better.
      const matchesPrice = maxPrice === '' || (venue.price_from_eur !== null && venue.price_from_eur <= parseInt(maxPrice));

      return matchesSearch && matchesType && matchesCapacity && matchesPrice;
    });
  }, [searchTerm, selectedType, minCapacity, maxPrice]);

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-portal-dark mb-2">Restorani i Sale za Proslave</h1>
          <p className="text-portal-gray">Pronađeno {filteredVenues.length} prostora u Srbiji</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 sticky top-24 z-30">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Pretraži po imenu ili adresi..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-3 flex-wrap flex-1 justify-end">
              
              <div className="relative group">
                <select 
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary cursor-pointer text-sm hover:border-gray-400 transition-colors"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {venueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Min. gostiju" 
                  className="w-32 py-2.5 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                />
              </div>

              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Max € po osobi" 
                  className="w-36 py-2.5 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden flex items-center gap-2 bg-portal-dark text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} /> Filteri
            </button>
          </div>

          {/* Mobile Filters Expanded */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
               <select 
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {venueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Minimalan broj gostiju" 
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Maksimalna cena (€)" 
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVenues.map((venue, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm hover:shadow-floating transition-all duration-300 group overflow-hidden border border-transparent hover:border-gray-100 flex flex-col h-full cursor-pointer"
              onClick={() => onVenueSelect && onVenueSelect(venue)}
            >
              
              {/* Image Area */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                <img 
                  src={getImageForVenue(index)} 
                  alt={venue.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-portal-dark uppercase tracking-wide">
                  {venue.venue_type}
                </div>
                {venue.price_from_eur && (
                   <div className="absolute bottom-3 right-3 bg-portal-dark text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                     od {venue.price_from_eur}€
                   </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-portal-dark text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                     {venue.name}
                   </h3>
                </div>

                <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{venue.address}</span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 mt-auto">
                   <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Users size={16} className="text-primary" />
                      <span>{venue.capacity_min} - {venue.capacity_max}</span>
                   </div>
                   {venue.comments_count !== null && (
                     <div className="flex items-center gap-1.5">
                        <MessageCircle size={16} className="text-gray-400" />
                        <span>{venue.comments_count}</span>
                     </div>
                   )}
                </div>

                <button 
                  className="w-full mt-2 py-2.5 border border-gray-200 rounded-lg text-center text-sm font-semibold text-portal-dark hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                >
                  Pogledaj detalje <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
               <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nema rezultata</h3>
            <p className="text-gray-500">Pokušajte da promenite filtere ili termin pretrage.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedType('Svi tipovi'); setMinCapacity(''); setMaxPrice('')}}
              className="mt-6 text-primary font-semibold hover:underline"
            >
              Poništi filtere
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
