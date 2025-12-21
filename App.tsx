import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { AiPlanner } from './components/AiPlanner';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { ForPartners } from './components/ForPartners';

export type ViewType = 'home' | 'partners';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleNavigate = (view: ViewType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main>
        {currentView === 'home' ? (
          <>
            <Hero />
            <Categories />
            <AiPlanner />
            <LeadForm />
          </>
        ) : (
          <ForPartners />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;