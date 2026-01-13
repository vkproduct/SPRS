
import { supabase } from '../lib/supabase';
import { vendors as localVendors } from '../data/database';
import { Vendor, VendorType, Inquiry } from '../types';

const VENDORS_TABLE = 'vendors';
const INQUIRIES_TABLE = 'inquiries';
const SETTINGS_TABLE = 'settings';

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
 */
export const getVendors = async (filterType?: VendorType, categoryId?: string): Promise<Vendor[]> => {
  if (!supabase) {
    console.warn("Supabase not initialized. Using local data.");
    return getLocalFiltered(filterType, categoryId);
  }

  try {
    let query = supabase.from(VENDORS_TABLE).select('*');

    if (filterType) {
        query = query.eq('type', filterType);
    }
    if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    
    if (error) {
        throw error;
    }

    // IF DB is empty, we return local data so the site isn't blank
    if (!data || data.length === 0) {
        // Only return local data if there was no specific query filtering that returned 0
        // But for this project, let's fallback if total count is low or connection issues.
        // Actually, let's trust Supabase results if it's connected. 
        // If it's a fresh migration, it might be empty.
        // Uncomment to seed on empty:
        // if (!filterType && !categoryId) return getLocalFiltered();
        return [];
    }

    return data as Vendor[];
  } catch (error) {
    console.error("Error fetching vendors from Supabase (using fallback):", error);
    return getLocalFiltered(filterType, categoryId);
  }
};

/**
 * Adds a new Vendor to Supabase
 */
export const addVendor = async (vendorData: Omit<Vendor, 'id'>) => {
    if (!supabase) {
        alert("Supabase is not configured.");
        return false;
    }
    try {
        const { error } = await supabase.from(VENDORS_TABLE).insert(vendorData);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error adding vendor:", error);
        alert("Greška pri dodavanju.");
        return false;
    }
};

/**
 * Updates an existing Vendor
 */
export const updateVendor = async (id: string, vendorData: Partial<Vendor>) => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from(VENDORS_TABLE).update(vendorData).eq('id', id);
        if (error) throw error;
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
    if (!supabase) return false;
    try {
        const { error } = await supabase.from(VENDORS_TABLE).delete().eq('id', id);
        if (error) throw error;
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
    if (!supabase) {
        alert("Supabase is not configured.");
        return false;
    }
    
    try {
        const { error } = await supabase.from(VENDORS_TABLE).insert(vendorsData);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Batch upload error:", error);
        alert("Greška pri masovnom dodavanju.");
        return false;
    }
};

/**
 * Submits a new inquiry.
 */
export const submitInquiry = async (data: {
    vendorId: string;
    vendorName: string;
    date: string;
    guestCount: number;
    userName: string;
    contact: string;
}) => {
    if (!supabase) {
        console.log("Mock submit inquiry:", data);
        return true;
    }

    try {
        const { error } = await supabase.from(INQUIRIES_TABLE).insert({
            ...data,
            createdAt: new Date().toISOString(),
            status: 'new'
        });
        if (error) throw error;
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
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from(INQUIRIES_TABLE)
            .select('*')
            .order('createdAt', { ascending: false });
        
        if (error) throw error;
        return data as Inquiry[];
    } catch (error) {
        console.error("Error getting inquiries:", error);
        return [];
    }
};

/**
 * Update Inquiry Status
 */
export const updateInquiryStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from(INQUIRIES_TABLE).update({ status }).eq('id', id);
        if (error) throw error;
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
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(SETTINGS_TABLE).select('*').eq('id', 'homepage').single();
    if (error) return null;
    return data;
  } catch (error) {
    console.error("Error fetching site content:", error);
    return null;
  }
};

/**
 * Update Site Content
 */
export const updateSiteContent = async (data: any) => {
  if (!supabase) return false;
  try {
    // Upsert logic
    const { error } = await supabase.from(SETTINGS_TABLE).upsert({ id: 'homepage', ...data });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating site content:", error);
    return false;
  }
};

/**
 * ONE-TIME USE: Uploads local data to Supabase.
 */
export const seedDatabase = async () => {
    if (!supabase) return;
    
    console.log("Starting database seed...");
    let count = 0;
    
    // We can filter out IDs that might conflict or let Supabase generate them if we modify the type
    // Here we assume standard insert
    
    // Chunking to avoid payload limit if array is huge (it's small now)
    try {
        const { error } = await supabase.from(VENDORS_TABLE).insert(localVendors);
        if (error) {
            console.error("Seed error:", error);
        } else {
            console.log(`Seeding complete. Uploaded ${localVendors.length} vendors.`);
        }
    } catch (e) {
        console.error("Seed exception:", e);
    }
};
