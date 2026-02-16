
import React, { useState, useEffect } from 'react';
import { Menu, User as UserIcon, Briefcase } from 'lucide-react';
import { ViewType } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate?: (view: ViewType) => void;
  currentView?: ViewType;
  customPreheader?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView = 'home', customPreheader }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Set fixed target date to February 15, 2026
    let targetDate = new Date('2026-02-15T00:00:00');
    
    // Fallback: If date passed, reset to +30 days (for demo continuity)
    if (targetDate.getTime() < new Date().getTime()) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    // Update immediately, then every second
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, view: ViewType) => {
    e.preventDefault();
    if (onNavigate) onNavigate(view);
  };

  // Logic for the "Moj Biznis" / "Partneri" button
  const handlePartnerLogin = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!onNavigate) return;
      
      if (currentUser?.role === 'contractor' || currentUser?.role === 'admin') {
          onNavigate('partner-dashboard');
      } else {
          // If logged out or regular user, go to partner landing page
          onNavigate('partners');
      }
  };

  // Logic for the User Menu (Avatar)
  const handleUserMenuClick = () => {
      if (!onNavigate) return;

      if (!currentUser) {
          onNavigate('login');
      } else if (currentUser.role === 'admin') {
          onNavigate('admin-panel');
      } else {
          // Both contractors and regular users go here
          // The PartnerDashboard component handles the view differentiation
          onNavigate('partner-dashboard');
      }
  };

  return (
    <header 
      className={`header fixed w-full z-50 transition-all duration-300 bg-white border-b border-gray-100 flex flex-col`}
    >
      {/* Preheader Countdown */}
      <div className="header__preheader bg-portal-dark text-white text-xs md:text-sm py-2.5 text-center font-medium tracking-wide flex justify-center items-center gap-1 md:gap-2">
        <span className="header__preheader-text opacity-90 hidden sm:inline">
            {customPreheader || "Pozivamo profesionalce da nam se pridruže! Otvaranje za:"}
        </span>
        <span className="header__preheader-text opacity-90 sm:hidden">
            Otvaranje za:
        </span>
        
        <div className="flex items-center gap-1 ml-1">
            <span className="header__counter-item font-bold text-white bg-white/20 px-2 py-0.5 rounded min-w-[35px] text-center">
            {timeLeft.days}d
            </span>
            <span className="header__counter-item font-bold text-white bg-white/20 px-2 py-0.5 rounded min-w-[35px] text-center">
            {timeLeft.hours.toString().padStart(2, '0')}h
            </span>
            <span className="header__counter-item font-bold text-white bg-white/20 px-2 py-0.5 rounded min-w-[35px] text-center">
            {timeLeft.minutes.toString().padStart(2, '0')}m
            </span>
            <span className="header__counter-item font-bold text-primary bg-white px-2 py-0.5 rounded min-w-[35px] text-center shadow-sm">
            {timeLeft.seconds.toString().padStart(2, '0')}s
            </span>
        </div>
      </div>

      <div className={`header__main w-full transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="header__container container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo - Typographic Wordmark in Brand Color */}
          <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="header__logo flex items-center flex-1 cursor-pointer group select-none decoration-transparent">
            <div className="flex items-baseline transition-opacity hover:opacity-80">
                <span className="font-poppins font-semibold text-xl md:text-xl tracking-tight text-primary uppercase">
                  SveZaProslavu
                </span>
                <span className="font-poppins text-primary/60 font-semibold text-lg md:text-xl tracking-tight ml-0.5">.rs</span>
            </div>
          </a>

          {/* Center Nav */}
          <nav className={`header__nav hidden md:flex gap-6 items-center transition-all`}>
            <a 
              href="/venues"
              onClick={(e) => handleNavClick(e, 'venues')}
              className={`header__nav-link font-medium px-4 py-2 text-sm rounded-full transition-all ${currentView === 'venues' ? 'bg-gray-100 text-portal-dark' : 'text-gray-500 hover:bg-gray-100 hover:text-portal-dark'}`}
            >
              Prostori
            </a>
            <a 
              href="/services"
              onClick={(e) => handleNavClick(e, 'services')}
              className={`header__nav-link font-medium px-4 py-2 text-sm rounded-full transition-all ${currentView === 'services' ? 'bg-gray-100 text-portal-dark' : 'text-gray-500 hover:bg-gray-100 hover:text-portal-dark'}`}
            >
              Usluge
            </a>
            <a 
              href="/goods"
              onClick={(e) => handleNavClick(e, 'goods-categories')}
              className={`header__nav-link font-medium px-4 py-2 text-sm rounded-full transition-all ${currentView === 'goods-categories' || currentView === 'goods-list' ? 'bg-gray-100 text-portal-dark' : 'text-gray-500 hover:bg-gray-100 hover:text-portal-dark'}`}
            >
              Proizvodi
            </a>
          </nav>

          {/* Right Actions */}
          <div className="header__actions flex-1 flex justify-end items-center gap-2">
            
            <a 
                href="/partners"
                onClick={handlePartnerLogin}
                className="hidden md:flex items-center gap-2 font-medium text-sm hover:bg-gray-100 px-4 py-2 rounded-full cursor-pointer transition-all border border-gray-200 text-portal-dark"
            >
                <Briefcase size={16} /> 
                {currentUser?.role === 'contractor' ? 'Moj Biznis' : 'Partneri'}
            </a>
            
            {/* User Menu Pill */}
            <div 
                onClick={handleUserMenuClick}
                className="header__user-menu flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md cursor-pointer transition-shadow ml-1"
                title={currentUser ? `Prijavljeni ste kao: ${currentUser.firstName}` : 'Prijavite se'}
            >
              <Menu size={18} className="text-gray-600" />
              <div className="header__user-avatar bg-gray-500 text-white p-1 rounded-full relative">
                 <UserIcon size={18} fill="currentColor" className="text-white" />
                 {currentUser && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
