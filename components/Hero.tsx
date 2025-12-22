import React from 'react';
import { Search } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="hero relative pt-36 pb-12 md:pt-44 md:pb-20">
      <div className="hero__container container mx-auto px-6 md:px-12">
        
        {/* Search Bar - Airbnb Style */}
        <div className="hero__search-bar hidden md:flex justify-center mb-10">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 flex items-center p-2 max-w-4xl w-full">
            
            <div className="hero__search-item flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group">
              <label className="block text-xs font-bold text-portal-dark">Gde</label>
              <input 
                type="text" 
                placeholder="Beograd, Novi Sad, Niš..." 
                className="w-full bg-transparent outline-none text-sm text-portal-dark placeholder-gray-500 truncate"
              />
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="hero__search-item flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group">
              <label className="block text-xs font-bold text-portal-dark">Povod</label>
              <div className="text-sm text-gray-500 truncate">Venčanje, Rođendan...</div>
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="hero__search-item flex-[1.5] pl-8 pr-2 py-2 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-portal-dark">Broj gostiju</label>
                <div className="text-sm text-gray-500 truncate">Dodajte broj ljudi</div>
              </div>
              <div className="hero__search-button bg-primary text-white p-4 rounded-full hover:bg-rose-600 transition-colors shadow-sm">
                <Search size={20} strokeWidth={2.5} />
              </div>
            </div>

          </div>
        </div>

        {/* Hero Image Card */}
        <div className="hero__image-card relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] w-full shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Celebration background" 
            className="w-full h-full object-cover"
          />
          <div className="hero__overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
            <h1 className="hero__title text-4xl md:text-6xl font-bold mb-4 max-w-3xl leading-tight">
              Organizujte proslavu za pamćenje
            </h1>
            <p className="hero__subtitle text-lg font-medium mb-8 max-w-lg text-gray-100">
              Venčanja, rođendani, krštenja i korporativne proslave. Pronađite idealan prostor, muziku i dekoraciju na jednom mestu.
            </p>
            <button className="hero__cta bg-white text-portal-dark hover:bg-gray-100 font-bold px-8 py-4 rounded-full transition-colors w-fit shadow-md">
              Istraži ponudu
            </button>
          </div>
        </div>

        {/* Mobile Search Trigger */}
        <div className="hero__mobile-search md:hidden mt-6">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 p-4 flex items-center gap-4">
            <Search className="text-primary" />
            <div>
              <div className="font-bold text-sm">Šta slavimo?</div>
              <div className="text-xs text-gray-500">Pronađite prostor i usluge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};