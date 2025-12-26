
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';
import { vendors as localVendors } from '../data/database';
import { Vendor, VendorType } from '../types';

const VENDORS_COLLECTION = 'vendors';
const INQUIRIES_COLLECTION = 'inquiries';

/**
 * Fetches vendors based on filter type.
 * Tries Firebase first, falls back to local data.
 */
export const getVendors = async (filterType?: VendorType, categoryId?: string): Promise<Vendor[]> => {
  if (!db) {
    // Fallback to local data
    let result = localVendors;
    if (filterType) {
        result = result.filter(v => v.type === filterType);
    }
    if (categoryId && categoryId !== 'all') {
        result = result.filter(v => v.category_id === categoryId);
    }
    return result;
  }

  try {
    const constraints = [];
    if (filterType) constraints.push(where("type", "==", filterType));
    if (categoryId && categoryId !== 'all') constraints.push(where("category_id", "==", categoryId));

    const q = query(collection(db, VENDORS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
  } catch (error) {
    console.error("Error fetching vendors from Firebase:", error);
    return localVendors; // Fallback on error
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
