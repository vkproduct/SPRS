
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
  setProfile: (user: UserProfile) => void; 
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
      // 0. Get Auth User details first (Reliable source of truth for email)
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const currentEmail = authUser?.email?.toLowerCase().trim();
      const isAdminEmail = currentEmail === 'admin@svezaproslavu.rs';

      // 1. Try to get User Profile from DB
      let profile: UserProfile | null = null;
      const { data: userDoc } = await supabase.from('users').select('*').eq('uid', uid).maybeSingle();
      
      if (userDoc) {
        // DB Profile found
        profile = {
             uid: userDoc.uid,
             email: userDoc.email,
             firstName: userDoc.first_name,
             lastName: userDoc.last_name,
             phone: userDoc.phone,
             // SAFETY NET: Force admin role if email matches, regardless of DB role
             role: isAdminEmail ? 'admin' : userDoc.role, 
             createdAt: userDoc.created_at,
             eventDate: userDoc.event_date,
             eventType: userDoc.event_type,
             guestCount: userDoc.guest_count,
             preferences: userDoc.preferences
        } as UserProfile;
      } else if (isAdminEmail && authUser) {
          // DB Profile NOT found, but is Admin Email -> Create In-Memory Admin Profile
          // This allows login even if DB 'users' table is empty/broken/RLS-blocked
          console.warn("Admin profile missing in DB. Using in-memory fallback.");
          profile = {
              uid: authUser.id,
              email: currentEmail!,
              firstName: 'Admin',
              lastName: 'Superuser',
              phone: '',
              role: 'admin',
              createdAt: new Date().toISOString()
          };
      }

      // 2. Try to get Vendor Profile (if not admin)
      let vendor: Vendor | null = null;
      
      // If we still don't have a profile (regular user missing in DB), or if it's a contractor
      if (!profile || profile.role === 'contractor') {
        const { data: vDoc } = await supabase.from('vendors').select('*').eq('owner_id', uid).maybeSingle();
        
        if (vDoc) {
            vendor = { ...vDoc, ownerId: vDoc.owner_id } as Vendor;
            
            // Backfill profile if missing (Contractor found in vendors table but not users table)
            if (!profile && authUser) {
                profile = {
                    uid: authUser.id,
                    email: authUser.email || '',
                    firstName: vendor.name,
                    lastName: '',
                    phone: vendor.contact.phone,
                    role: 'contractor',
                    createdAt: new Date().toISOString()
                };
            }
        }
      }

      // 3. Final Fallback for regular users missing in DB (e.g. RLS blocked insert on signup)
      if (!profile && authUser) {
          // Check metadata for role
          const metaRole = authUser.user_metadata?.role || 'user';
          profile = {
              uid: authUser.id,
              email: authUser.email || '',
              firstName: authUser.user_metadata?.first_name || 'Korisnik',
              lastName: authUser.user_metadata?.last_name || '',
              phone: '',
              role: metaRole,
              createdAt: new Date().toISOString()
          };
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

    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // We await this to ensure state is consistent
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
        // We set state immediately for responsiveness
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
