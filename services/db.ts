import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    DocumentData,
    QuerySnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vendor } from '../types';

const VENDORS_COLLECTION = 'vendors';
const INQUIRIES_COLLECTION = 'inquiries';

/**
 * Fetch all vendors from Firestore
 */
export const getVendors = async (): Promise<Vendor[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, VENDORS_COLLECTION));
        return mapSnapshotToVendors(querySnapshot);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return [];
    }
};

/**
 * Fetch a single vendor by Slug
 */
export const getVendorBySlug = async (slug: string): Promise<Vendor | null> => {
    try {
        const q = query(collection(db, VENDORS_COLLECTION), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Vendor;
        }
        return null;
    } catch (error) {
        console.error("Error fetching vendor by slug:", error);
        return null;
    }
};

/**
 * Submit an inquiry
 */
export const submitInquiry = async (inquiry: any): Promise<boolean> => {
    try {
        await addDoc(collection(db, INQUIRIES_COLLECTION), {
            ...inquiry,
            createdAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return false;
    }
};

// Helper: Map snapshot to typed array
function mapSnapshotToVendors(snapshot: QuerySnapshot<DocumentData>): Vendor[] {
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Vendor[];
}
