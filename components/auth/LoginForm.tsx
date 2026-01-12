
import React, { useState } from 'react';
import { InputField, AuthButton } from './SharedComponents';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginUnified } from '../../services/authService';

interface LoginFormProps {
  onSuccess: (role: string) => void;
  onRegisterClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const profile = await loginUnified(email, password);
        
        if (rememberMe) {
            localStorage.setItem('svezaproslavu_remember', email);
        } else {
            localStorage.removeItem('svezaproslavu_remember');
        }

        onSuccess(profile.role);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            setError("Pogrešan email ili lozinka.");
        } else {
            setError(err.message || "Došlo je do greške pri prijavi.");
        }
    } finally {
        setLoading(false);
    }
  };

  // Pre-fill email if remembered
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('svezaproslavu_remember');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-portal-dark">Dobrodošli nazad</h2>
        <p className="text-gray-500">Prijavite se za pristup nalogu</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2 border border-red-100">
            <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField 
            label="Email adresa" 
            type="email" 
            icon={<Mail size={18} />} 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        
        <div>
            <InputField 
                label="Lozinka" 
                type="password" 
                icon={<Lock size={18} />} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2 text-sm">
                 <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-primary focus:ring-primary" 
                    />
                    Zapamti me
                 </label>
                 <a href="#" className="text-primary font-bold hover:underline">Zaboravili ste lozinku?</a>
            </div>
        </div>

        <AuthButton type="submit" loading={loading} className="mt-2">
            Prijavi se
        </AuthButton>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-gray-100">
        <p className="text-gray-600">
            Nemate nalog?{' '}
            <button onClick={onRegisterClick} className="text-primary font-bold hover:underline">
                Registrujte se
            </button>
        </p>
      </div>
    </div>
  );
};
