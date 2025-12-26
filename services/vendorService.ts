
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { vendors as localVendors } from '../data/database';
import { Vendor, VendorType } from '../types';

const VENDORS_COLLECTION = 'vendors';
const INQUIRIES_COLLECTION = 'inquiries';

// Helper to filter local data (DRY principle)
const getLocalFiltered = (filterType?: VendorType, categoryId?: string) => {
    let result = localVendors;
    if (filterType) {
        result = result.filter(v => v.type === filterType);
    }
    if (categoryId && categoryId !== 'all') {
        result = result.filter(v => v.category_id === categoryId);
    }
    return result;
};

/**
 * Fetches vendors based on filter type.
 * Tries Firebase first. If empty or error, falls back to local data.
 */
export const getVendors = async (filterType?: VendorType, categoryId?: string): Promise<Vendor[]> => {
  if (!db) {
    console.warn("Firebase not initialized. Using local data.");
    return getLocalFiltered(filterType, categoryId);
  }

  try {
    const constraints = [];
    if (filterType) constraints.push(where("type", "==", filterType));
    if (categoryId && categoryId !== 'all') constraints.push(where("category_id", "==", categoryId));

    const q = query(collection(db, VENDORS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    // IF Firebase is empty, we return local data so the site isn't blank
    if (querySnapshot.empty) {
        console.log("Firebase connection successful, but collection is empty. Serving local fallback data.");
        return getLocalFiltered(filterType, categoryId);
    }

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
  } catch (error) {
    console.error("Error fetching vendors from Firebase (using fallback):", error);
    return getLocalFiltered(filterType, categoryId);
  }
};

/**
 * Adds a new Vendor to Firestore
 */
export const addVendor = async (vendorData: Omit<Vendor, 'id'>) => {
    if (!db) {
        alert("Firebase is not configured.");
        return false;
    }
    try {
        await addDoc(collection(db, VENDORS_COLLECTION), vendorData);
        return true;
    } catch (error) {
        console.error("Error adding vendor:", error);
        alert("Greška pri dodavanju. Proverite Firestore Rules (write permissions).");
        return false;
    }
};

/**
 * Submits a new inquiry securely.
 */
export const submitInquiry = async (data: {
    vendorId: string;
    vendorName: string;
    date: string;
    guestCount: number;
    userName: string;
    contact: string;
}) => {
    if (!db) {
        console.log("Mock submit inquiry:", data);
        return true;
    }

    try {
        await addDoc(collection(db, INQUIRIES_COLLECTION), {
            ...data,
            createdAt: Timestamp.now(),
            status: 'new'
        });
        return true;
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return false;
    }
};

/**
 * ONE-TIME USE: Uploads local data to Firebase.
 */
export const seedDatabase = async () => {
    if (!db) return;
    console.log("Starting database seed...");
    let count = 0;
    
    for (const vendor of localVendors) {
        try {
            await setDoc(doc(db, VENDORS_COLLECTION, vendor.id), vendor);
            count++;
            console.log(`Uploaded: ${vendor.name}`);
        } catch (e) {
            console.error(`Failed to upload ${vendor.name}:`, e);
        }
    }
    console.log(`Seeding complete. Uploaded ${count} vendors.`);
};
