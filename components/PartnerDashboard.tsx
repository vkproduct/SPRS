
import React, { useEffect, useState } from 'react';
import { getMyVendorProfile, logoutPartner } from '../services/authService';
import { Vendor } from '../types';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, LogOut, LayoutDashboard, Edit, Save, Eye, MousePointer } from 'lucide-react';

interface PartnerDashboardProps {
    onLogout: () => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ onLogout }) => {
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview');

    // Edit Form State
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            // SCENARIO 1: Real Firebase
            if (auth && auth.currentUser) {
                const profile = await getMyVendorProfile(auth.currentUser.uid);
                setVendor(profile);
                if (profile) setFormData(profile);
            } 
            // SCENARIO 2: Mock Mode (Firebase not init)
            else if (!auth) {
                const profile = await getMyVendorProfile('mock-uid');
                setVendor(profile);
                if (profile) setFormData(profile);
            }
            
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await logoutPartner();
        onLogout();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        // Mock Save
        if (!db) {
            await new Promise(r => setTimeout(r, 600)); // Fake delay
            setVendor({ ...vendor, ...formData });
            alert("Profil uspešno ažuriran! (Lokalna simulacija)");
            setSaving(false);
            return;
        }

        // Real Save
        if (!vendor) return;
        try {
            await updateDoc(doc(db, 'vendors', vendor.id), formData);
            setVendor({ ...vendor, ...formData });
            alert("Profil uspešno ažuriran!");
        } catch (error) {
            console.error("Error updating:", error);
            alert("Greška pri čuvanju.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-36 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (!vendor) return (
        <div className="min-h-screen pt-36 px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Profil nije pronađen</h2>
            <p className="mb-4">Izgleda da nemate povezan biznis profil.</p>
            <button onClick={handleLogout} className="text-primary hover:underline">Odjavi se</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-28 flex">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full top-28 bottom-0 z-10">
                <div className="p-6 border-b border-gray-100">
                    <div className="font-bold text-lg text-portal-dark truncate">{vendor.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{vendor.type} • {vendor.category_id === '1' ? 'Restoran' : 'Usluga'}</div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={20} /> Pregled
                    </button>
                    <button 
                        onClick={() => setActiveTab('edit')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'edit' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Edit size={20} /> Izmeni Profil
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100 pb-32">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={20} /> Odjavi se
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-12 pb-24 overflow-y-auto">
                
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">{vendor.name}</h1>
                    <button onClick={handleLogout} className="p-2 bg-gray-200 rounded-full"><LogOut size={18} /></button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        <h1 className="text-3xl font-bold text-portal-dark">Dobrodošli nazad!</h1>
                        
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-full"><Eye size={24} /></div>
                                    <div className="text-gray-500 text-sm font-medium">Pregledi Profila</div>
                                </div>
                                <div className="text-3xl font-bold text-portal-dark ml-1">1,245</div>
                                <div className="text-xs text-green-500 ml-1 font-medium">+12% ovog meseca</div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-purple-50 text-purple-500 rounded-full"><MousePointer size={24} /></div>
                                    <div className="text-gray-500 text-sm font-medium">Klikovi na Kontakt</div>
                                </div>
                                <div className="text-3xl font-bold text-portal-dark ml-1">86</div>
                                <div className="text-xs text-green-500 ml-1 font-medium">+5% ovog meseca</div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-full"><User size={24} /></div>
                                    <div className="text-gray-500 text-sm font-medium">Paket</div>
                                </div>
                                <div className="text-3xl font-bold text-portal-dark ml-1">Standard</div>
                                <div className="text-xs text-blue-500 ml-1 font-medium hover:underline cursor-pointer">Nadogradi</div>
                            </div>
                        </div>

                        {/* Company Info Box */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-4">Pravni Podaci</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase mb-1">PIB</span>
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{vendor.pib || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase mb-1">Matični Broj</span>
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{vendor.mb || '-'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-gray-400 text-xs uppercase mb-1">Email za račun</span>
                                    {/* Fix: Optional chaining for auth */}
                                    <span className="font-medium">{auth?.currentUser?.email || (vendor.contact?.email)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'edit' && (
                    <div className="max-w-3xl animate-fade-in">
                        <h1 className="text-2xl font-bold text-portal-dark mb-6">Izmena Profila</h1>
                        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Naziv</label>
                                    <input name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grad</label>
                                    <input name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresa</label>
                                <input name="address" value={formData.address || ''} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Opis</label>
                                <textarea name="description" rows={5} value={formData.description || ''} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Glavna Slika (URL)</label>
                                <input name="cover_image" value={formData.cover_image || ''} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                                {formData.cover_image && <img src={formData.cover_image} alt="Preview" className="h-32 w-full object-cover rounded-lg mt-2" />}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2">
                                    {saving ? 'Čuvanje...' : <><Save size={18} /> Sačuvaj Izmene</>}
                                </button>
                            </div>

                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};
