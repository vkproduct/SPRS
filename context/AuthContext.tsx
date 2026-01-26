
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, Vendor } from '../types';
import { loginUnified, logout as authLogout, getMyVendorProfile } from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile | null;
  vendorProfile: Vendor | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  login: (email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  setProfile: (user: UserProfile) => void; // Helper for manual updates (e.g. after registration)
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  vendorProfile: null,
  loading: true,
  refreshProfile: async () => {},
  login: async () => { throw new Error("Context not initialized"); },
  logout: async () => {},
  setProfile: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [vendorProfile, setVendorProfile] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    if (!supabase) return;

    try {
      // 1. Try to get User Profile
      let profile: UserProfile | null = null;
      const { data: userDoc, error } = await supabase.from('users').select('*').eq('uid', uid).maybeSingle();
      
      if (userDoc) {
        profile = {
             uid: userDoc.uid,
             email: userDoc.email,
             firstName: userDoc.first_name,
             lastName: userDoc.last_name,
             phone: userDoc.phone,
             role: userDoc.role,
             createdAt: userDoc.created_at,
             eventDate: userDoc.event_date,
             eventType: userDoc.event_type,
             guestCount: userDoc.guest_count,
             preferences: userDoc.preferences
        } as UserProfile;
      }

      // 2. Try to get Vendor Profile
      let vendor: Vendor | null = null;
      if (profile?.role === 'contractor' || !profile) {
        const { data: vDoc } = await supabase.from('vendors').select('*').eq('owner_id', uid).maybeSingle();
        
        if (vDoc) {
            vendor = { ...vDoc, ownerId: vDoc.owner_id } as Vendor;
            
            // Backfill profile if missing
            if (!profile) {
                const { data: { user } } = await supabase.auth.getUser();
                profile = {
                    uid,
                    email: user?.email || '',
                    firstName: vendor.name,
                    lastName: '',
                    phone: vendor.contact.phone,
                    role: 'contractor',
                    createdAt: new Date().toISOString()
                };
            }
        }
      }

      setCurrentUser(profile);
      setVendorProfile(vendor);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (!supabase) {
        setLoading(false);
        return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setCurrentUser(null);
        setVendorProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await fetchUserData(user.id);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
        const profile = await loginUnified(email, pass);
        setCurrentUser(profile);
        
        if (profile.role === 'contractor' || profile.role === 'admin') {
            const vDoc = await getMyVendorProfile(profile.uid);
            setVendorProfile(vDoc);
        }
        return profile;
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
      await authLogout();
      setCurrentUser(null);
      setVendorProfile(null);
  };

  const setProfile = (user: UserProfile) => {
      setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, vendorProfile, loading, refreshProfile, login, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
