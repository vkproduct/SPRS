
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import { 
  LogOut, LayoutDashboard, Heart, MessageSquare, Settings, 
  Calendar, CheckSquare, MapPin, Clock, User, Save
} from 'lucide-react';
import { ViewType } from '../types';

interface UserDashboardProps {
  onLogout: () => void;
  onNavigate: (view: ViewType) => void;
}

// Mock Data for UI visualization
const MOCK_FAVORITES = [
    { id: 1, name: "Restoran Filmska Zvezda", type: "Restoran", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80", location: "Beograd" },
    { id: 2, name: "Marko Jovanović Photo", type: "Fotograf", image: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=400&q=80", location: "Novi Sad" }
];

const MOCK_TASKS = [
    { id: 1, title: "Definisati budžet", done: true },
    { id: 2, title: "Napraviti spisak gostiju", done: true },
    { id: 3, title: "Rezervisati restoran", done: false },
    { id: 4, title: "Pronaći fotografa", done: false },
    { id: 5, title: "Odabrati venčanicu / odelo", done: false },
];

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, onNavigate }) => {
  const { currentUser, logout, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'inquiries' | 'settings'>('overview');
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
      firstName: '',
      lastName: '',
      email: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
      if (currentUser) {
          setSettingsForm({
              firstName: currentUser.firstName || '',
              lastName: currentUser.lastName || '',
              email: currentUser.email || ''
          });
      }
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettingsForm({ ...settingsForm, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
      if (!currentUser) return;
      setSavingSettings(true);
      try {
          await updateUserProfile(currentUser.uid, {
              firstName: settingsForm.firstName,
              lastName: settingsForm.lastName
          });
          await refreshProfile(); // Refresh context to update UI globally
          alert("Podaci uspešno sačuvani!");
      } catch (error) {
          console.error(error);
          alert("Greška pri čuvanju podataka.");
      } finally {
          setSavingSettings(false);
      }
  };

  const getEventLabel = (type?: string) => {
      switch(type) {
          case 'wedding': return 'Venčanje';
          case 'birthday': return 'Rođendan';
          case 'baptism': return 'Krštenje';
          default: return 'Proslava';
      }
  };

  const daysLeft = () => {
      if (!currentUser?.eventDate) return 0;
      const event = new Date(currentUser.eventDate);
      const now = new Date();
      const diff = event.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const remainingDays = daysLeft();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 flex">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full top-28 bottom-0 z-10">
        <div className="p-6 border-b border-gray-100">
            <div className="font-bold text-lg text-portal-dark truncate">
                {currentUser?.firstName || 'Korisnik'} {currentUser?.lastName}
            </div>
            <div className="text-xs text-gray-500 uppercase mt-1 flex items-center gap-1">
                <User size={12} /> Organizator
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {[
                { id: 'overview', label: 'Pregled', icon: LayoutDashboard },
                { id: 'favorites', label: 'Sačuvano', icon: Heart },
                { id: 'inquiries', label: 'Upiti i Poruke', icon: MessageSquare },
                { id: 'settings', label: 'Podešavanja', icon: Settings },
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <item.icon size={20} /> {item.label}
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-gray-100 pb-32">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={20} /> Odjavi se
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-24 w-full">
        
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold">{currentUser?.firstName || 'Moj'} Događaj</h1>
            </div>
            <button onClick={handleLogout} className="p-2 bg-gray-200 rounded-full text-gray-600"><LogOut size={18} /></button>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
             {[
                { id: 'overview', label: 'Pregled' },
                { id: 'favorites', label: 'Sačuvano' },
                { id: 'inquiries', label: 'Poruke' },
                { id: 'settings', label: 'Nalog' },
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === item.id ? 'bg-portal-dark text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                    {item.label}
                </button>
            ))}
        </div>

        {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
                
                {/* Hero Card */}
                <div className="bg-gradient-to-r from-portal-dark to-gray-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-md">
                            <Calendar size={14} /> {currentUser?.eventDate ? new Date(currentUser.eventDate).toLocaleDateString('sr-RS') : 'Datum nije izabran'}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {getEventLabel(currentUser?.eventType)}
                        </h1>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Dobrodošli u vaš planer. Ovde možete pratiti sve detalje organizacije na jednom mestu.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <div className="text-2xl font-bold">{remainingDays > 0 ? remainingDays : '-'}</div>
                                <div className="text-xs text-gray-400 uppercase">Dana do proslave</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <div className="text-2xl font-bold">{currentUser?.guestCount || 0}</div>
                                <div className="text-xs text-gray-400 uppercase">Gostiju</div>
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Checklist */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-portal-dark flex items-center gap-2">
                                <CheckSquare className="text-primary" size={20} /> Lista Obaveza
                            </h3>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">2/5 Završeno</span>
                        </div>
                        <div className="space-y-3">
                            {MOCK_TASKS.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-primary border-primary text-white' : 'border-gray-300 group-hover:border-primary'}`}>
                                        {task.done && <CheckSquare size={14} />}
                                    </div>
                                    <span className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                            <button className="w-full py-2 text-sm text-gray-400 hover:text-primary mt-2 font-medium border-t border-gray-100 dashed">
                                + Dodaj novu obavezu
                            </button>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-portal-dark mb-4">Brza pretraga</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => onNavigate('venues')} className="p-4 bg-gray-50 hover:bg-primary/5 hover:border-primary border border-gray-200 rounded-xl transition-all text-center group">
                                    <MapPin size={24} className="mx-auto mb-2 text-gray-500 group-hover:text-primary transition-colors" />
                                    <div className="text-sm font-bold text-gray-700 group-hover:text-primary">Pronađi Prostor</div>
                                </button>
                                <button onClick={() => onNavigate('services')} className="p-4 bg-gray-50 hover:bg-primary/5 hover:border-primary border border-gray-200 rounded-xl transition-all text-center group">
                                    <User size={24} className="mx-auto mb-2 text-gray-500 group-hover:text-primary transition-colors" />
                                    <div className="text-sm font-bold text-gray-700 group-hover:text-primary">Pronađi Usluge</div>
                                </button>
                            </div>
                        </div>

                         <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                             <h3 className="font-bold text-blue-900 mb-2">Treba vam pomoć?</h3>
                             <p className="text-sm text-blue-700 mb-4">Naš AI savetnik je spreman da odgovori na pitanja o budžetu i običajima.</p>
                             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors w-full">
                                 Pokreni AI Chat
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'favorites' && (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-portal-dark mb-6">Sačuvani Prostori i Usluge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_FAVORITES.map(fav => (
                        <div key={fav.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                            <div className="h-40 overflow-hidden relative">
                                <img src={fav.image} alt={fav.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors">
                                    <Heart size={16} fill="currentColor" />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-bold text-primary uppercase mb-1">{fav.type}</div>
                                <h3 className="font-bold text-portal-dark mb-1">{fav.name}</h3>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={14} /> {fav.location}
                                </div>
                                <button className="w-full mt-4 py-2 bg-gray-50 text-gray-700 font-bold text-xs rounded-lg hover:bg-portal-dark hover:text-white transition-colors">
                                    POGLEDAJ DETALJE
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Placeholder */}
                    <div 
                        onClick={() => onNavigate('venues')}
                        className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[280px]"
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white">
                            <Heart size={24} />
                        </div>
                        <span className="font-bold">Istraži ponudu</span>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'inquiries' && (
             <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-portal-dark mb-6">Moji Upiti</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 text-center text-gray-500">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="font-bold text-lg text-gray-700 mb-2">Još uvek nemate poruka</h3>
                        <p className="mb-6">Kada pošaljete upit restoranu ili fotografu, status ćete pratiti ovde.</p>
                        <button onClick={() => onNavigate('venues')} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-600 transition-colors">
                            Započni pretragu
                        </button>
                    </div>
                </div>
             </div>
        )}

        {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-2xl">
                <h2 className="text-2xl font-bold text-portal-dark mb-6">Podešavanja Naloga</h2>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ime</label>
                            <input 
                                name="firstName"
                                value={settingsForm.firstName} 
                                onChange={handleSettingsChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-portal-dark focus:border-primary outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prezime</label>
                            <input 
                                name="lastName"
                                value={settingsForm.lastName} 
                                onChange={handleSettingsChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-portal-dark focus:border-primary outline-none" 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email adresa</label>
                        <input disabled value={settingsForm.email} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button 
                            onClick={handleSaveSettings} 
                            disabled={savingSettings}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-rose-600 transition-colors flex items-center gap-2"
                        >
                            {savingSettings ? 'Čuvanje...' : <><Save size={16} /> Sačuvaj promene</>}
                        </button>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                         <h3 className="font-bold text-portal-dark mb-4">Promena lozinke</h3>
                         <div className="space-y-4">
                            <input type="password" placeholder="Nova lozinka" className="w-full p-3 border border-gray-200 rounded-lg" />
                            <input type="password" placeholder="Potvrdite novu lozinku" className="w-full p-3 border border-gray-200 rounded-lg" />
                            <button className="bg-portal-dark text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-black transition-colors">
                                Sačuvaj lozinku
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};
