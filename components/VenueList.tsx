
import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Users, Euro, Filter, ChevronDown, SlidersHorizontal, ArrowUpRight, MessageCircle, Camera, Music, ShoppingBag, Car, Sparkles } from 'lucide-react';
import { categories, venueSubcategories, productSubcategories } from '../data/database'; 
import { getVendors } from '../services/vendorService';
import { Vendor, VendorType } from '../types';

interface VenueListProps {
  onVenueSelect?: (venue: Vendor) => void;
  initialCategoryId?: string | null;
  filterType?: VendorType; // 'VENUE', 'SERVICE', 'PRODUCT'
}

export const VenueList: React.FC<VenueListProps> = ({ onVenueSelect, initialCategoryId, filterType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [saleOption, setSaleOption] = useState<'all' | 'SALE' | 'RENT'>('all'); // New filter for Products
  const [showFilters, setShowFilters] = useState(false);
  
  // State for data
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync with prop
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    } else {
        setSelectedCategoryId('all');
    }
  }, [initialCategoryId]);

  // Fetch Data
  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          const data = await getVendors(filterType, selectedCategoryId === 'all' || filterType === 'VENUE' || filterType === 'PRODUCT' ? undefined : selectedCategoryId);
          setVendors(data);
          setLoading(false);
      };
      fetchData();
  }, [filterType, selectedCategoryId]);

  // Determine which categories are available based on filterType
  const availableCategories = useMemo(() => {
      if (filterType === 'VENUE') return venueSubcategories;
      if (filterType === 'PRODUCT') return productSubcategories;
      return categories.filter(cat => cat.slug !== 'venues');
  }, [filterType]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      // 0. Strict Type Filter
      if (filterType && vendor.type !== filterType) {
          return false;
      }

      // 1. Filter by Text
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            vendor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vendor.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Filter by Category / Type
      let matchesCategory = true;
      if (selectedCategoryId !== 'all') {
          if (filterType === 'VENUE') {
              // Fuzzy matching for Venue Subtypes
              const vType = (vendor as any).venue_type || '';
              if (selectedCategoryId === 'Svečana sala') {
                   matchesCategory = ['EVENT CENTAR', 'EVENT HALL', 'SVEČANA SALA'].some(t => vType.includes(t));
              } else if (selectedCategoryId === 'Hotel') {
                   matchesCategory = vType.includes('HOTEL');
              } else if (selectedCategoryId === 'Splav') {
                   matchesCategory = vType.includes('SPLAV');
              } else if (selectedCategoryId === 'Restoran') {
                   matchesCategory = vType.includes('RESTORAN');
              } else {
                  matchesCategory = vType.toLowerCase().includes(selectedCategoryId.toLowerCase());
              }
          } else if (filterType === 'PRODUCT') {
             // Product Category Match
             matchesCategory = (vendor as any).category_id === selectedCategoryId;
          } else {
              // Service Category Match
              matchesCategory = vendor.category_id === selectedCategoryId;
          }
      }
      
      // 3. Filter by Capacity (Only for VENUES)
      let matchesCapacity = true;
      if (minCapacity !== '' && vendor.type === 'VENUE') {
        matchesCapacity = vendor.capacity.max >= parseInt(minCapacity);
      }

      // 4. Filter by Price 
      let matchesPrice = true;
      if (maxPrice !== '') {
        const max = parseInt(maxPrice);
        if (vendor.type === 'VENUE') {
             matchesPrice = vendor.pricing.per_person_from <= max;
        } else if (vendor.type === 'SERVICE') {
             if (vendor.pricing.package_from) {
                matchesPrice = vendor.pricing.package_from <= max;
             }
        } else if (vendor.type === 'PRODUCT') {
            const buy = vendor.pricing.buy_price_from || 999999;
            const rent = vendor.pricing.rent_price_from || 999999;
            matchesPrice = buy <= max || rent <= max;
        }
      }

      // 5. Filter by Sale Option (Only for PRODUCTS)
      let matchesSaleOption = true;
      if (filterType === 'PRODUCT' && saleOption !== 'all') {
          matchesSaleOption = (vendor as any).sale_options?.includes(saleOption);
      }

      return matchesSearch && matchesCategory && matchesCapacity && matchesPrice && matchesSaleOption;
    });
  }, [vendors, searchTerm, selectedCategoryId, minCapacity, maxPrice, filterType, saleOption]);

  // Helper to get display name
  const getActiveCategoryName = () => {
      if (selectedCategoryId === 'all') return null;
      if (filterType === 'VENUE') return venueSubcategories.find(c => c.id === selectedCategoryId)?.name;
      if (filterType === 'PRODUCT') return productSubcategories.find(c => c.id === selectedCategoryId)?.name;
      return categories.find(c => c.id === selectedCategoryId)?.name;
  };
  const activeCategoryName = getActiveCategoryName();
  
  // Text configuration based on filterType
  const pageTitle = filterType === 'VENUE' ? 'Pronađite idealan prostor' : (filterType === 'SERVICE' ? 'Profesionalne usluge' : 'Katalog Proizvoda');
  const pageSubtitle = loading 
    ? 'Učitavanje...' 
    : (filterType === 'VENUE' 
        ? `Pronađeno ${filteredVendors.length} restorana i sala` 
        : `Pronađeno ${filteredVendors.length} rezultata`);
  
  const placeholderText = filterType === 'VENUE' ? "Ime prostora, grad..." : (filterType === 'PRODUCT' ? "Venčanica, odelo..." : "Fotograf, bend, grad...");
  const pricePlaceholder = filterType === 'VENUE' ? "Max € po osobi" : "Max €";
  const categoryLabel = filterType === 'VENUE' ? "Tip prostora" : (filterType === 'PRODUCT' ? "Tip proizvoda" : "Kategorija usluge");

  const resetFilters = () => {
    setSearchTerm(''); 
    setSelectedCategoryId('all'); 
    setMinCapacity(''); 
    setMaxPrice('');
    setSaleOption('all');
  };

  const getServiceIcon = (categoryId: string) => {
    switch(categoryId) {
        case '2': return <Camera size={14} className="text-primary"/>;
        case '3': return <Music size={14} className="text-primary"/>;
        case '9': return <Car size={14} className="text-primary"/>;
        case '10': return <Sparkles size={14} className="text-primary"/>;
        default: return <Music size={14} className="text-primary"/>; // Fallback
    }
  };

  return (
    <div className="pt-36 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Main Layout Grid: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden w-full mb-4">
             <button 
                className="flex items-center justify-between bg-white w-full px-4 py-3 rounded-xl shadow-sm border border-gray-200 text-portal-dark font-medium"
                onClick={() => setShowFilters(!showFilters)}
             >
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    <span>Filteri i pretraga</span>
                </div>
                {showFilters ? <ChevronDown className="rotate-180 transition-transform" /> : <ChevronDown className="transition-transform" />}
             </button>
          </div>

          {/* LEFT SIDEBAR - Filters */}
          <aside className={`w-full lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-36">
                
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-portal-dark flex items-center gap-2">
                        <Filter size={20} /> Filteri
                    </h3>
                    {(searchTerm || selectedCategoryId !== 'all' || minCapacity || maxPrice || saleOption !== 'all') && (
                        <button 
                            onClick={resetFilters}
                            className="text-xs text-primary font-semibold hover:underline"
                        >
                            Obriši sve
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Search Input */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Pretraga</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder={placeholderText} 
                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Select */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{categoryLabel}</label>
                        <div className="relative">
                            <select 
                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer text-sm"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            >
                            <option value="all">Sve</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Product Options (Buy/Rent) */}
                    {filterType === 'PRODUCT' && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Opcija</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSaleOption('all')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${saleOption === 'all' ? 'bg-portal-dark text-white border-portal-dark' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    Sve
                                </button>
                                <button 
                                    onClick={() => setSaleOption('SALE')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${saleOption === 'SALE' ? 'bg-portal-dark text-white border-portal-dark' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    Kupovina
                                </button>
                                <button 
                                    onClick={() => setSaleOption('RENT')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${saleOption === 'RENT' ? 'bg-portal-dark text-white border-portal-dark' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    Najam
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Capacity Filter (Conditional) */}
                    {filterType === 'VENUE' && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Broj gostiju</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                type="number" 
                                placeholder="Min. gostiju" 
                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                value={minCapacity}
                                onChange={(e) => setMinCapacity(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Price Filter */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Budžet</label>
                        <div className="relative">
                            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="number" 
                                placeholder={pricePlaceholder}
                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
             </div>
          </aside>

          {/* RIGHT CONTENT - Results */}
          <main className="flex-1 w-full">
            
            {/* Header Area */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-portal-dark mb-2">
                    {activeCategoryName ? activeCategoryName : pageTitle}
                </h1>
                <p className="text-portal-gray">{pageSubtitle}</p>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                    <div 
                    key={vendor.id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-floating transition-all duration-300 group overflow-hidden border border-transparent hover:border-gray-100 flex flex-col h-full cursor-pointer"
                    onClick={() => onVenueSelect && onVenueSelect(vendor)}
                    >
                    
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                        <img 
                        src={vendor.cover_image} 
                        alt={vendor.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-portal-dark uppercase tracking-wide">
                        {vendor.type === 'VENUE' ? vendor.venue_type : (vendor.type === 'PRODUCT' ? (vendor as any).product_type : (vendor as any).service_type)}
                        </div>
                        
                        {/* Price Tag Logic */}
                        <div className="absolute bottom-3 right-3 bg-portal-dark text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {vendor.type === 'VENUE' 
                            ? `od ${vendor.pricing.per_person_from}€ / os` 
                            : (vendor.type === 'PRODUCT' 
                                ? (vendor.pricing.buy_price_from ? `${vendor.pricing.buy_price_from}€` : `Najam ${vendor.pricing.rent_price_from}€`) 
                                : (vendor.pricing.package_from ? `od ${vendor.pricing.package_from}€` : `${vendor.pricing.hourly_rate}€ / h`)
                              )
                        }
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-portal-dark text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {vendor.name}
                        </h3>
                        </div>

                        <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-3">
                        <MapPin size={16} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{vendor.address}, {vendor.city}</span>
                        </div>

                        {/* Features / Capacity Line */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 mt-auto">
                        
                        {/* Icon logic based on type */}
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs">
                            {vendor.type === 'VENUE' ? (
                                <>
                                    <Users size={14} className="text-primary" />
                                    <span>{vendor.capacity.min} - {vendor.capacity.max}</span>
                                </>
                            ) : vendor.type === 'PRODUCT' ? (
                                <>
                                    <ShoppingBag size={14} className="text-primary" />
                                    <span>{(vendor as any).sale_options?.includes('SALE') && (vendor as any).sale_options?.includes('RENT') ? 'Prodaja i Najam' : ((vendor as any).sale_options?.includes('RENT') ? 'Samo Najam' : 'Prodaja')}</span>
                                </>
                            ) : (
                                <>
                                    {getServiceIcon(vendor.category_id)}
                                    <span>{vendor.features[0] || 'Profi oprema'}</span>
                                </>
                            )}
                        </div>

                        {vendor.reviews_count > 0 && (
                            <div className="flex items-center gap-1.5">
                                <MessageCircle size={14} className="text-gray-400" />
                                <span>{vendor.reviews_count}</span>
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
            )}

            {!loading && filteredVendors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 mt-2">
                <div className="inline-block p-6 rounded-full bg-gray-50 mb-4">
                <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Nema rezultata</h3>
                <p className="text-gray-500">Pokušajte da promenite filtere ili termin pretrage.</p>
                <button 
                onClick={resetFilters}
                className="mt-6 text-primary font-semibold hover:underline"
                >
                Poništi filtere
                </button>
            </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};
