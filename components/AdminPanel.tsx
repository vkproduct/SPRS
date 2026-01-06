
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, MapPin, MessageSquare, Settings, LogOut, 
  Plus, Edit, Trash2, Search, Mail, Image as ImageIcon, Save
} from 'lucide-react';
import { getVendors, deleteVendor, getInquiries, updateInquiryStatus, getSiteContent, updateSiteContent } from '../services/vendorService';
import { Vendor, Inquiry } from '../types';
import { AdminAddVendor } from './AdminAddVendor';

// ------------------------------------------------------------------
// 1. MEMOIZED SUB-COMPONENTS
// ------------------------------------------------------------------

const AdminSidebar = React.memo(({ currentView, onChangeView, onLogout }: { currentView: string, onChangeView: (v: any) => void, onLogout: () => void }) => (
    <aside className="w-64 bg-portal-dark text-white h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-1">SveZaProslavu.rs</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={() => onChangeView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
        </button>
        <button onClick={() => onChangeView('venues')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${['venues','add-venue','edit-venue'].includes(currentView) ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <MapPin size={20} /> Venues
        </button>
        <button onClick={() => onChangeView('inquiries')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'inquiries' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <MessageSquare size={20} /> Inquiries
        </button>
        <button onClick={() => onChangeView('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'content' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <ImageIcon size={20} /> Site Content
        </button>
        <button onClick={() => onChangeView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'settings' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Settings size={20} /> Settings
        </button>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors">
            <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
));

const DashboardView = React.memo(({ stats, inquiries, onViewInquiries }: { stats: any, inquiries: Inquiry[], onViewInquiries: () => void }) => {
    const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
    
    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><MapPin size={24} /></div>
                    <div>
                        <div className="text-3xl font-bold text-gray-800">{stats.venues || 0}</div>
                        <div className="text-sm text-gray-500">Total Venues</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full"><MessageSquare size={24} /></div>
                    <div>
                        <div className="text-3xl font-bold text-gray-800">{stats.inquiries || 0}</div>
                        <div className="text-sm text-gray-500">Total Inquiries</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-full"><Mail size={24} /></div>
                    <div>
                        <div className="text-3xl font-bold text-gray-800">{stats.unread || 0}</div>
                        <div className="text-sm text-gray-500">New Messages</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Recent Inquiries</h3>
                    <button onClick={onViewInquiries} className="text-sm text-primary hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">From</th>
                                <th className="px-6 py-3">Venue</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeInquiries.slice(0, 5).map(inq => (
                                <tr key={inq.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${inq.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {(inq.status || 'new').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{inq.userName}</td>
                                    <td className="px-6 py-4">{inq.vendorName}</td>
                                    <td className="px-6 py-4">{inq.date}</td>
                                </tr>
                            ))}
                            {safeInquiries.length === 0 && (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Nema novih upita.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

const VenuesView = React.memo(({ vendors, onAdd, onEdit, onDelete }: { vendors: Vendor[], onAdd: () => void, onEdit: (v:Vendor) => void, onDelete: (id:string) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const safeVendors = Array.isArray(vendors) ? vendors : [];
    
    const filtered = React.useMemo(() => safeVendors.filter(v => 
        (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (v.city || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [safeVendors, searchTerm]);

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Venues Management</h2>
                <button onClick={onAdd} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-600 transition-colors">
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search venues..." 
                        className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:border-primary"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">City</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(vendor => (
                            <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                                <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{vendor.type}</span></td>
                                <td className="px-6 py-4 text-gray-500">{vendor.city}</td>
                                <td className="px-6 py-4">{vendor.rating} ★</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => onEdit(vendor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                                    <button onClick={() => onDelete(vendor.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                         {filtered.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nema rezultata.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

const InquiriesView = React.memo(({ inquiries, onStatusChange }: { inquiries: Inquiry[], onStatusChange: (id:string, status:any) => void }) => {
    const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Inquiries & Messages</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Venue</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Guests</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {safeInquiries.map(inq => (
                            <tr key={inq.id} className={`border-b border-gray-100 hover:bg-gray-50 ${inq.status === 'new' ? 'bg-red-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${inq.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {(inq.status || 'new').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold">{inq.userName}</div>
                                    <div className="text-gray-500 text-xs">{inq.contact}</div>
                                </td>
                                <td className="px-6 py-4">{inq.vendorName}</td>
                                <td className="px-6 py-4">{inq.date}</td>
                                <td className="px-6 py-4">{inq.guestCount}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    {inq.status !== 'read' && inq.status !== 'replied' && (
                                        <button onClick={() => onStatusChange(inq.id, 'read')} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-xs px-2">Mark Read</button>
                                    )}
                                    {inq.status !== 'replied' && (
                                        <button onClick={() => onStatusChange(inq.id, 'replied')} className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs px-2">Replied</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {safeInquiries.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nema poruka.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

const ContentView = () => {
    const [content, setContent] = useState<any>({
        heroTitle: '', heroSubtitle: '', heroImage: '', preheaderText: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSiteContent().then(data => { if (data) setContent(data); });
    }, []);

    const handleSaveContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await updateSiteContent(content);
        setSaving(false);
        alert("Homepage content updated!");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Homepage Content Editor</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSaveContent} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold border-b pb-2 mb-4">Hero Section</h3>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
                        <textarea name="heroTitle" rows={3} value={content.heroTitle || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                        <textarea name="heroSubtitle" rows={3} value={content.heroSubtitle || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Image URL</label>
                        <input name="heroImage" value={content.heroImage || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preheader Text</label>
                        <input name="preheaderText" value={content.preheaderText || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition-colors flex justify-center items-center gap-2 mt-4">
                        {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// 2. MAIN COMPONENT
// ------------------------------------------------------------------

type AdminView = 'dashboard' | 'venues' | 'inquiries' | 'settings' | 'add-venue' | 'edit-venue' | 'content';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [stats, setStats] = useState({ venues: 0, inquiries: 0, unread: 0 });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Stable fetchData with useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const [vData, iData] = await Promise.all([ getVendors(), getInquiries() ]);
        // Ensure arrays
        const safeVData = Array.isArray(vData) ? vData : [];
        const safeIData = Array.isArray(iData) ? iData : [];
        
        setVendors(safeVData);
        setInquiries(safeIData);
        setStats({
            venues: safeVData.length,
            inquiries: safeIData.length,
            unread: safeIData.filter(i => (i.status || 'new') === 'new').length
        });
    } catch (e) {
        console.error("Failed to fetch admin data", e);
        setVendors([]);
        setInquiries([]);
    } finally {
        setLoading(false);
    }
  }, []);

  // Load Data on Mount
  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Memoized Handlers
  const handleEditVendor = useCallback((vendor: Vendor) => {
    setEditingVendor(vendor);
    setCurrentView('edit-venue');
  }, []);
  
  const handleAddVendorClick = useCallback(() => {
    setEditingVendor(null);
    setCurrentView('add-venue');
  }, []);

  const handleDeleteVendor = useCallback(async (id: string) => {
    if (confirm('Are you sure?')) {
        await deleteVendor(id);
        fetchData(); 
    }
  }, [fetchData]);

  const handleStatusChange = useCallback(async (id: string, newStatus: 'read' | 'replied') => {
    await updateInquiryStatus(id, newStatus);
    fetchData(); 
  }, [fetchData]);

  // View Router
  const renderView = () => {
      switch(currentView) {
          case 'dashboard': 
              return <DashboardView stats={stats} inquiries={inquiries} onViewInquiries={() => setCurrentView('inquiries')} />;
          case 'venues': 
              return <VenuesView vendors={vendors} onAdd={handleAddVendorClick} onEdit={handleEditVendor} onDelete={handleDeleteVendor} />;
          case 'inquiries': 
              return <InquiriesView inquiries={inquiries} onStatusChange={handleStatusChange} />;
          case 'content': 
              return <ContentView />;
          case 'add-venue':
          case 'edit-venue':
              return <AdminAddVendor onBack={() => { fetchData(); setCurrentView('venues'); }} initialData={editingVendor} />;
          case 'settings':
              return <div className="p-8"><h2>Settings Coming Soon...</h2></div>;
          default:
              return <DashboardView stats={stats} inquiries={inquiries} onViewInquiries={() => setCurrentView('inquiries')} />;
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar currentView={currentView} onChangeView={setCurrentView} onLogout={onLogout} />
      <main className="ml-64 min-h-screen">
        {loading && vendors.length === 0 ? <div className="p-8">Loading data...</div> : renderView()}
      </main>
    </div>
  );
};

export default AdminPanel;
