
import React, { useState } from 'react';
import { InputField, AuthButton } from './SharedComponents';
import { Mail, Lock, Phone, Users, ChevronLeft } from 'lucide-react';
import { validateEmail, validatePhoneRS, registerUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

interface UserRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({ onBack, onSuccess }) => {
  const { setProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    eventDate: '',
    eventType: 'wedding' as const,
    guestCount: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on change
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "Ovo polje je obavezno";
    if (!formData.lastName) newErrors.lastName = "Ovo polje je obavezno";
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = "Email adresa nije validna";
    if (!formData.phone || !validatePhoneRS(formData.phone)) newErrors.phone = "Broj telefona nije validan (npr. 063123456)";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.password.length < 8) newErrors.password = "Lozinka mora imati minimum 8 karaktera";
    if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) newErrors.password = "Lozinka mora sadržati slova i brojeve";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Lozinke se ne podudaraju";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) return;

    setLoading(true);
    try {
        const userProfile = await registerUser({
            ...formData,
            guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined
        });
        
        // IMPORTANT: Update Context immediately for Mock Mode / immediate feedback
        setProfile(userProfile);
        
        onSuccess();
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            setError("Korisnik sa ovim email-om već postoji.");
        } else {
            setError("Došlo je do greške prilikom registracije. Pokušajte ponovo.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={step === 1 ? onBack : () => setStep(1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-portal-dark">
            {step === 1 ? 'Osnovni podaci' : 'Detalji proslave'}
        </h2>
        <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Korak {step}/2</span>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
            <>
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Ime" 
                        name="firstName" 
                        required 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        error={errors.firstName}
                    />
                    <InputField 
                        label="Prezime" 
                        name="lastName" 
                        required 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        error={errors.lastName}
                    />
                </div>
                <InputField 
                    label="Email" 
                    type="email" 
                    name="email" 
                    icon={<Mail size={18} />} 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    error={errors.email}
                />
                <InputField 
                    label="Telefon" 
                    type="tel" 
                    name="phone" 
                    icon={<Phone size={18} />} 
                    required 
                    placeholder="06..." 
                    value={formData.phone} 
                    onChange={handleChange} 
                    error={errors.phone}
                />
                
                <AuthButton 
                    type="button" 
                    className="mt-4" 
                    onClick={() => validateStep1() && setStep(2)}
                >
                    Dalje
                </AuthButton>
            </>
        )}

        {step === 2 && (
            <>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tip događaja</label>
                    <select 
                        name="eventType" 
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary bg-white"
                    >
                        <option value="wedding">Venčanje / Svadba</option>
                        <option value="birthday">Rođendan / Punoletstvo</option>
                        <option value="baptism">Krštenje</option>
                        <option value="other">Druga proslava</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Datum događaja (opciono)" 
                        type="date" 
                        name="eventDate" 
                        value={formData.eventDate} 
                        onChange={handleChange} 
                    />
                     <InputField 
                        label="Broj gostiju (cca)" 
                        type="number" 
                        name="guestCount" 
                        icon={<Users size={18} />}
                        value={formData.guestCount} 
                        onChange={handleChange} 
                    />
                </div>

                <hr className="my-2 border-gray-100" />

                <InputField 
                    label="Lozinka" 
                    type="password" 
                    name="password" 
                    icon={<Lock size={18} />} 
                    required 
                    value={formData.password} 
                    onChange={handleChange} 
                    error={errors.password}
                />
                <InputField 
                    label="Potvrdite lozinku" 
                    type="password" 
                    name="confirmPassword" 
                    icon={<Lock size={18} />} 
                    required 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    error={errors.confirmPassword}
                />

                <AuthButton type="submit" loading={loading} className="mt-4">
                    Kreiraj nalog
                </AuthButton>
            </>
        )}
      </form>
    </div>
  );
};
