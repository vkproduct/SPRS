import React from 'react';
import { Globe, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-airbnb-bg border-t border-gray-200 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-sm text-airbnb-dark">
          <div>
            <h4 className="font-bold mb-4">Podrška</h4>
            <ul className="space-y-3 font-light">
              <li><a href="#" className="hover:underline">Centar za pomoć</a></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Opcije otkazivanja</a></li>
              <li><a href="#" className="hover:underline">Naš tim</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Mladenci</h4>
            <ul className="space-y-3 font-light">
              <li><a href="#" className="hover:underline">Katalog sala</a></li>
              <li><a href="#" className="hover:underline">AI Planer</a></li>
              <li><a href="#" className="hover:underline">Inspiracija</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Biznis</h4>
            <ul className="space-y-3 font-light">
              <li><a href="#" className="hover:underline">Postavite svoj oglas</a></li>
              <li><a href="#" className="hover:underline">Osiguranje za domaćine</a></li>
              <li><a href="#" className="hover:underline">Resursi</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-airbnb-dark">
          <div className="flex flex-wrap gap-2 md:gap-4 font-light">
            <span>© 2024 SvadbeniPortal.rs</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Privatnost</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Uslovi</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Mapa sajta</a>
          </div>
          
          <div className="flex items-center gap-6 font-medium">
            <div className="flex items-center gap-2 cursor-pointer hover:underline">
              <Globe size={16} />
              <span>Srpski (RS)</span>
            </div>
            <div className="flex gap-4">
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