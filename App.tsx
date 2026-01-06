
import React, { useState, useEffect, Suspense } from 'react';
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
import { AdminLogin } from './components/AdminLogin';
import { PartnerAuth } from './components/PartnerAuth';
import { PartnerDashboard } from './components/PartnerDashboard';
import { GoodsCategories } from './components/GoodsCategories';
import { SEOManager } from './components/SEOManager'; 
import { Vendor } from './types';
import { db, auth } from './lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { getSiteContent } from './services/vendorService';

// Safe lazy load with error handling
const AdminPanel = React.lazy(() => 
  import('./components/AdminPanel')
    .catch(error => {
      console.error("Error loading AdminPanel:", error);
      return { default: () => <div className="p-20 text-center text-red-600 font-bold">Greška pri učitavanju modula. Proverite konzolu.</div> };
    })
);

export type ViewType = 'home' | 'partners' | 'venues' | 'services' | 'goods-categories' | 'goods-list' | 'venue-details' | 'admin-add' | 'partner-auth' | 'partner-dashboard' | 'admin-login' | 'admin-panel';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [cmsContent, setCmsContent] = useState<any>(null); 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Connection check and Content Load
  useEffect(() => {
    const initApp = async () => {
      // 1. Check connection
      if (db) {
        try {
            const q = query(collection(db, 'vendors'), limit(1));
            await getDocs(q);
        } catch (error) {
            console.error("Firebase Connection Failed:", error);
        }
      }

      // 2. Load CMS Content
      try {
        const content = await getSiteContent();
        if (content) {
            setCmsContent(content);
        }
      } catch (e) {
        console.error("CMS Load Error", e);
      }
    };
    initApp();
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
    else if (view === 'admin-login') path = '/admin/login';
    else if (view === 'admin-panel') path = '/admin';
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

  const handleAdminLoginSuccess = () => {
      setIsAdminAuthenticated(true);
      handleNavigate('admin-panel');
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
      
      {/* Hide Header on Admin Pages */}
      {currentView !== 'admin-panel' && currentView !== 'admin-login' && (
        <Header 
            onNavigate={handleNavigate} 
            currentView={currentView} 
            customPreheader={cmsContent?.preheaderText} 
        />
      )}
      
      <main>
        {currentView === 'home' && (
          <>
            <SEOManager 
              title="Organizacija Proslava Srbija | Venčanja, Rođendani - SveZaProslavu.rs"
              description="Najveći vodič za organizaciju događaja u Srbiji. Pronađite restorane za svadbe, prostore za 18. rođendan, fotografe i muziku."
              jsonLd={organizationSchema}
            />
            <Hero 
                title={cmsContent?.heroTitle}         
                subtitle={cmsContent?.heroSubtitle}   
                imageUrl={cmsContent?.heroImage}      
            />
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

        {/* ADMIN GATEWAY */}
        {currentView === 'admin-login' && (
            <AdminLogin onLogin={handleAdminLoginSuccess} />
        )}

        {/* ADMIN PANEL (Lazy Loaded & Protected) */}
        {currentView === 'admin-panel' && (
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="ml-4 font-medium text-gray-500">Učitavanje panela...</div>
                </div>
            }>
                {isAdminAuthenticated ? (
                    <AdminPanel onLogout={() => handleNavigate('home')} />
                ) : (
                    <AdminLogin onLogin={handleAdminLoginSuccess} />
                )}
            </Suspense>
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

      {/* Hide Footer on Admin Panel */}
      {currentView !== 'admin-panel' && currentView !== 'admin-login' && (
          <Footer onAdminClick={() => handleNavigate('admin-login')} />
      )}
    </div>
  );
}

export default App;
