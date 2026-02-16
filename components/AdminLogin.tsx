
import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Home, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const user = await login(email, password);
        
        if (user.role === 'admin') {
            onLogin();
        } else {
            setError('Ovaj nalog nema admin prava.');
            // Force logout so they don't get stuck in a user session inside the admin route
            // (although AuthContext handles session, better to be clean)
        }
    } catch (err: any) {
        console.error("Login Error:", err);
        let msg = "Neuspešna prijava.";
        
        if (err.message) {
            if (err.message.includes("Invalid login credentials")) msg = "Pogrešan email ili lozinka. Da li ste registrovali ovaj nalog?";
            else if (err.message.includes("Email not confirmed")) msg = "Email nije potvrđen! Proverite inbox ili Supabase panel.";
            else msg = err.message;
        }
        
        setError(msg);
        alert(msg); // Explicit alert to ensure user sees it if UI doesn't update fast enough
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 animate-fade-in pt-20">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-portal-dark w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg transform rotate-3">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-portal-dark">Admin Pristup</h1>
          <p className="text-gray-500 text-sm mt-2">Sigurnosna provera za pristup panelu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                    <input 
                        type="email" 
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        placeholder="admin@svezaproslavu.rs"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Lozinka</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg border border-red-100 flex items-center justify-center gap-2">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-portal-dark text-white font-bold py-4 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Provera...' : <><span className="mr-1">Pristupi Panelu</span> <ArrowRight size={20} /></>}
            </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors font-medium">
                <Home size={16} /> Nazad na početnu
            </a>
            <p className="text-xs text-gray-400 mt-4">Zaštićena zona. Svi pristupi se beleže.</p>
        </div>
      </div>
    </div>
  );
};
