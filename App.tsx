
import React, { useState, useEffect, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { AiPlanner } from './components/AiPlanner';
import { AiAdvisor } from './components/AiAdvisor';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { ForPartners } from './components/ForPartners';
import { VenueList } from './components/VenueList';
import { VenueDetails } from './components/VenueDetails';
import { AdminAddVendor } from './components/AdminAddVendor'; 
import { AdminLogin } from './components/AdminLogin';
import { PartnerDashboard } from './components/PartnerDashboard';
import { UserDashboard } from './components/UserDashboard';
import { GoodsCategories } from './components/GoodsCategories';
import { SEOManager } from './components/SEOManager'; 
import { Vendor } from './types';
import { supabase } from './lib/supabase';
import { getSiteContent } from './services/vendorService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';

// Safe lazy load with error handling
const AdminPanel = React.lazy(() => 
  import('./components/AdminPanel')
    .catch(error => {
      console.error("Error loading AdminPanel:", error);
      return { default: () => <div className="p-20 text-center text-red-600 font-bold">Greška pri učitavanju modula. Proverite konzolu.</div> };
    })
);

export type ViewType = 'home' | 'partners' | 'venues' | 'services' | 'goods-categories' | 'goods-list' | 'venue-details' | 'admin-add' | 'partner-auth' | 'partner-dashboard' | 'admin-login' | 'admin-panel' | 'login' | 'register';

function MainContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [cmsContent, setCmsContent] = useState<any>(null); 
  
  const { currentUser, loading: authLoading } = useAuth();

  // Connection check and Content Load
  useEffect(() => {
    const initApp = async () => {
      // 1. Check connection
      if (supabase) {
        try {
            await supabase.from('vendors').select('*').limit(1);
        } catch (error) {
            console.error("Supabase Connection Failed:", error);
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
    else if (view === 'login') path = '/login';
    else if (view === 'register') path = '/register';
    else if (view === 'venue-details' && selectedVendor) path = `/vendor/${selectedVendor.slug}`;
    
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // Ignore errors in sandboxed environments where history API is restricted
      console.warn("Navigation state update failed (likely sandbox env):", e);
    }

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
    try {
      window.history.pushState({}, '', `/vendor/${vendor.slug}`);
    } catch (e) {
      console.warn("Navigation state update failed:", e);
    }
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

  const isAdmin = currentUser?.role === 'admin';

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
              description="Najveći vodič za organizaciju događaja u Srbiji. Pronađite restorane za svadbe, prospaces za 18. rođendan, fotografe i muziku."
              jsonLd={organizationSchema}
            />
            <Hero 
                title={cmsContent?.heroTitle}         
                subtitle={cmsContent?.heroSubtitle}   
                imageUrl={cmsContent?.heroImage}      
            />
            <Categories onCategoryClick={handleCategoryClick} />
            <AiAdvisor />
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
            <AdminLogin onLogin={() => handleNavigate('admin-panel')} />
        )}

        {/* ADMIN PANEL (Lazy Loaded & Protected) */}
        {currentView === 'admin-panel' && (
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="ml-4 font-medium text-gray-500">Učitavanje panela...</div>
                </div>
            }>
                {authLoading ? (
                    <div>Provera prava pristupa...</div>
                ) : isAdmin ? (
                    <AdminPanel onLogout={() => handleNavigate('home')} />
                ) : (
                    <AdminLogin onLogin={() => handleNavigate('admin-panel')} />
                )}
            </Suspense>
        )}

        {/* Legacy Partner Auth Route */}
        {currentView === 'partner-auth' && (
              <AuthPage initialView="login" onNavigate={(v) => handleNavigate(v as ViewType)} />
        )}

        {/* NEW AUTH ROUTES */}
        {(currentView === 'login' || currentView === 'register') && (
              <AuthPage initialView={currentView} onNavigate={(v) => handleNavigate(v as ViewType)} />
        )}

        {/* DASHBOARDS */}
        {currentView === 'partner-dashboard' && (
             authLoading ? (
                <div className="min-h-screen pt-36 flex flex-col items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary border-t-transparent"></div>
                    <p className="mt-4 text-gray-500 font-medium">Učitavanje vašeg naloga...</p>
                </div>
             ) : (
                // Safe check for role now that authLoading is false
                currentUser?.role === 'user' 
                    ? <UserDashboard onLogout={() => handleNavigate('home')} onNavigate={handleNavigate} />
                    : <PartnerDashboard onLogout={() => handleNavigate('home')} />
             )
        )}
      </main>

      {/* Hide Footer on Admin Panel */}
      {currentView !== 'admin-panel' && currentView !== 'admin-login' && (
          <Footer onAdminClick={() => handleNavigate('admin-login')} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
