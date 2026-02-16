
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

    // DEBUG: Help user understand why list is empty
    if (!data || data.length === 0) {
        console.log("Supabase returned 0 vendors. Check if table is empty or RLS policies block access.");
        // We DO NOT fallback to local data here, because if DB is connected but empty, 
        // we should show empty state, not mix local data.
        return [];
    }

    // Map DB snake_case to TS camelCase
    return data.map((v: any) => ({
        ...v,
        ownerId: v.owner_id
    })) as Vendor[];
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
        // Generate a random ID if not present (Simple unique string)
        const genId = `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Map keys to snake_case for DB
        const dbPayload = {
            id: genId,
            ...vendorData,
            owner_id: vendorData.ownerId,
            category_id: vendorData.category_id,
            venue_type: (vendorData as any).venue_type,
            service_type: (vendorData as any).service_type,
            product_type: (vendorData as any).product_type
        };
        // Remove undefined/camelCase keys from spread
        delete (dbPayload as any).ownerId;

        const { error } = await supabase.from(VENDORS_TABLE).insert(dbPayload);
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
        // Map keys
        const dbPayload: any = { ...vendorData };
        if (vendorData.ownerId) {
            dbPayload.owner_id = vendorData.ownerId;
            delete dbPayload.ownerId;
        }

        const { error } = await supabase.from(VENDORS_TABLE).update(dbPayload).eq('id', id);
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
        // Map all items
        const dbPayloads = vendorsData.map((v, index) => ({
            id: `batch-${Date.now()}-${index}`,
            ...v,
            owner_id: v.ownerId,
            venue_type: (v as any).venue_type,
            service_type: (v as any).service_type,
            product_type: (v as any).product_type
            // ensure other fields are present and mapped
        }));
        
        // Clean up camelCase keys from payloads
        dbPayloads.forEach((p: any) => {
             delete p.ownerId;
        });

        const { error } = await supabase.from(VENDORS_TABLE).insert(dbPayloads);
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
        // Map to snake_case
        const payload = {
            vendor_id: data.vendorId,
            vendor_name: data.vendorName,
            user_name: data.userName,
            contact: data.contact,
            date: data.date,
            guest_count: data.guestCount,
            status: 'new',
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from(INQUIRIES_TABLE).insert(payload);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return false;
    }
};

/**
 * Captures a Partner Lead from the Landing Page
 */
export const submitPartnerLead = async (email: string) => {
    if (!supabase) return true; // Mock success if not connected
    
    try {
        // We use 'null' for vendor_id to avoid Foreign Key constraint violations
        // We tag it as 'LANDING_PAGE_LEAD' in the vendor_name field for Admin tracking
        const payload = {
            vendor_id: null, 
            vendor_name: 'LANDING_PAGE_LEAD',
            user_name: 'Novi Partner (Rani Pristup)',
            contact: email,
            date: new Date().toISOString().split('T')[0],
            guest_count: 0,
            status: 'new',
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from(INQUIRIES_TABLE).insert(payload);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error submitting lead:", error);
        return false;
    }
};

/**
 * Get all inquiries (Admin / Vendor specific)
 */
export const getInquiries = async (): Promise<Inquiry[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from(INQUIRIES_TABLE)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map back to camelCase
        return data.map((i: any) => ({
            id: i.id,
            vendorId: i.vendor_id,
            vendorName: i.vendor_name,
            userName: i.user_name,
            contact: i.contact,
            date: i.date,
            guestCount: i.guest_count,
            status: i.status,
            createdAt: i.created_at
        })) as Inquiry[];
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
    const { data, error } = await supabase.from(SETTINGS_TABLE).select('*').eq('id', 'homepage').maybeSingle();
    if (error) return null;
    if (!data) return null;
    
    // Map snake_case to camelCase for app consumption
    return {
        heroTitle: data.hero_title,
        heroSubtitle: data.hero_subtitle,
        heroImage: data.hero_image,
        preheaderText: data.preheader_text
    };
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
    const dbPayload = {
        id: 'homepage',
        hero_title: data.heroTitle,
        hero_subtitle: data.heroSubtitle,
        hero_image: data.heroImage,
        preheader_text: data.preheaderText
    };

    const { error } = await supabase.from(SETTINGS_TABLE).upsert(dbPayload);
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
    
    try {
        const mappedVendors = localVendors.map((v, i) => ({
            ...v,
            // Ensure valid ID for DB
            id: v.id.length > 5 ? v.id : `seed-${i}-${v.slug}`,
            owner_id: v.ownerId,
            // Add required default fields if missing
            venue_type: (v as any).venue_type || null,
            service_type: (v as any).service_type || null,
            product_type: (v as any).product_type || null,
            created_at: new Date().toISOString()
        }));

        // Remove ownerId from object to prevent column error
        const cleaned = mappedVendors.map(({ownerId, ...rest}: any) => rest);

        const { error } = await supabase.from(VENDORS_TABLE).upsert(cleaned);
        if (error) {
            console.error("Seed error:", error);
        } else {
            console.log(`Seeding complete. Uploaded ${localVendors.length} vendors.`);
            alert(`Uspešno učitano ${localVendors.length} venova u bazu! Osvežite stranicu.`);
        }
    } catch (e) {
        console.error("Seed exception:", e);
    }
};
