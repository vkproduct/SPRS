import React from 'react';
import { Heart } from 'lucide-react';
import { VendorCategory } from '../types';

const categories: VendorCategory[] = [
  { id: '1', name: 'Restorani i Sale', iconName: 'Home', count: 120, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Fotografi', iconName: 'Camera', count: 85, image: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Muzika', iconName: 'Music', count: 64, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Torte', iconName: 'Utensils', count: 45, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'Dekoracija', iconName: 'Flower', count: 32, image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80' },
  { id: '6', name: 'Venčanice', iconName: 'Scissors', count: 28, image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80' },
  { id: '7', name: 'Prevoz', iconName: 'Car', count: 15, image: 'https://images.unsplash.com/photo-1582218881267-93ae3425a745?auto=format&fit=crop&w=800&q=80' },
  { id: '8', name: 'Pozivnice', iconName: 'Gift', count: 20, image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80' },
];

export const Categories: React.FC = () => {
  return (
    <section className="py-12 bg-white" id="kategorije">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold text-airbnb-dark mb-8">Istražite kategorije</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {categories.map((cat) => (
            <div key={cat.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 text-white/70 hover:text-white hover:scale-110 transition-all">
                  <Heart fill="rgba(0,0,0,0.5)" strokeWidth={0} size={24} className="absolute inset-0 text-black/20" />
                  <Heart size={24} className="relative drop-shadow-sm" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-airbnb-dark text-[15px]">{cat.name}</h3>
                  <p className="text-airbnb-gray text-[15px]">Veliki izbor</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-semibold text-airbnb-dark text-sm">{cat.count}</span>
                    <span className="text-airbnb-dark text-sm">provajdera</span>
                  </div>
                </div>
                {/* Rating star simulation */}
                <div className="flex items-center gap-1 text-sm font-light">
                   <span className="text-xs">★</span> 4.9
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};