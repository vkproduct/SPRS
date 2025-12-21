import React, { useState, useEffect } from 'react';
import { Menu, Globe, User, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 bg-white border-b border-gray-100 ${
        isScrolled ? 'shadow-sm py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-1 cursor-pointer group">
          <span className="text-primary transition-transform group-hover:scale-105 duration-300">
             {/* Connected Wedding Rings Logo */}
             <svg 
               viewBox="0 0 42 32" 
               xmlns="http://www.w3.org/2000/svg" 
               aria-hidden="true" 
               role="presentation" 
               focusable="false" 
               style={{
                 display: 'block', 
                 height: '32px', 
                 width: 'auto', 
                 fill: 'none', 
                 stroke: 'currentColor', 
                 strokeWidth: '3.5',
                 strokeLinecap: 'round',
                 strokeLinejoin: 'round'
               }}
             >
               <circle cx="14" cy="16" r="9" />
               <circle cx="28" cy="16" r="9" />
             </svg>
          </span>
          <span className="text-primary font-bold text-xl hidden md:block tracking-tight">svadbeniportal.rs</span>
        </div>

        {/* Center Nav */}
        <div className={`hidden md:flex gap-6 items-center transition-all ${isScrolled ? 'opacity-100' : 'opacity-100'}`}>
           <button className="font-medium text-airbnb-dark hover:bg-gray-100 px-4 py-2 rounded-full transition-all">Smeštaj</button>
           <button className="font-medium text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-full transition-all">Doživljaji</button>
           <button className="font-medium text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-full transition-all">Online</button>
        </div>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <div className="hidden md:block font-medium text-sm hover:bg-gray-100 px-4 py-3 rounded-full cursor-pointer transition-all">
            Za biznise
          </div>
          <div className="hover:bg-gray-100 p-3 rounded-full cursor-pointer transition-all">
            <Globe size={18} />
          </div>
          
          {/* User Menu Pill */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md cursor-pointer transition-shadow ml-1">
            <Menu size={18} className="text-gray-600" />
            <div className="bg-gray-500 text-white p-1 rounded-full">
               <User size={18} fill="currentColor" className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};