import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { AiPlanner } from './components/AiPlanner';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { ForPartners } from './components/ForPartners';
import { VenueList } from './components/VenueList';
import { VenueDetails } from './components/VenueDetails';
import { AdminAddVendor } from './components/AdminAddVendor'; 
import { PartnerAuth } from './components/PartnerAuth';
import { PartnerDashboard } from './components/PartnerDashboard';
import { GoodsCategories } from './components/GoodsCategories';
import { SEOManager } from './components/SEOManager'; // Import SEO
import { Vendor } from './types';
import { db, auth } from './lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export type ViewType = 'home' | 'partners' | 'venues' | 'services' | 'goods-categories' | 'goods-list' | 'venue-details' | 'admin-add' | 'partner-auth' | 'partner-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);

  // Connection check
  useEffect(() => {
    const checkConnection = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, 'vendors'), limit(1));
        await getDocs(q);
      } catch (error) {
        console.error("Firebase Connection Failed:", error);
      }
    };
    checkConnection();
  }, []);

  const handleNavigate = (view: ViewType, subParam?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    
    // SEO: Update Browser URL without reload
    let path = '/';
    if (view === 'venues') path = '/venues';
    else if (view === 'services') path = '/services';
    else if (view === 'goods-categories') path = '/goods';
    else if (view === 'goods-list') path = '/goods/list';
    else if (view === 'partners') path = '/partners';
    else if (view === 'venue-details' && selectedVendor) path = `/vendor/${selectedVendor.slug}`;
    
    window.history.pushState({}, '', path);

    if (view !== 'venue-details') {
      setSelectedVendor(null);
      setTargetCategory(null);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setTargetCategory(categoryId);
    if (categoryId === '1') {
        handleNavigate('venues');
    } else {
        handleNavigate('services');
    }
  };

  const handleGoodsCategoryClick = (categoryId: string) => {
    setTargetCategory(categoryId);
    handleNavigate('goods-list');
  }

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentView('venue-details');
    // Update URL immediately
    window.history.pushState({}, '', `/vendor/${vendor.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedVendor?.type === 'VENUE') {
        handleNavigate('venues');
    } else if (selectedVendor?.type === 'PRODUCT') {
        handleNavigate('goods-list');
    } else {
        handleNavigate('services');
    }
  };

  // --- JSON-LD GENERATION ---
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SveZaProslavu.rs",
    "url": "https://svezaproslavu.rs",
    "logo": "https://svezaproslavu.rs/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+381-11-123-4567",
      "contactType": "customer service",
      "areaServed": "RS",
      "availableLanguage": ["Serbian", "English"]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main>
        {currentView === 'home' && (
          <>
            <SEOManager 
              title="Organizacija Proslava Srbija | Venčanja, Rođendani - SveZaProslavu.rs"
              description="Najveći vodič za organizaciju događaja u Srbiji. Pronađite restorane za svadbe, prostore za 18. rođendan, fotografe i muziku."
              jsonLd={organizationSchema}
            />
            <Hero />
            <Categories onCategoryClick={handleCategoryClick} />
            <AiPlanner />
            <LeadForm />
          </>
        )}
        
        {currentView === 'partners' && (
          <>
            <SEOManager 
              title="Postanite Partner | SveZaProslavu.rs"
              description="Registrujte svoj restoran, bend ili agenciju. Popunite termine tokom cele godine."
              canonical="https://svezaproslavu.rs/partners"
            />
            <ForPartners onNavigate={handleNavigate} />
          </>
        )}

        {currentView === 'venues' && (
          <>
             <SEOManager 
              title="Sale za Svadbe i Proslave Beograd, Novi Sad | SveZaProslavu.rs"
              description="Istražite najbolje restorane, sale za venčanja i prostore za događaje u Srbiji. Pogledajte cene, slike i kapacitete."
              canonical="https://svezaproslavu.rs/venues"
            />
            <VenueList 
              onVenueSelect={handleVendorSelect} 
              initialCategoryId={targetCategory} 
              filterType="VENUE"
            />
          </>
        )}

        {currentView === 'services' && (
          <>
            <SEOManager 
              title="Muzika, Fotografi i Dekoracija za Proslave | SveZaProslavu.rs"
              description="Pronađite bendove za svadbe, profesionalne fotografe i dekoratere za vaš događaj."
              canonical="https://svezaproslavu.rs/services"
            />
            <VenueList 
              onVenueSelect={handleVendorSelect} 
              initialCategoryId={targetCategory} 
              filterType="SERVICE"
            />
          </>
        )}

        {currentView === 'goods-categories' && (
           <>
            <SEOManager 
              title="Venčanice, Odela i Pozivnice | SveZaProslavu.rs Shop"
              description="Katalog venčanica, muških odela, burmi i poklona za goste. Kupovina i iznajmljivanje."
              canonical="https://svezaproslavu.rs/goods"
            />
            <GoodsCategories onCategoryClick={handleGoodsCategoryClick} />
           </>
        )}

        {currentView === 'goods-list' && (
          <VenueList 
            onVenueSelect={handleVendorSelect} 
            initialCategoryId={targetCategory} 
            filterType="PRODUCT"
          />
        )}

        {currentView === 'venue-details' && selectedVendor && (
          <VenueDetails venue={selectedVendor} onBack={handleBack} />
        )}

        {currentView === 'admin-add' && (
          <AdminAddVendor onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'partner-auth' && (
             <>
             <SEOManager title="Prijava za Partnere" description="Pristupite svom biznis nalogu." />
             <PartnerAuth onLoginSuccess={() => handleNavigate('partner-dashboard')} />
             </>
        )}

        {currentView === 'partner-dashboard' && (
            <PartnerDashboard onLogout={() => handleNavigate('home')} />
        )}
      </main>
      <Footer onAdminClick={() => handleNavigate('admin-add')} />
    </div>
  );
}

export default App;