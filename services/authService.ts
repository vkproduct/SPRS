
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Vendor } from '../types';

// Register a new partner
export const registerPartner = async (email: string, pass: string, businessData: any) => {
  if (!auth || !db) throw new Error("Firebase not initialized");
  
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
    cover_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3', 
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
  if (!auth) throw new Error("Firebase not initialized");
  return await signInWithEmailAndPassword(auth, email, pass);
};

// Logout
export const logoutPartner = async () => {
    if (!auth) return;
    return await signOut(auth);
};

// Get Vendor Profile by Auth UID
export const getMyVendorProfile = async (uid: string): Promise<Vendor | null> => {
    if (!db) return null;
    
    const q = query(collection(db, 'vendors'), where("ownerId", "==", uid));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    // Return the first match (a user should typically have one profile)
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Vendor;
};
