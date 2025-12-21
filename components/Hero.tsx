import React from 'react';
import { Search } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Search Bar - Airbnb Style */}
        <div className="hidden md:flex justify-center mb-10">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 flex items-center p-2 max-w-4xl w-full">
            
            <div className="flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group">
              <label className="block text-xs font-bold text-airbnb-dark">Gde</label>
              <input 
                type="text" 
                placeholder="Pretraži destinacije" 
                className="w-full bg-transparent outline-none text-sm text-airbnb-dark placeholder-gray-500 truncate"
              />
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group">
              <label className="block text-xs font-bold text-airbnb-dark">Datum</label>
              <div className="text-sm text-gray-500 truncate">Dodajte datume</div>
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="flex-[1.5] pl-8 pr-2 py-2 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-airbnb-dark">Ko</label>
                <div className="text-sm text-gray-500 truncate">Dodajte goste</div>
              </div>
              <div className="bg-primary text-white p-4 rounded-full hover:bg-rose-600 transition-colors shadow-sm">
                <Search size={20} strokeWidth={2.5} />
              </div>
            </div>

          </div>
        </div>

        {/* Hero Image Card */}
        <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] w-full shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80" 
            alt="Wedding background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl leading-tight">
              Vaše venčanje iz snova počinje ovde
            </h1>
            <p className="text-lg font-medium mb-8 max-w-lg">
              Najveća baza sala, fotografa i dekoracije. Sve na jednom mestu.
            </p>
            <button className="bg-white text-airbnb-dark hover:bg-gray-100 font-bold px-8 py-4 rounded-full transition-colors w-fit shadow-md">
              Istraži ponudu
            </button>
          </div>
        </div>

        {/* Mobile Search Trigger */}
        <div className="md:hidden mt-6">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 p-4 flex items-center gap-4">
            <Search className="text-primary" />
            <div>
              <div className="font-bold text-sm">Gde želite da idete?</div>
              <div className="text-xs text-gray-500">Bilo gde • Bilo kad • Dodajte goste</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};