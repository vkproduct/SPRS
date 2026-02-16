
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RoleSelection } from './RoleSelection';
import { UserRegistration } from './UserRegistration';
import { ContractorRegistration } from './ContractorRegistration';
import { X, CheckCircle } from 'lucide-react';
import { ViewType } from '../../types';

interface AuthPageProps {
  initialView?: 'login' | 'register';
  onNavigate: (view: ViewType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialView = 'login', onNavigate }) => {
  const [view, setView] = useState<'login' | 'role_select' | 'register_user' | 'register_contractor' | 'success'>(
      initialView === 'register' ? 'role_select' : 'login'
  );
  
  const [successMessage, setSuccessMessage] = useState({ title: '', text: '', btnText: '', target: '' as ViewType });

  const handleLoginSuccess = (role: string) => {
    // Redirect logic based on role
    if (role === 'admin') {
        onNavigate('admin-panel');
    } else {
        // Both 'contractor' and 'user' go to 'partner-dashboard'.
        // App.tsx handles the conditional rendering (PartnerDashboard vs UserDashboard) based on role.
        onNavigate('partner-dashboard');
    }
  };

  const handleRegistrationSuccess = (role: 'user' | 'contractor') => {
      setSuccessMessage({
          title: 'Uspešna registracija!',
          text: role === 'user' 
            ? 'Vaš nalog je kreiran. Dobrodošli u vaš lični planer.'
            : 'Vaš biznis nalog je kreiran. Dobrodošli u partner mrežu.',
          btnText: 'Idi u Lični Kabinet',
          target: 'partner-dashboard'
      });
      setView('success');
  };

  const closeAuth = () => {
      onNavigate('home');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
           <div className="font-poppins font-bold text-xl text-primary">SveZaProslavu.rs</div>
           <button onClick={closeAuth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
             <X size={24} className="text-gray-500" />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {view === 'login' && (
                <LoginForm 
                    onSuccess={handleLoginSuccess} 
                    onRegisterClick={() => setView('role_select')} 
                />
            )}

            {view === 'role_select' && (
                <RoleSelection onSelect={(role) => setView(role === 'user' ? 'register_user' : 'register_contractor')} />
            )}

            {view === 'register_user' && (
                <UserRegistration 
                    onBack={() => setView('role_select')} 
                    onSuccess={() => handleRegistrationSuccess('user')} 
                />
            )}

            {view === 'register_contractor' && (
                <ContractorRegistration 
                    onBack={() => setView('role_select')} 
                    onSuccess={() => handleRegistrationSuccess('contractor')} 
                />
            )}

            {view === 'success' && (
                <div className="text-center py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-portal-dark mb-2">{successMessage.title}</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">{successMessage.text}</p>
                    <button 
                        onClick={() => onNavigate(successMessage.target)}
                        className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-rose-600 transition-colors shadow-lg"
                    >
                        {successMessage.btnText}
                    </button>
                </div>
            )}
        </div>
        
        {/* Footer for generic views */}
        {(view === 'login' || view === 'role_select') && (
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                Zaštita podataka je naš prioritet. Vaše informacije su sigurne.
            </div>
        )}

      </div>
    </div>
  );
};
