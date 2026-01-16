
import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
}

export const Hero: React.FC<HeroProps> = ({ 
  title = "Organizacija svih vrsta proslava u Srbiji: Od venčanja do korporativnih događaja",
  subtitle = "Pronađite idealan prostor i usluge za vaše venčanje, 18. rođendan, krštenje ili proslavu firme. Kreirajte uspomene koje traju zauvek.",
  imageUrl
}) => {
  
  // Robust fallback: Uses provided URL, or falls back to the preferred festive image
  const displayImage = imageUrl && imageUrl.trim() !== '' 
    ? imageUrl 
    : "https://images.unsplash.com/photo-1688493904228-f6bd305c542d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const handleScrollToExplore = () => {
    const categoriesSection = document.getElementById('kategorije');
    if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToAi = () => {
    const aiSection = document.getElementById('ai-savetnik');
    if (aiSection) {
        aiSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero relative pt-36 pb-12 md:pt-44 md:pb-20">
      <div className="hero__container container mx-auto px-6 md:px-12">
        
        {/* Search Bar - Airbnb Style */}
        <div className="hero__search-bar hidden md:flex justify-center mb-10">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 flex p-2 max-w-4xl w-full">
            
            <div className="hero__search-item flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group flex flex-col justify-center">
              <label className="block text-xs font-bold text-portal-dark">Gde</label>
              <input 
                type="text" 
                placeholder="Beograd, Novi Sad, Niš..." 
                className="w-full bg-transparent outline-none text-sm text-portal-dark placeholder-gray-500 truncate"
              />
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="hero__search-item flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group flex flex-col justify-center">
              <label className="block text-xs font-bold text-portal-dark">Povod</label>
              <div className="text-sm text-gray-500 truncate">Svadba, Rođendan, Firma...</div>
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="hero__search-item flex-[1.5] pl-8 pr-2 py-2 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-portal-dark">Broj gostiju</label>
                <div className="text-sm text-gray-500 truncate">Dodajte broj ljudi</div>
              </div>
              <div className="hero__search-button bg-primary text-white p-4 rounded-full hover:bg-rose-600 transition-colors shadow-sm" aria-label="Pretraži">
                <Search size={20} strokeWidth={2.5} />
              </div>
            </div>

          </div>
        </div>

        {/* Hero Image Card */}
        <div className="hero__image-card relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] w-full shadow-sm bg-gray-200">
          <img 
            src={displayImage} 
            alt="Proslava" 
            className="w-full h-full object-cover"
          />
          <div className="hero__overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
            <h1 className="hero__title text-4xl md:text-6xl font-bold mb-4 max-w-5xl leading-tight">
              {title}
            </h1>
            <h2 className="hero__subtitle text-lg font-medium mb-8 max-w-2xl text-gray-100">
              {subtitle}
            </h2>
            
            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={handleScrollToExplore}
                    className="hero__cta bg-white text-portal-dark hover:bg-gray-100 font-bold px-8 py-4 rounded-full transition-colors w-fit shadow-md"
                >
                  Istraži ponudu prostora
                </button>

                <button 
                    onClick={handleScrollToAi}
                    className="hero__cta-ai bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30 font-bold px-8 py-4 rounded-full transition-colors w-fit shadow-md flex items-center gap-2"
                >
                  <Sparkles size={18} /> Probaj AI Savetnika
                </button>
            </div>

          </div>
        </div>

        {/* Mobile Search Trigger */}
        <div className="hero__mobile-search md:hidden mt-6">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 p-4 flex items-center gap-4">
            <Search className="text-primary" />
            <div>
              <div className="font-bold text-sm">Šta slavimo?</div>
              <div className="text-xs text-gray-500">Venčanje, Rođendan, Firma...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
