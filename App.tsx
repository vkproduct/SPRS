
import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { AiPlanner } from './components/AiPlanner';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { ForPartners } from './components/ForPartners';
import { VenueList } from './components/VenueList';
import { VenueDetails } from './components/VenueDetails';
import { Vendor } from './types';

export type ViewType = 'home' | 'partners' | 'venues' | 'services' | 'venue-details';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  // Add state to track which category was clicked on Home
  const [targetCategory, setTargetCategory] = useState<string | null>(null);

  const handleNavigate = (view: ViewType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (view !== 'venue-details') {
      setSelectedVendor(null);
      // Reset target category if navigating top-level
      setTargetCategory(null);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setTargetCategory(categoryId);
    // Logic to decide view based on category ID
    // ID '1' is Venues, everything else is Services
    if (categoryId === '1') {
        handleNavigate('venues');
    } else {
        handleNavigate('services');
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentView('venue-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    // Go back to the list view matching the current vendor type
    if (selectedVendor?.type === 'VENUE') {
        setCurrentView('venues');
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
          <ForPartners />
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

        {currentView === 'venue-details' && selectedVendor && (
          <VenueDetails venue={selectedVendor} onBack={handleBack} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
