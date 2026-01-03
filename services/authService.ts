
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Vendor } from '../types';

// Helper for Mock Mode
const isMockMode = !auth || !db;

// Mock User Data for local testing
const MOCK_USER = {
    uid: 'mock-user-123',
    email: 'test@partner.com',
    displayName: 'Mock Partner'
};

// Register a new partner
export const registerPartner = async (email: string, pass: string, businessData: any) => {
  if (isMockMode) {
      console.warn("⚠️ Firebase nije konfigurisan. Simulacija registracije (Mock Mode).");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to local storage to simulate persistence
      const mockVendorData = {
          ...businessData,
          email,
          id: 'mock-vendor-id',
          name: businessData.companyName
      };
      localStorage.setItem('svezaproslavu_mock_vendor', JSON.stringify(mockVendorData));
      
      return { user: { ...MOCK_USER, email } };
  }
  
  // Real Firebase Logic
  if (!auth || !db) throw new Error("Firebase error"); // Should not happen due to check above

  // 1. Create Auth User
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // 2. Create Vendor Profile Stub linked to ownerId
  const newVendorId = `partner-${user.uid.slice(0, 8)}`;
  
  const vendorStub: any = {
    id: newVendorId,
    ownerId: user.uid,
    name: businessData.companyName,
    pib: businessData.pib,
    mb: businessData.mb,
    type: businessData.type, // 'VENUE' or 'SERVICE'
    category_id: businessData.categoryId,
    slug: businessData.companyName.toLowerCase().replace(/ /g, '-'),
    
    // Defaults
    city: 'Beograd',
    address: '',
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', 
    gallery: [],
    rating: 5.0,
    reviews_count: 0,
    features: [],
    price_range_symbol: '€€',
    contact: {
      email: email,
      phone: businessData.phone
    },
    // Type specific defaults
    pricing: {},
    ...(businessData.type === 'VENUE' ? {
        venue_type: 'Restoran',
        capacity: { min: 0, max: 100, seated: 100, cocktail: 100 }
    } : {
        service_type: 'Usluga'
    })
  };

  await setDoc(doc(db, 'vendors', newVendorId), vendorStub);
  return user;
};

// Login
export const loginPartner = async (email: string, pass: string) => {
  if (isMockMode) {
      console.warn("⚠️ Simulacija prijave (Mock Mode).");
      await new Promise(resolve => setTimeout(resolve, 500));
      return { user: { ...MOCK_USER, email } };
  }

  if (!auth) throw new Error("Firebase not initialized");
  return await signInWithEmailAndPassword(auth, email, pass);
};

// Logout
export const logoutPartner = async () => {
    if (isMockMode) {
        console.log("Mock logout");
        return;
    }
    if (!auth) return;
    return await signOut(auth);
};

// Get Vendor Profile by Auth UID
export const getMyVendorProfile = async (uid: string): Promise<Vendor | null> => {
    if (isMockMode) {
        // Return data from localStorage if available, or a default template
        const saved = localStorage.getItem('svezaproslavu_mock_vendor');
        const parsed = saved ? JSON.parse(saved) : {};

        return {
            id: 'mock-vendor-id',
            ownerId: 'mock-user-123',
            name: parsed.companyName || 'Vaša Kompanija (Demo)',
            type: parsed.type || 'VENUE',
            category_id: parsed.categoryId || '1',
            slug: 'demo-company',
            city: 'Beograd',
            address: 'Bulevar Demo 123',
            description: 'Ovo je demo profil jer Firebase nije povezan. Sve izmene ovde su privremene.',
            cover_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            gallery: [],
            rating: 5.0,
            reviews_count: 0,
            price_range_symbol: '€€',
            features: ['Demo Feature', 'WiFi'],
            contact: { 
                phone: parsed.phone || '+381 60 123 456', 
                email: parsed.email || 'demo@email.com' 
            },
            pricing: { per_person_from: 50 },
            venue_type: 'Restoran',
            capacity: { min: 50, max: 200, seated: 150, cocktail: 200 },
            pib: parsed.pib || '123456789',
            mb: parsed.mb || '12345678'
        } as Vendor;
    }

    if (!db) return null;
    
    const q = query(collection(db, 'vendors'), where("ownerId", "==", uid));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    // Return the first match (a user should typically have one profile)
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Vendor;
};
