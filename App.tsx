
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
import { Venue } from './types';

export type ViewType = 'home' | 'partners' | 'venues' | 'venue-details';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const handleNavigate = (view: ViewType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    // Reset selection when navigating via header, unless we specifically handled it elsewhere
    if (view !== 'venue-details') {
      setSelectedVenue(null);
    }
  };

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setCurrentView('venue-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToVenues = () => {
    setCurrentView('venues');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <Categories onCategoryClick={() => handleNavigate('venues')} />
            <AiPlanner />
            <LeadForm />
          </>
        )}
        
        {currentView === 'partners' && (
          <ForPartners />
        )}

        {currentView === 'venues' && (
          <VenueList onVenueSelect={handleVenueSelect} />
        )}

        {currentView === 'venue-details' && selectedVenue && (
          <VenueDetails venue={selectedVenue} onBack={handleBackToVenues} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
