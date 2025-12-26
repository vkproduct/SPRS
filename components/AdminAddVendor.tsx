
import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { addVendor } from '../services/vendorService';
import { Vendor, VendorType } from '../types';

interface AdminAddVendorProps {
  onBack: () => void;
}

export const AdminAddVendor: React.FC<AdminAddVendorProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    type: 'VENUE',
    name: '',
    address: '',
    city: 'Beograd',
    category_id: '1',
    description: '',
    price_from: '',
    capacity_min: '',
    capacity_max: '',
    cover_image: '', // URL
    phone: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Construct the Vendor object based on types.ts structure
    const newVendor: any = {
      type: formData.type,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/ /g, '-'),
      category_id: formData.category_id,
      address: formData.address,
      city: formData.city,
      description: formData.description,
      cover_image: formData.cover_image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      gallery: [formData.cover_image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'],
      rating: 5.0, // New vendors start with 5 stars or 0
      reviews_count: 0,
      price_range_symbol: '€€',
      features: ['WiFi', 'Parking'], // Defaults
      contact: {
        phone: formData.phone,
        email: formData.email
      }
    };

    if (formData.type === 'VENUE') {
      newVendor.venue_type = 'EVENT CENTAR'; // Default
      newVendor.capacity = {
        min: parseInt(formData.capacity_min) || 0,
        max: parseInt(formData.capacity_max) || 100,
        seated: parseInt(formData.capacity_max) || 100,
        cocktail: parseInt(formData.capacity_max) || 100
      };
      newVendor.pricing = {
        per_person_from: parseInt(formData.price_from) || 0
      };
    } else {
      newVendor.service_type = 'Usluga';
      newVendor.pricing = {
        package_from: parseInt(formData.price_from) || 0
      };
    }

    const success = await addVendor(newVendor);
    setLoading(false);

    if (success) {
      alert("Uspešno dodato! Novi profil je sada u bazi.");
      onBack(); // Go back home
    }
  };

  return (
    <div className="pt-36 pb-20 container mx-auto px-6 max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-portal-dark mb-6">
        <ChevronLeft size={20} /> Nazad
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-portal-dark">Dodaj novi profil (Admin)</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tip profila</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50">
                <option value="VENUE">Prostor (Restoran/Sala)</option>
                <option value="SERVICE">Usluga (Foto/Muzika)</option>
              </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategorija ID</label>
               <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50">
                <option value="1">1 - Restorani</option>
                <option value="2">2 - Fotografi</option>
                <option value="3">3 - Muzika</option>
                <option value="4">4 - Torte</option>
                <option value="5">5 - Dekoracija</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Naziv</label>
            <input name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="npr. Restoran Zlatni Dvor" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grad</label>
              <input name="city" required value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresa</label>
              <input name="address" required value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Slike (Cover)</label>
            <input name="cover_image" required value={formData.cover_image} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="https://..." />
            <p className="text-xs text-gray-400 mt-1">Unesite direktan link ka slici (npr. sa Unsplash).</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Opis</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="Opis usluge ili prostora..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cena (od €)</label>
               <input name="price_from" type="number" required value={formData.price_from} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
            {formData.type === 'VENUE' && (
                <>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Gostiju</label>
                    <input name="capacity_min" type="number" value={formData.capacity_min} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max. Gostiju</label>
                    <input name="capacity_max" type="number" value={formData.capacity_max} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </div>
                </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-rose-600 transition-colors flex justify-center items-center gap-2 mt-4"
          >
            {loading ? 'Čuvanje...' : <><Save size={20} /> Sačuvaj u Bazu</>}
          </button>
        </form>
      </div>
    </div>
  );
};
