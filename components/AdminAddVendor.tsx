
import React, { useState, useRef } from 'react';
import { ChevronLeft, Save, Upload, Download, FileText } from 'lucide-react';
import { addVendor, addVendorsBatch } from '../services/vendorService';
import { Vendor } from '../types';

interface AdminAddVendorProps {
  onBack: () => void;
}

export const AdminAddVendor: React.FC<AdminAddVendorProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Single Entry State
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

  // --- MANUAL SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newVendor = constructVendorObject(formData);
    const success = await addVendor(newVendor);
    setLoading(false);

    if (success) {
      alert("Uspešno dodato! Novi profil je sada u bazi.");
      onBack();
    }
  };

  // --- CSV HELPER FUNCTIONS ---

  const constructVendorObject = (data: any) => {
    const newVendor: any = {
      type: data.type.toUpperCase(),
      name: data.name,
      slug: data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
      category_id: data.category_id,
      address: data.address,
      city: data.city,
      description: data.description || '',
      cover_image: data.cover_image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      gallery: [data.cover_image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'],
      rating: 5.0,
      reviews_count: 0,
      price_range_symbol: '€€',
      features: ['WiFi', 'Parking'], 
      contact: {
        phone: data.phone || '',
        email: data.email || ''
      }
    };

    if (newVendor.type === 'VENUE') {
      newVendor.venue_type = 'EVENT CENTAR';
      newVendor.capacity = {
        min: parseInt(data.capacity_min) || 0,
        max: parseInt(data.capacity_max) || 100,
        seated: parseInt(data.capacity_max) || 100,
        cocktail: parseInt(data.capacity_max) || 100
      };
      newVendor.pricing = {
        per_person_from: parseInt(data.price_from) || 0
      };
    } else {
      newVendor.service_type = 'Usluga';
      newVendor.pricing = {
        package_from: parseInt(data.price_from) || 0
      };
    }
    return newVendor;
  };

  const downloadTemplate = () => {
    const headers = "type,name,category_id,city,address,price_from,capacity_min,capacity_max,cover_image,phone,description";
    const example = "VENUE,Restoran Nova Era,1,Beograd,Adresa 10,45,50,250,https://example.com/img.jpg,+381641234567,Opis restorana...";
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors_template.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;

        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        // Skip header row
        const dataRows = lines.slice(1);
        
        const parsedVendors: any[] = [];

        dataRows.forEach(row => {
            // Simple split by comma (NOTE: doesn't handle commas inside quotes!)
            const cols = row.split(',');
            if (cols.length < 5) return; // Skip invalid rows

            // Map CSV columns to object keys matching constructVendorObject expectations
            // Order based on template: type,name,cat_id,city,address,price,cap_min,cap_max,img,phone,desc
            const rawData = {
                type: cols[0],
                name: cols[1],
                category_id: cols[2],
                city: cols[3],
                address: cols[4],
                price_from: cols[5],
                capacity_min: cols[6],
                capacity_max: cols[7],
                cover_image: cols[8],
                phone: cols[9],
                description: cols[10]
            };

            parsedVendors.push(constructVendorObject(rawData));
        });

        if (parsedVendors.length > 0) {
            if (window.confirm(`Pronađeno ${parsedVendors.length} profila. Želite li da ih otpremite?`)) {
                setLoading(true);
                const success = await addVendorsBatch(parsedVendors);
                setLoading(false);
                if (success) {
                    alert(`Uspešno uvezeno ${parsedVendors.length} profila!`);
                    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
                    onBack();
                }
            }
        } else {
            alert("Nismo uspeli da pročitamo podatke. Proverite format CSV fajla.");
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pt-36 pb-20 container mx-auto px-6 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-portal-dark mb-6">
        <ChevronLeft size={20} /> Nazad
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Manual Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-portal-dark">Ručni unos</h1>
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

        {/* RIGHT COLUMN: Bulk Upload */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-portal-dark text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Masovni unos</h2>
                <p className="text-sm text-gray-300 mb-6">
                    Imate mnogo restorana ili usluga? Otpremite CSV fajl da ih dodate sve odjednom.
                </p>

                <button 
                    onClick={downloadTemplate}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors mb-4"
                >
                    <Download size={16} /> Preuzmi CSV šablon
                </button>

                <div className="relative">
                    <input 
                        type="file" 
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden" 
                        id="csv-upload"
                    />
                    <label 
                        htmlFor="csv-upload"
                        className={`w-full bg-white text-portal-dark font-bold py-4 rounded-lg hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                       {loading ? 'Učitavanje...' : <><Upload size={20} /> Otpremi CSV</>} 
                    </label>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold mb-2 text-sm">Uputstvo za CSV</h3>
                <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                    <li>Koristite zarez (,) kao razdelnik.</li>
                    <li>Slike moraju biti direktni linkovi (URL).</li>
                    <li>Za kategorije koristite ID (1=Restorani, 2=Foto...).</li>
                    <li>Datum i redosled kolona moraju pratiti šablon.</li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};
