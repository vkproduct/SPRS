
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Vendor, UserProfile, UserRole } from '../types';

// Helper for Mock Mode
const isMockMode = !auth || !db;

// --- UTILS ---
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePhoneRS = (phone: string) => {
  // Simple check for Serbian mobile/landline formats
  // Accepts: 06X..., +3816X...
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+381|0)6[0-9]{7,8}$/.test(cleaned) || /^(\+381|0)[1-3][0-9]{6,7}$/.test(cleaned);
};

// --- API ACTIONS ---

/**
 * Register a regular User (Organizer)
 */
export const registerUser = async (data: Omit<UserProfile, 'uid' | 'role' | 'createdAt'> & { password: string }) => {
  if (isMockMode) throw new Error("Firebase nije konfigurisan.");

  // 1. Create Auth User
  const userCredential = await createUserWithEmailAndPassword(auth!, data.email, data.password);
  const user = userCredential.user;

  // 2. Create User Profile in Firestore
  const userProfile: UserProfile = {
    uid: user.uid,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'user',
    createdAt: Timestamp.now(),
    eventDate: data.eventDate,
    eventType: data.eventType,
    guestCount: data.guestCount,
    preferences: data.preferences
  };

  await setDoc(doc(db!, 'users', user.uid), userProfile);
  
  // Update Display Name
  await updateProfile(user, { displayName: `${data.firstName} ${data.lastName}` });

  return userProfile;
};

/**
 * Register a Contractor (Vendor)
 */
export const registerContractor = async (
  loginData: { email: string; password: string },
  vendorData: any
) => {
  if (isMockMode) throw new Error("Firebase nije konfigurisan.");

  // 1. Create Auth User
  const userCredential = await createUserWithEmailAndPassword(auth!, loginData.email, loginData.password);
  const user = userCredential.user;

  // 2. Create Vendor Profile linked to ownerId
  // Note: We don't necessarily need a 'users' doc for contractors if we query 'vendors' by ownerId,
  // but creating a minimal user doc helps with role resolution.
  const userProfile: UserProfile = {
    uid: user.uid,
    email: loginData.email,
    firstName: vendorData.contactFirstName,
    lastName: vendorData.contactLastName,
    phone: vendorData.phone,
    role: 'contractor',
    createdAt: Timestamp.now()
  };
  await setDoc(doc(db!, 'users', user.uid), userProfile);

  // 3. Create Vendor Document
  const newVendorId = `partner-${user.uid.slice(0, 8)}`;
  
  const vendorStub: any = {
    id: newVendorId,
    ownerId: user.uid,
    name: vendorData.venueName || vendorData.companyName,
    pib: vendorData.taxId,
    type: vendorData.type || 'VENUE', 
    category_id: vendorData.category_id || '1',
    slug: (vendorData.venueName || vendorData.companyName).toLowerCase().replace(/[^a-z0-9]/g, '-'),
    city: vendorData.city,
    address: vendorData.address,
    description: vendorData.description,
    cover_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', // Default
    gallery: [],
    rating: 0,
    reviews_count: 0,
    price_range_symbol: '€€',
    features: [],
    contact: {
      email: loginData.email,
      phone: vendorData.phone
    },
    pricing: {},
    ...(vendorData.type === 'VENUE' ? {
        venue_type: vendorData.venueType || 'Restoran',
        capacity: { min: 0, max: vendorData.capacity || 100, seated: vendorData.capacity, cocktail: vendorData.capacity }
    } : {
        service_type: 'Usluga'
    })
  };

  await setDoc(doc(db!, 'vendors', newVendorId), vendorStub);
  await updateProfile(user, { displayName: vendorData.venueName });

  return { user: userProfile, vendor: vendorStub };
};

/**
 * Unified Login with Role Discovery
 */
export const loginUnified = async (email: string, pass: string) => {
  if (isMockMode) {
      // Simulation
      await new Promise(r => setTimeout(r, 800));
      return { 
          uid: 'mock-123', 
          email, 
          firstName: 'Mock', 
          lastName: 'User', 
          role: email.includes('partner') ? 'contractor' : 'user' 
      } as UserProfile;
  }

  // 1. Firebase Auth Login
  const userCredential = await signInWithEmailAndPassword(auth!, email, pass);
  const uid = userCredential.user.uid;

  // 2. Determine Role
  // First check 'users' collection
  const userDocRef = doc(db!, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
  }

  // Fallback: Check if they are a legacy vendor without a user doc
  const q = query(collection(db!, 'vendors'), where("ownerId", "==", uid));
  const vendorSnap = await getDocs(q);

  if (!vendorSnap.empty) {
      // Reconstruct minimal profile for legacy vendor
      return {
          uid,
          email,
          firstName: 'Partner',
          lastName: '',
          phone: '',
          role: 'contractor',
          createdAt: Timestamp.now()
      } as UserProfile;
  }

  // Fallback 2: Admin?
  if (email === 'admin@svezaproslavu.rs') { // Or check custom claims
       return {
          uid,
          email,
          firstName: 'Admin',
          lastName: '',
          phone: '',
          role: 'admin',
          createdAt: Timestamp.now()
      } as UserProfile;
  }

  throw new Error("Profil nije pronađen.");
};

export const logout = async () => {
    if (isMockMode) return;
    return await signOut(auth!);
};

/**
 * Get Contractor Profile details
 */
export const getMyVendorProfile = async (uid: string): Promise<Vendor | null> => {
    if (isMockMode) return null;
    const q = query(collection(db!, 'vendors'), where("ownerId", "==", uid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Vendor;
};
