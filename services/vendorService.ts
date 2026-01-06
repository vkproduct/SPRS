
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, Timestamp, doc, setDoc, writeBatch, Firestore, updateDoc, deleteDoc, orderBy, getDoc } from 'firebase/firestore';
import { vendors as localVendors } from '../data/database';
import { Vendor, VendorType, Inquiry } from '../types';

const VENDORS_COLLECTION = 'vendors';
const INQUIRIES_COLLECTION = 'inquiries';
const SETTINGS_COLLECTION = 'settings';

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
 * Updates an existing Vendor
 */
export const updateVendor = async (id: string, vendorData: Partial<Vendor>) => {
    if (!db) return false;
    try {
        const docRef = doc(db, VENDORS_COLLECTION, id);
        await updateDoc(docRef, vendorData);
        return true;
    } catch (error) {
        console.error("Error updating vendor:", error);
        return false;
    }
};

/**
 * Deletes a Vendor
 */
export const deleteVendor = async (id: string) => {
    if (!db) return false;
    try {
        await deleteDoc(doc(db, VENDORS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error("Error deleting vendor:", error);
        return false;
    }
};

/**
 * Adds multiple vendors at once (Batch)
 */
export const addVendorsBatch = async (vendorsData: Omit<Vendor, 'id'>[]) => {
    if (!db) {
        alert("Firebase is not configured.");
        return false;
    }
    
    const firestore: Firestore = db;

    try {
        const batch = writeBatch(firestore);
        
        vendorsData.forEach(vendor => {
            const docRef = doc(collection(firestore, VENDORS_COLLECTION)); // Generate new ID
            batch.set(docRef, vendor);
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error("Batch upload error:", error);
        alert("Greška pri masovnom dodavanju.");
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
 * Get all inquiries (Admin)
 */
export const getInquiries = async (): Promise<Inquiry[]> => {
    if (!db) return [];
    try {
        // Order by date desc
        const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
    } catch (error) {
        console.error("Error getting inquiries:", error);
        return [];
    }
};

/**
 * Update Inquiry Status
 */
export const updateInquiryStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    if (!db) return false;
    try {
        await updateDoc(doc(db, INQUIRIES_COLLECTION, id), { status });
        return true;
    } catch (error) {
        console.error("Error updating inquiry:", error);
        return false;
    }
};

/**
 * Get Site Content (Homepage settings)
 */
export const getSiteContent = async () => {
  if (!db) return null;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'homepage');
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data();
    return null;
  } catch (error) {
    console.error("Error fetching site content:", error);
    return null;
  }
};

/**
 * Update Site Content
 */
export const updateSiteContent = async (data: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, 'homepage'), data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating site content:", error);
    return false;
  }
};

/**
 * ONE-TIME USE: Uploads local data to Firebase.
 */
export const seedDatabase = async () => {
    if (!db) return;
    
    const firestore: Firestore = db;

    console.log("Starting database seed...");
    let count = 0;
    
    for (const vendor of localVendors) {
        try {
            await setDoc(doc(firestore, VENDORS_COLLECTION, vendor.id), vendor);
            count++;
            console.log(`Uploaded: ${vendor.name}`);
        } catch (e) {
            console.error(`Failed to upload ${vendor.name}:`, e);
        }
    }
    console.log(`Seeding complete. Uploaded ${count} vendors.`);
};
