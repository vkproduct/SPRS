
import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { productSubcategories } from '../data/database';

interface GoodsCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

export const GoodsCategories: React.FC<GoodsCategoriesProps> = ({ onCategoryClick }) => {
  return (
    <div className="pt-36 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
             <ShoppingBag size={14} /> Prodavnica
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-portal-dark mb-6 tracking-tight">
            Sve za vašu <span className="text-primary">proslavu</span> na jednom mestu
          </h1>
          <p className="text-lg text-portal-gray leading-relaxed">
            Istražite našu bogatu ponudu venčanica, odela, nakita i dekoracije. 
            Kupite ili iznajmite proizvode od najboljih salona u Srbiji.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Featured Item - Wedding Dresses (First item spans 2 rows on large screens if needed, keeping simple grid for now) */}
            {productSubcategories.map((cat, index) => (
                <a 
                    key={cat.id}
                    href={`/goods/${cat.id.toLowerCase()}`} // SEO Friendly URL
                    onClick={(e) => { e.preventDefault(); onCategoryClick(cat.id); }}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${index === 0 ? 'md:col-span-2 md:row-span-2 h-[400px] md:h-[500px]' : 'h-[240px]'}`}
                >
                    <div className="absolute inset-0 bg-gray-200">
                        <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <h3 className={`font-bold text-white mb-2 ${index === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                            {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                            <span>Pogledaj ponudu</span>
                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </a>
            ))}
        </div>

        {/* Info Banner */}
        <div className="mt-20 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
                <h3 className="text-2xl font-bold text-portal-dark mb-3">Imate salon venčanica ili prodavnicu?</h3>
                <p className="text-gray-500">Postavite svoje proizvode na najveći portal za proslave u regionu i dođite do hiljada novih kupaca.</p>
            </div>
            <button className="bg-portal-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
                Postani Partner
            </button>
        </div>

      </div>
    </div>
  );
};
