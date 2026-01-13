
import React, { useState, useEffect } from 'react';
import { Menu, User as UserIcon, Briefcase } from 'lucide-react';
import { ViewType } from '../App';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate?: (view: ViewType) => void;
  currentView?: ViewType;
  customPreheader?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView = 'home', customPreheader }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });
  const { currentUser } = useAuth(); // Use Auth Context instead of direct firebase

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Set target date 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogoClick = () => {
    if (onNavigate) onNavigate('home');
  };
  
  const handleVenuesClick = () => {
    if (onNavigate) onNavigate('venues');
  };

  const handleServicesClick = () => {
    if (onNavigate) onNavigate('services');
  };

  const handleProductsClick = () => {
    if (onNavigate) onNavigate('goods-categories');
  };

  const handlePartnerLogin = () => {
      if (currentUser && onNavigate) {
          onNavigate('partner-dashboard');
      } else if (onNavigate) {
          // If not logged in, go to the landing page first so they see benefits
          onNavigate('partners');
      }
  };

  return (
    <header 
      className={`header fixed w-full z-50 transition-all duration-300 bg-white border-b border-gray-100 flex flex-col`}
    >
      {/* Preheader Countdown */}
      <div className="header__preheader bg-portal-dark text-white text-xs md:text-sm py-2.5 text-center font-medium tracking-wide">
        <span className="header__preheader-text opacity-90 mr-2">
            {customPreheader || "Pozivamo profesionalce da nam se pridruže! Otvaranje za:"}
        </span>
        <span className="header__counter-item font-bold text-white bg-white/20 px-2 py-0.5 rounded mx-1">
          {timeLeft.days} d
        </span>
        <span className="header__counter-item font-bold text-white bg-white/20 px-2 py-0.5 rounded mx-1">
          {timeLeft.hours.toString().padStart(2, '0')} h
        </span>
        <span className="header__counter-item font-bold text-white bg-white/20 px-2 py-0.5 rounded mx-1">
          {timeLeft.minutes.toString().padStart(2, '0')} m
        </span>
      </div>

      <div className={`header__main w-full transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="header__container container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo - Typographic Wordmark in Brand Color */}
          <div onClick={handleLogoClick} className="header__logo flex items-center flex-1 cursor-pointer group select-none">
            <div className="flex items-baseline transition-opacity hover:opacity-80">
                <span className="font-poppins font-semibold text-xl md:text-xl tracking-tight text-primary uppercase">
                  SveZaProslavu
                </span>
                <span className="font-poppins text-primary/60 font-semibold text-lg md:text-xl tracking-tight ml-0.5">.rs</span>
            </div>
          </div>

          {/* Center Nav */}
          <div className={`header__nav hidden md:flex gap-6 items-center transition-all`}>
            <button 
              onClick={handleVenuesClick}
              className={`header__nav-link font-medium px-4 py-2 text-sm rounded-full transition-all ${currentView === 'venues' ? 'bg-gray-100 text-portal-dark' : 'text-gray-500 hover:bg-gray-100 hover:text-portal-dark'}`}
            >
              Prostori
            </button>
            <button 
              onClick={handleServicesClick}
              className={`header__nav-link font-medium px-4 py-2 text-sm rounded-full transition-all ${currentView === 'services' ? 'bg-gray-100 text-portal-dark' : 'text-gray-500 hover:bg-gray-100 hover:text-portal-dark'}`}
            >
              Usluge
            </button>
            <button 
              onClick={handleProductsClick}
              className={`header__nav-link font-medium px-4 py-2 text-sm rounded-full transition-all ${currentView === 'goods-categories' || currentView === 'goods-list' ? 'bg-gray-100 text-portal-dark' : 'text-gray-500 hover:bg-gray-100 hover:text-portal-dark'}`}
            >
              Proizvodi
            </button>
          </div>

          {/* Right Actions */}
          <div className="header__actions flex-1 flex justify-end items-center gap-2">
            
            <button 
                onClick={handlePartnerLogin}
                className="hidden md:flex items-center gap-2 font-medium text-sm hover:bg-gray-100 px-4 py-2 rounded-full cursor-pointer transition-all border border-gray-200"
            >
                <Briefcase size={16} /> {currentUser ? 'Moj Biznis' : 'Partneri'}
            </button>
            
            {/* User Menu Pill */}
            <div 
                onClick={() => onNavigate && onNavigate(currentUser ? 'partner-dashboard' : 'login')}
                className="header__user-menu flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md cursor-pointer transition-shadow ml-1"
            >
              <Menu size={18} className="text-gray-600" />
              <div className="header__user-avatar bg-gray-500 text-white p-1 rounded-full">
                 <UserIcon size={18} fill="currentColor" className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
