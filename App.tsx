
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
import { GoodsCategories } from './components/GoodsCategories'; // New
import { Vendor } from './types';
import { db, auth } from './lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export type ViewType = 'home' | 'partners' | 'venues' | 'services' | 'goods-categories' | 'goods-list' | 'venue-details' | 'admin-add' | 'partner-auth' | 'partner-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);

  // Debug: Check Firebase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!db) {
        console.log("%c⚠️ Firebase config missing or invalid. Check .env file.", "color: orange; font-weight: bold; font-size: 14px;");
        return;
      }
      try {
        console.log("%c🔄 Testing Firebase connection...", "color: blue;");
        const q = query(collection(db, 'vendors'), limit(1));
        await getDocs(q);
        console.log("%c✅ Firebase Connected Successfully!", "color: green; font-weight: bold; font-size: 16px; background: #e6fffa; padding: 4px; border-radius: 4px;");
      } catch (error) {
        console.error("%c❌ Firebase Connection Failed:", "color: red; font-weight: bold; font-size: 16px;", error);
      }
    };
    checkConnection();
  }, []);

  const handleNavigate = (view: ViewType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedVendor?.type === 'VENUE') {
        setCurrentView('venues');
    } else if (selectedVendor?.type === 'PRODUCT') {
        setCurrentView('goods-list');
    } else {
        setCurrentView('services');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <Categories onCategoryClick={handleCategoryClick} />
            <AiPlanner />
            <LeadForm />
          </>
        )}
        
        {currentView === 'partners' && (
          <ForPartners onNavigate={handleNavigate} />
        )}

        {currentView === 'venues' && (
          <VenueList 
            onVenueSelect={handleVendorSelect} 
            initialCategoryId={targetCategory} 
            filterType="VENUE"
          />
        )}

        {currentView === 'services' && (
          <VenueList 
            onVenueSelect={handleVendorSelect} 
            initialCategoryId={targetCategory} 
            filterType="SERVICE"
          />
        )}

        {/* Goods / Products Views */}
        {currentView === 'goods-categories' && (
           <GoodsCategories onCategoryClick={handleGoodsCategoryClick} />
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

        {/* Partner Auth Routes */}
        {currentView === 'partner-auth' && (
            <PartnerAuth onLoginSuccess={() => handleNavigate('partner-dashboard')} />
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
