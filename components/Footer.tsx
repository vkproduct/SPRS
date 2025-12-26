
import React from 'react';
import { Globe, Instagram, Facebook, Twitter, Database, PlusCircle } from 'lucide-react';
import { seedDatabase } from '../services/vendorService';

interface FooterProps {
    onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  
  // Hidden developer tool
  const handleDevClick = (e: React.MouseEvent) => {
    if (e.detail === 3) { // Triple click
        const confirm = window.confirm("Developer Action: Upload local data to Firebase? (Check console for output)");
        if (confirm) {
            seedDatabase();
        }
    }
  };

  return (
    <footer className="footer bg-portal-bg border-t border-gray-200 py-12">
      <div className="footer__container container mx-auto px-6 md:px-12">
        <div className="footer__grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-sm text-portal-dark">
          <div className="footer__column">
            <h4 className="footer__title font-bold mb-4">Podrška</h4>
            <ul className="footer__list space-y-3 font-light">
              <li><a href="#" className="footer__link hover:underline">Centar za pomoć</a></li>
              <li><a href="#" className="footer__link hover:underline">AirCover za proslave</a></li>
              <li><a href="#" className="footer__link hover:underline">Opcije otkazivanja</a></li>
              <li><a href="#" className="footer__link hover:underline">Naš tim</a></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4 className="footer__title font-bold mb-4">Organizacija</h4>
            <ul className="footer__list space-y-3 font-light">
              <li><a href="#" className="footer__link hover:underline">Katalog prostora</a></li>
              <li><a href="#" className="footer__link hover:underline">AI Planer</a></li>
              <li><a href="#" className="footer__link hover:underline">Inspiracija</a></li>
              <li><a href="#" className="footer__link hover:underline">Magazin</a></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4 className="footer__title font-bold mb-4">Biznis</h4>
            <ul className="footer__list space-y-3 font-light">
              <li><a href="#" className="footer__link hover:underline">Postavite svoj oglas</a></li>
              <li><a href="#" className="footer__link hover:underline">Marketing rešenja</a></li>
              <li><a href="#" className="footer__link hover:underline">Resursi za partnere</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-portal-dark">
          <div className="footer__copyright flex flex-wrap gap-2 md:gap-4 font-light items-center">
            <span onClick={handleDevClick} className="cursor-pointer" title="Triple click to seed DB">© 2025 SveZaProslavu.rs</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="footer__link hover:underline">Privatnost</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="footer__link hover:underline">Uslovi</a>
            <span className="hidden md:inline">·</span>
            
            {/* ADMIN BUTTON */}
            {onAdminClick && (
                <button onClick={onAdminClick} className="text-gray-300 hover:text-primary transition-colors flex items-center gap-1" title="Dodaj novi profil">
                    <PlusCircle size={14} /> Admin
                </button>
            )}
          </div>
          
          <div className="footer__social flex items-center gap-6 font-medium">
            <div className="footer__language flex items-center gap-2 cursor-pointer hover:underline">
              <Globe size={16} />
              <span>Srpski (RS)</span>
            </div>
            <div className="footer__social-icons flex gap-4">
               <Facebook size={18} className="cursor-pointer" />
               <Twitter size={18} className="cursor-pointer" />
               <Instagram size={18} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
