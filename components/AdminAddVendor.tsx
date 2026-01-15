
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Save, Upload, Download, FileText, Plus, Trash2 } from 'lucide-react';
import { addVendor, addVendorsBatch, updateVendor } from '../services/vendorService';
import { Vendor } from '../types';
import { useAuth } from '../context/AuthContext';

// 1. КОНСТАНТЫ
const VENUE_SUBCATEGORIES = [
    { id: 'Restoran', name: 'Restoran' },
    { id: 'Svečana sala', name: 'Svečana sala (Banket)' },
    { id: 'Šator', name: 'Šator' },
    { id: 'Veranda', name: 'Veranda' },
    { id: 'Hotel', name: 'Restoran u hotelu' },
    { id: 'Klub', name: 'Seoski klub / Etnoselo' },
    { id: 'Loft', name: 'Loft' },
    { id: 'Splav', name: 'Splav / Jaht klub' },
    { id: 'Vila', name: 'Vila / Osobnik' }
];

interface AdminAddVendorProps {
  onBack: () => void;
  initialData?: Vendor | null;
}

export const AdminAddVendor: React.FC<AdminAddVendorProps> = ({ onBack, initialData }) => {
  const { currentUser } = useAuth();
  const defaultVenueType = VENUE_SUBCATEGORIES[0]?.id || 'Restoran';
  const isEditMode = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [galleryInputs, setGalleryInputs] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({
    type: 'VENUE',
    name: '',
    address: '',
    city: 'Beograd',
    category_id: '1',
    venue_type: defaultVenueType,
    description: '',
    price_from: '',
    capacity_min: '',
    capacity_max: '',
    cover_image: '', 
    phone: '',
    email: '',
    google_maps_url: ''
  });

  useEffect(() => {
    if (initialData) {
        setFormData({
            type: initialData.type,
            name: initialData.name,
            address: initialData.address,
            city: initialData.city,
            category_id: initialData.category_id,
            venue_type: (initialData as any).venue_type || defaultVenueType,
            description: initialData.description || '',
            price_from: (initialData.type === 'VENUE' ? initialData.pricing?.per_person_from : (initialData.pricing as any)?.package_from) || '',
            capacity_min: (initialData.type === 'VENUE' ? initialData.capacity?.min : '') || '',
            capacity_max: (initialData.type === 'VENUE' ? initialData.capacity?.max : '') || '',
            cover_image: initialData.cover_image || '',
            phone: initialData.contact?.phone || '',
            email: initialData.contact?.email || '',
            google_maps_url: initialData.google_maps_url || ''
        });
        
        if (initialData.gallery && initialData.gallery.length > 1) {
            setGalleryInputs(initialData.gallery.slice(1));
        }
    }
  }, [initialData, defaultVenueType]);

  const safeStr = (val: any): string => {
    if (val === null || val === undefined) return '';
    return String(val).trim();
  };

  const safeInt = (val: any, defaultVal = 0): number => {
    const parsed = parseInt(String(val).replace(/[^0-9]/g, ''));
    return isNaN(parsed) ? defaultVal : parsed;
  };

  const constructVendorObject = (data: any) => {
    const imagesList = data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0 
        ? data.gallery 
        : [safeStr(data.cover_image) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'];

    const safeName = safeStr(data.name) || 'Nepoznato';
    const safeType = (safeStr(data.type) || 'VENUE').toUpperCase();
    
    let slug = safeName.toLowerCase()
        .replace(/ć/g, 'c').replace(/č/g, 'c').replace(/š/g, 's').replace(/đ/g, 'dj').replace(/ž/g, 'z')
        .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    
    if (slug.endsWith('-')) slug = slug.slice(0, -1);
    if (!slug) slug = `vendor-${Date.now()}`;

    // IMPORTANT: Inject Owner ID from Auth Context if missing (for RLS)
    const ownerId = isEditMode ? initialData?.ownerId : currentUser?.uid;

    const newVendor: any = {
      ownerId: ownerId, 
      type: safeType,
      name: safeName,
      slug: slug,
      category_id: safeStr(data.category_id) || '1',
      address: safeStr(data.address),
      city: safeStr(data.city) || 'Beograd',
      google_maps_url: safeStr(data.google_maps_url),
      description: safeStr(data.description),
      cover_image: imagesList[0] || '', 
      gallery: imagesList,
      rating: initialData?.rating || 5.0,
      reviews_count: initialData?.reviews_count || 0,
      price_range_symbol: '€€',
      features: ['WiFi', 'Parking'], 
      contact: {
        phone: safeStr(data.phone),
        email: safeStr(data.email)
      }
    };

    if (newVendor.type === 'VENUE') {
      newVendor.venue_type = safeStr(data.venue_type) || 'Restoran';
      newVendor.capacity = {
        min: safeInt(data.capacity_min),
        max: safeInt(data.capacity_max, 100),
        seated: safeInt(data.capacity_max, 100),
        cocktail: safeInt(data.capacity_max, 100)
      };
      newVendor.pricing = {
        per_person_from: safeInt(data.price_from)
      };
    } else {
      newVendor.service_type = 'Usluga';
      newVendor.pricing = {
        package_from: safeInt(data.price_from)
      };
    }
    
    return JSON.parse(JSON.stringify(newVendor));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddGalleryInput = () => {
    if (galleryInputs.length < 9) {
        setGalleryInputs([...galleryInputs, '']);
    }
  };

  const handleGalleryInputChange = (index: number, value: string) => {
    const newInputs = [...galleryInputs];
    newInputs[index] = value;
    setGalleryInputs(newInputs);
  };

  const handleRemoveGalleryInput = (index: number) => {
    const newInputs = [...galleryInputs];
    newInputs.splice(index, 1);
    setGalleryInputs(newInputs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const fullGallery = [formData.cover_image, ...galleryInputs].filter(url => url && url.trim().length > 0);
        const vendorPayload = constructVendorObject({ ...formData, gallery: fullGallery });
        
        let success;
        if (isEditMode && initialData?.id) {
             success = await updateVendor(initialData.id, vendorPayload);
        } else {
             success = await addVendor(vendorPayload);
        }
        
        if (success) {
          alert(isEditMode ? "Uspešno ažurirano!" : "Uspešno dodato!");
          onBack();
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Greška pri čuvanju podataka. Proverite konzolu.");
    } finally {
        setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "type;name;category_id;venue_type;city;address;price_from;capacity_min;capacity_max;cover_image;phone;description";
    const example = "VENUE;Restoran Nova Era;1;Restoran;Beograd;Adresa 10;45;50;250;https://img1.com/a.jpg|https://img2.com/b.jpg;+381641234567;Opis restorana...";
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
        try {
            const text = evt.target?.result as string;
            if (!text) return;

            const cleanText = text.replace(/^--- START OF FILE .* ---\n/, '');
            const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);
            if (lines.length < 2) {
                alert("CSV fajl nema dovoljno podataka.");
                return;
            }

            const dataRows = lines.slice(1);
            const parsedVendors: any[] = [];

            dataRows.forEach((row) => {
                if (!row) return;
                const delimiter = row.indexOf(';') !== -1 ? ';' : ',';
                const cols = row.split(delimiter);
                
                if (cols.length < 2) return;
                
                let rawData: any = {};
                
                if (cols.length >= 10) {
                     let allImages: string[] = [];
                     const imgCol = cols.length > 9 ? cols[9] : cols[8];
                     if (imgCol) {
                        allImages = imgCol.split(/[|;]/).map(s => s.trim()).filter(s => s);
                     }
                     
                     rawData = {
                        type: cols[0],
                        name: cols[1],
                        category_id: cols[2],
                        venue_type: cols[3],
                        city: cols[4],
                        address: cols[5],
                        price_from: cols[6],
                        capacity_min: cols[7],
                        capacity_max: cols[8],
                        cover_image: allImages[0] || '', 
                        gallery: allImages,        
                        phone: cols.length > 10 ? cols[10] : '',
                        description: cols.length > 11 ? cols.slice(11).join(' ') : ''
                    };

                    if (safeStr(rawData.name) && safeStr(rawData.type)) {
                        parsedVendors.push(constructVendorObject(rawData));
                    }
                }
            });

            if (parsedVendors.length > 0) {
                if (window.confirm(`Pronađeno ${parsedVendors.length} profila. Želite li da ih otpremite?`)) {
                    setLoading(true);
                    const success = await addVendorsBatch(parsedVendors);
                    setLoading(false);
                    if (success) {
                        alert(`Uspešno uvezeno ${parsedVendors.length} profila!`);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        onBack();
                    }
                }
            } else {
                alert("Nismo uspeli da parsiramo podatke. Proverite format CSV-a.");
            }
        } catch (error) {
            console.error("CSV Parse Error:", error);
            alert("Greška pri čitanju fajla.");
            setLoading(false);
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pt-36 pb-20 container mx-auto px-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-portal-dark">
            <ChevronLeft size={20} /> Nazad
        </button>
        <h1 className="text-2xl font-bold text-portal-dark">
            {isEditMode ? 'Izmeni Profil' : 'Dodaj Novi Profil'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MANUAL FORM */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tip</label>
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
                    <option value="6">6 - Videografi</option>
                    <option value="7">7 - Katering</option>
                    <option value="8">8 - Šminka i Frizura</option>
                    <option value="9">9 - Transport (Limuzine)</option>
                    <option value="10">10 - Vatromet i Efekti</option>
                </select>
                </div>
            </div>

            {formData.type === 'VENUE' && (
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tip Prostora</label>
                    <select 
                        name="venue_type" 
                        value={formData.venue_type} 
                        onChange={handleChange} 
                        className="w-full p-3 border rounded-lg bg-gray-50 border-primary/30"
                    >
                        {VENUE_SUBCATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Naziv</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
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

            {/* GALLERY SECTION */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Galerija Slika (Max 10)</label>
                
                <div className="mb-3">
                    <input name="cover_image" required value={formData.cover_image} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white" placeholder="Glavna slika (URL)..." />
                </div>

                <div className="space-y-2">
                    {galleryInputs.map((url, index) => (
                        <div key={index} className="flex gap-2">
                            <input 
                                value={url} 
                                onChange={(e) => handleGalleryInputChange(index, e.target.value)} 
                                className="w-full p-3 border rounded-lg bg-white" 
                                placeholder={`Slika #${index + 2} (URL)...`} 
                            />
                            <button type="button" onClick={() => handleRemoveGalleryInput(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {galleryInputs.length < 9 && (
                    <button type="button" onClick={handleAddGalleryInput} className="mt-3 text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                        <Plus size={16} /> Dodaj još slika
                    </button>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Opis</label>
                <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cena od (€)</label>
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
                {loading ? 'Čuvanje...' : <><Save size={20} /> {isEditMode ? 'Sačuvaj izmene' : 'Dodaj u bazu'}</>}
            </button>
            </form>
        </div>

        {/* BULK UPLOAD */}
        {!isEditMode && (
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-portal-dark text-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Masovni unos</h2>
                    <p className="text-sm text-gray-300 mb-6">
                        Otpremite CSV fajl da dodate više profila odjednom.
                    </p>

                    <button 
                        onClick={downloadTemplate}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors mb-4"
                    >
                        <Download size={16} /> Preuzmi šablon
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
            </div>
        )}

      </div>
    </div>
  );
};
