
import React from 'react';
import { Heart, Briefcase, ArrowRight } from 'lucide-react';

interface RoleSelectionProps {
  onSelect: (role: 'user' | 'contractor') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-portal-dark mb-2">Dobrodošli!</h2>
      <p className="text-center text-gray-500 mb-8">Izaberite kako želite da koristite portal.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Option */}
        <button
          onClick={() => onSelect('user')}
          className="group relative p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-lg transition-all text-left"
        >
          <div className="w-12 h-12 bg-red-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Heart size={24} fill="currentColor" className="text-primary/20" />
            <Heart size={24} className="absolute" />
          </div>
          <h3 className="text-lg font-bold text-portal-dark mb-1">Organizujem proslavu</h3>
          <p className="text-sm text-gray-500 mb-4">
            Tražim prostor, muziku ili fotografa za venčanje ili događaj.
          </p>
          <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Registrujte se <ArrowRight size={14} />
          </span>
        </button>

        {/* Contractor Option */}
        <button
          onClick={() => onSelect('contractor')}
          className="group relative p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <h3 className="text-lg font-bold text-portal-dark mb-1">Nudim usluge</h3>
          <p className="text-sm text-gray-500 mb-4">
            Imam restoran, bend ili agenciju i želim da pronađem klijente.
          </p>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Postani Partner <ArrowRight size={14} />
          </span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
            Već imate nalog? <a href="/login" className="text-portal-dark font-bold hover:underline">Prijavite se</a>
        </p>
      </div>
    </div>
  );
};
