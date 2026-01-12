
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
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
    try {
      // 1. Try to get User Profile
      let profile: UserProfile | null = null;
      const userDoc = await getDoc(doc(db!, 'users', uid));
      
      if (userDoc.exists()) {
        profile = userDoc.data() as UserProfile;
      }

      // 2. Try to get Vendor Profile (if contractor)
      let vendor: Vendor | null = null;
      // Check if user is contractor OR if we didn't find a user profile but they might be a legacy vendor
      if (profile?.role === 'contractor' || !profile) {
        const q = query(collection(db!, 'vendors'), where("ownerId", "==", uid));
        const vSnap = await getDocs(q);
        if (!vSnap.empty) {
            vendor = { id: vSnap.docs[0].id, ...vSnap.docs[0].data() } as Vendor;
            
            // Backfill profile if missing (Legacy support)
            if (!profile) {
                profile = {
                    uid,
                    email: auth?.currentUser?.email || '',
                    firstName: vendor.name,
                    lastName: '',
                    phone: vendor.contact.phone,
                    role: 'contractor',
                    createdAt: new Date()
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
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setCurrentUser(null);
        setVendorProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (auth?.currentUser) {
        await fetchUserData(auth.currentUser.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, vendorProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
