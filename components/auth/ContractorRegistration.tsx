
import React, { useState } from 'react';
import { InputField, AuthButton } from './SharedComponents';
import { Mail, Lock, Phone, Briefcase, MapPin, ChevronLeft, Building } from 'lucide-react';
import { validateEmail, validatePhoneRS, registerContractor } from '../../services/authService';

interface ContractorRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ContractorRegistration: React.FC<ContractorRegistrationProps> = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    venueName: '',
    type: 'VENUE',
    category_id: '1',
    venueType: 'Restoran',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    phone: '',
    city: 'Beograd',
    address: '',
    taxId: '', // PIB
    capacity: '',
    description: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.venueName) newErrors.venueName = "Obavezno polje";
    if (!formData.contactFirstName) newErrors.contactFirstName = "Obavezno polje";
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = "Neispravan email";
    if (!formData.phone || !validatePhoneRS(formData.phone)) newErrors.phone = "Neispravan format";
    if (formData.password.length < 8) newErrors.password = "Min. 8 karaktera";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Lozinke se ne slažu";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError('');

    try {
        await registerContractor(
            { email: formData.email, password: formData.password },
            { ...formData, capacity: formData.capacity ? parseInt(formData.capacity) : 0 }
        );
        onSuccess();
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            setError("Nalog sa ovim email-om već postoji.");
        } else {
            setError("Došlo je do greške. Pokušajte ponovo.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-h-[80vh] overflow-y-auto pr-1 scrollbar-hide">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-portal-dark">Biznis Registracija</h2>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Biznis Info */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Podaci o firmi</h3>
            <InputField label="Naziv Objekta / Firme" name="venueName" icon={<Building size={18} />} required value={formData.venueName} onChange={handleChange} error={errors.venueName} />
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tip Usluge</label>
                     <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white outline-none">
                        <option value="VENUE">Prostor</option>
                        <option value="SERVICE">Usluga</option>
                     </select>
                </div>
                 <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Kategorija</label>
                     <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white outline-none">
                        <option value="1">Restoran / Sala</option>
                        <option value="3">Muzika</option>
                        <option value="2">Foto / Video</option>
                        <option value="5">Dekoracija</option>
                     </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <InputField label="Grad" name="city" value={formData.city} onChange={handleChange} />
                 <InputField label="Adresa" name="address" value={formData.address} onChange={handleChange} />
            </div>

            {formData.type === 'VENUE' && (
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Kapacitet (osoba)" type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tip Prostora</label>
                        <select name="venueType" value={formData.venueType} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white outline-none">
                            <option value="Restoran">Restoran</option>
                            <option value="Svečana sala">Svečana sala</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Splav">Splav</option>
                        </select>
                    </div>
                </div>
            )}
             <InputField label="PIB (Opciono)" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="10XXXXXXX" />
        </div>

        {/* Contact Info */}
        <div className="p-4 bg-white border border-gray-100 rounded-xl space-y-4">
             <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Kontakt i Nalog</h3>
             <div className="grid grid-cols-2 gap-4">
                <InputField label="Ime kontakta" name="contactFirstName" required value={formData.contactFirstName} onChange={handleChange} error={errors.contactFirstName} />
                <InputField label="Prezime" name="contactLastName" required value={formData.contactLastName} onChange={handleChange} />
             </div>
             
             <InputField label="Email" type="email" name="email" icon={<Mail size={18} />} required value={formData.email} onChange={handleChange} error={errors.email} />
             <InputField label="Telefon" type="tel" name="phone" icon={<Phone size={18} />} required value={formData.phone} onChange={handleChange} error={errors.phone} />

             <div className="grid grid-cols-2 gap-4">
                <InputField label="Lozinka" type="password" name="password" icon={<Lock size={18} />} required value={formData.password} onChange={handleChange} error={errors.password} />
                <InputField label="Potvrda" type="password" name="confirmPassword" icon={<Lock size={18} />} required value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
             </div>
        </div>

        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Kratak opis (2-3 rečenice)</label>
            <textarea 
                name="description" 
                rows={3} 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
                value={formData.description}
                onChange={handleChange}
                placeholder="Opišite vašu ponudu..."
            ></textarea>
        </div>

        <AuthButton type="submit" loading={loading} className="mt-2">
            Registruj Biznis
        </AuthButton>
      </form>
    </div>
  );
};
