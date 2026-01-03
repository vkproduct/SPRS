
import React, { useState } from 'react';
import { Mail, Lock, Briefcase, FileText, Phone, CheckCircle, ChevronRight } from 'lucide-react';
import { loginPartner, registerPartner } from '../services/authService';

interface PartnerAuthProps {
    onLoginSuccess: () => void;
}

export const PartnerAuth: React.FC<PartnerAuthProps> = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Business Fields
    const [companyName, setCompanyName] = useState('');
    const [pib, setPib] = useState('');
    const [mb, setMb] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('VENUE');
    const [categoryId, setCategoryId] = useState('1');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegistering) {
                await registerPartner(email, password, {
                    companyName, pib, mb, phone, type, categoryId
                });
            } else {
                await loginPartner(email, password);
            }
            onLoginSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Došlo je do greške.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-portal-bg pt-36 pb-20 flex justify-center items-center px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden flex-col md:flex-row">
                
                {/* Left Side: Info */}
                <div className="md:w-5/12 bg-portal-dark text-white p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Partner Portal</h2>
                        <p className="text-gray-300 mb-8">
                            Upravljajte svojim profilom, cenama i rezervacijama na jednom mestu.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-primary" /> <span>Direktan kontakt sa klijentima</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-primary" /> <span>Bez skrivenih provizija</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-primary" /> <span>Analitika pregleda</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 text-sm text-gray-500">
                        © 2025 SveZaProslavu.rs
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-7/12 p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-portal-dark">
                            {isRegistering ? 'Registracija Biznisa' : 'Prijava'}
                        </h3>
                        <button 
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-sm text-primary font-semibold hover:underline"
                        >
                            {isRegistering ? 'Već imate nalog?' : 'Nemate nalog?'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Login Fields */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email adresa</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="email" required 
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                    placeholder="vas@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lozinka</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="password" required 
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Extra Registration Fields */}
                        {isRegistering && (
                            <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Naziv Firme / Brend</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                            type="text" required 
                                            className="w-full pl-10 p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                            placeholder="npr. Restoran Zlatni Dvor"
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PIB</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input 
                                                type="text" required 
                                                className="w-full pl-10 p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                                placeholder="10XXXXXXX"
                                                value={pib}
                                                onChange={e => setPib(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Matični Broj</label>
                                        <input 
                                            type="text" required 
                                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                            placeholder="20XXXXXX"
                                            value={mb}
                                            onChange={e => setMb(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon za kontakt</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                            type="text" required 
                                            className="w-full pl-10 p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                            placeholder="+381 6..."
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tip Usluge</label>
                                        <select 
                                            value={type} 
                                            onChange={e => setType(e.target.value)}
                                            className="w-full p-3 border rounded-lg bg-white"
                                        >
                                            <option value="VENUE">Prostor</option>
                                            <option value="SERVICE">Usluga</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategorija</label>
                                        <select 
                                            value={categoryId} 
                                            onChange={e => setCategoryId(e.target.value)}
                                            className="w-full p-3 border rounded-lg bg-white"
                                        >
                                            <option value="1">Restoran / Sala</option>
                                            <option value="2">Fotograf</option>
                                            <option value="3">Muzika</option>
                                            <option value="4">Torte</option>
                                            <option value="5">Dekoracija</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-rose-600 transition-colors flex justify-center items-center gap-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isRegistering ? 'Registruj se i nastavi' : 'Prijavi se'} <ChevronRight size={20} />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Klikom na dugme prihvatate Uslove korišćenja portala SveZaProslavu.rs
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
