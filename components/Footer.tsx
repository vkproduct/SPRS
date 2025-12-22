import React from 'react';
import { Globe, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
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
          <div className="footer__copyright flex flex-wrap gap-2 md:gap-4 font-light">
            <span>© 2024 SveZaProslavu.rs</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="footer__link hover:underline">Privatnost</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="footer__link hover:underline">Uslovi</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="footer__link hover:underline">Mapa sajta</a>
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