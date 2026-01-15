
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, Vendor } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  vendorProfile: Vendor | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  vendorProfile: null,
  loading: true,
  refreshProfile: async () => {}
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
        // Map snake_case to CamelCase manually if needed, or rely on loose types if fields match 
        // (Supabase returns snake_case, our interface expects camelCase for multi-word fields)
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

      // 2. Try to get Vendor Profile (if contractor or if profile missing but might be legacy)
      let vendor: Vendor | null = null;
      if (profile?.role === 'contractor' || !profile) {
        const { data: vDoc } = await supabase.from('vendors').select('*').eq('owner_id', uid).maybeSingle();
        
        if (vDoc) {
            vendor = { ...vDoc, ownerId: vDoc.owner_id } as Vendor;
            
            // Backfill profile if missing (Legacy support)
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

    // Check active session
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
    const { data: { user } } = await supabase!.auth.getUser();
    if (user) {
        await fetchUserData(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, vendorProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
