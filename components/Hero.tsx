
import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Check } from 'lucide-react';
import { submitPartnerLead } from '../services/vendorService';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
}

export const Hero: React.FC<HeroProps> = ({ 
  title = "Organizacija proslava uz pomoć veštačke inteligencije",
  subtitle = "Pronađite idealan prostor, bend i fotografa. Naš AI planer vam pomaže da uštedite vreme i novac.",
  imageUrl
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Hypothesis Test Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Reuse the lead service but mark it as USER_WAITLIST
    const success = await submitPartnerLead(`USER_WAITLIST: ${email}`);
    setIsLoading(false);
    if (success) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="hero relative pt-36 pb-12 md:pt-44 md:pb-20">
      <div className="hero__container container mx-auto px-6 md:px-12">
        
        {/* Search Bar - Airbnb Style (Visual only for landing hypothesis) */}
        <div className="hero__search-bar hidden md:flex justify-center mb-10">
          <div className="bg-white rounded-full shadow-floating border border-gray-200 flex p-2 max-w-4xl w-full">
            
            <div className="hero__search-item flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group flex flex-col justify-center" onClick={handleScrollToExplore}>
              <label className="block text-xs font-bold text-portal-dark">Gde</label>
              <input 
                type="text" 
                placeholder="Beograd, Novi Sad, Niš..." 
                className="w-full bg-transparent outline-none text-sm text-portal-dark placeholder-gray-500 truncate pointer-events-none"
                readOnly
              />
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="hero__search-item flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer relative group flex flex-col justify-center" onClick={handleScrollToExplore}>
              <label className="block text-xs font-bold text-portal-dark">Povod</label>
              <div className="text-sm text-gray-500 truncate">Svadba, Rođendan, Firma...</div>
              <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-gray-200 group-hover:hidden"></div>
            </div>

            <div className="hero__search-item flex-[1.5] pl-8 pr-2 py-2 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-between" onClick={handleScrollToExplore}>
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

        {/* Hero Image Card with Hypothesis Test Form */}
        <div className="hero__image-card relative rounded-3xl overflow-hidden h-[550px] md:h-[650px] w-full shadow-sm bg-gray-200">
          <img 
            src={displayImage} 
            alt="Proslava" 
            className="w-full h-full object-cover"
          />
          <div className="hero__overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
            
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="md:w-3/5">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 text-green-300">
                        <Sparkles size={14} /> Beta verzija
                    </div>
                    <h1 className="hero__title text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {title}
                    </h1>
                    <h2 className="hero__subtitle text-lg font-medium mb-6 text-gray-100 max-w-xl">
                    {subtitle}
                    </h2>
                    
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={handleScrollToExplore}
                            className="bg-white text-portal-dark hover:bg-gray-100 font-bold px-8 py-3.5 rounded-full transition-colors shadow-md flex items-center gap-2"
                        >
                        Istraži ponudu
                        </button>
                        <button 
                            onClick={handleScrollToAi}
                            className="bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30 font-bold px-8 py-3.5 rounded-full transition-colors shadow-md flex items-center gap-2"
                        >
                        <Sparkles size={18} /> Probaj AI Savetnika
                        </button>
                    </div>
                </div>

                {/* HYPOTHESIS TESTING: Email Capture for "Smart Planner" */}
                <div className="md:w-2/5 w-full bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl">
                    {!isSubmitted ? (
                        <form onSubmit={handleLeadSubmit}>
                            <h3 className="font-bold text-xl mb-2">Želite pametnog organizatora?</h3>
                            <p className="text-sm text-gray-200 mb-4">
                                Prijavite se za rani pristup našem AI Planeru koji automatski pravi budžet i raspored.
                            </p>
                            <div className="flex flex-col gap-3">
                                <input 
                                    type="email" 
                                    placeholder="Vaša email adresa" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/90 text-portal-dark placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary border-0"
                                />
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isLoading ? 'Slanje...' : <>Dobij pristup <ArrowRight size={18} /></>}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center">Besplatno za prvih 1000 korisnika.</p>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg animate-bounce">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Hvala na prijavi!</h3>
                            <p className="text-sm text-gray-200">
                                Poslaćemo vam pozivnicu čim lansiramo beta verziju planera.
                            </p>
                        </div>
                    )}
                </div>
            </div>

          </div>
        </div>

        {/* Mobile Search Trigger */}
        <div className="hero__mobile-search md:hidden mt-6" onClick={handleScrollToExplore}>
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
