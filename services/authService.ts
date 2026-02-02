
import { supabase } from '../lib/supabase';
import { Vendor, UserProfile, UserRole } from '../types';

// Helper for Mock Mode
const isMockMode = !supabase;

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
  if (isMockMode) throw new Error("Supabase nije konfigurisan.");

  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase!.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: `${data.firstName} ${data.lastName}`,
        role: 'user' // Metadata fallback
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Registracija nije uspela.");

  // Check if session exists. If Email Confirmation is enabled in Supabase, session is null.
  // If session is null, RLS policies might block the insert below unless a Trigger is used.
  if (!authData.session) {
      console.warn("User registered but no active session. Email confirmation might be required.");
      // We return early and let the Database Trigger handle the profile creation if setup,
      // OR we inform the user to check their email.
  }

  // 2. Create User Profile in Supabase 'users' table
  // MAPPING: camelCase (JS) -> snake_case (DB)
  const userProfilePayload = {
    uid: authData.user.id,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    role: 'user',
    created_at: new Date().toISOString(),
    event_date: data.eventDate || null,
    event_type: data.eventType || null,
    guest_count: data.guestCount || null,
    preferences: data.preferences || null
  };

  const { error: profileError } = await supabase!
    .from('users')
    .insert(userProfilePayload);

  // Note: We don't throw on profileError if Auth succeeded, 
  // because the Postgres Trigger (if configured) might have already created the user, causing a duplicate key error.
  if (profileError) {
      if (profileError.code === '23505') {
          console.log("Profile already created by trigger.");
      } else {
          console.error("Profile creation warning (Check RLS Policies):", profileError);
      }
  }

  // Return frontend friendly object
  return {
    uid: authData.user.id,
    ...data,
    role: 'user' as UserRole,
    createdAt: userProfilePayload.created_at
  };
};

/**
 * Register a Contractor (Vendor)
 */
export const registerContractor = async (
  loginData: { email: string; password: string },
  vendorData: any
) => {
  if (isMockMode) throw new Error("Supabase nije konfigurisan.");

  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase!.auth.signUp({
    email: loginData.email,
    password: loginData.password,
    options: {
      data: {
        first_name: vendorData.contactFirstName,
        last_name: vendorData.contactLastName,
        full_name: `${vendorData.contactFirstName} ${vendorData.contactLastName}`,
        role: 'contractor' // Metadata fallback
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Registracija nije uspela.");

  // 2. Create User Profile
  const userProfilePayload = {
    uid: authData.user.id,
    email: loginData.email,
    first_name: vendorData.contactFirstName,
    last_name: vendorData.contactLastName,
    phone: vendorData.phone,
    role: 'contractor',
    created_at: new Date().toISOString()
  };

  const { error: profileError } = await supabase!
    .from('users')
    .insert(userProfilePayload);

  if (profileError) {
       // Ignore duplicate key error if trigger handled it
       if (profileError.code !== '23505') {
           console.error("User profile warning:", profileError);
       }
  }

  // 3. Create Vendor Document
  // Use a reliable ID that can be derived or is unique
  const newVendorId = `partner-${authData.user.id.slice(0, 8)}`;
  
  // Prepare default pricing to ensure DB validity or UI safety
  const defaultPricing = vendorData.type === 'VENUE' 
    ? { per_person_from: 0 } 
    : { package_from: 0 };

  // Mapping to DB Columns
  const vendorPayload: any = {
    id: newVendorId,
    owner_id: authData.user.id,
    name: vendorData.venueName || vendorData.companyName,
    pib: vendorData.taxId,
    type: vendorData.type || 'VENUE', 
    category_id: vendorData.category_id || '1',
    slug: (vendorData.venueName || vendorData.companyName).toLowerCase().replace(/[^a-z0-9]/g, '-'),
    city: vendorData.city || 'Srbija',
    address: vendorData.address || 'Online',
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
    pricing: defaultPricing,
    ...(vendorData.type === 'VENUE' ? {
        venue_type: vendorData.venueType || 'Restoran',
        capacity: { min: 0, max: vendorData.capacity || 100, seated: vendorData.capacity || 100, cocktail: vendorData.capacity || 100 }
    } : {
        service_type: 'Usluga'
    })
  };

  const { error: vendorError } = await supabase!
    .from('vendors')
    .insert(vendorPayload);

  if (vendorError) throw vendorError;

  // Fix: Construct UserProfile for frontend (camelCase)
  const userProfile: UserProfile = {
      uid: userProfilePayload.uid,
      email: userProfilePayload.email,
      firstName: userProfilePayload.first_name,
      lastName: userProfilePayload.last_name,
      phone: userProfilePayload.phone,
      role: 'contractor',
      createdAt: userProfilePayload.created_at
  };

  return { user: userProfile, vendor: vendorPayload };
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

  // 1. Supabase Auth Login
  const { data: authData, error: authError } = await supabase!.auth.signInWithPassword({
    email,
    password: pass
  });

  if (authError) throw authError;
  const user = authData.user;
  if (!user) throw new Error("Prijavljivanje nije uspelo.");

  // 2. Determine Role
  // First check 'users' table
  const { data: userRow, error: userError } = await supabase!
    .from('users')
    .select('*')
    .eq('uid', user.id)
    .maybeSingle();

  if (userRow) {
      // Map back to CamelCase for frontend
      return {
        uid: userRow.uid,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        phone: userRow.phone,
        role: userRow.role,
        createdAt: userRow.created_at,
        eventDate: userRow.event_date,
        eventType: userRow.event_type,
        guestCount: userRow.guest_count,
        preferences: userRow.preferences
      } as UserProfile;
  }

  // Fallback 1: Admin check via Email
  if (email === 'admin@svezaproslavu.rs') { 
       return {
          uid: user.id,
          email,
          firstName: 'Admin',
          lastName: '',
          phone: '',
          role: 'admin',
          createdAt: new Date().toISOString()
      } as UserProfile;
  }

  // Fallback 2: Check for Vendor existence to infer role
  const { data: vendorData } = await supabase!
    .from('vendors')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  const inferredRole = vendorData ? 'contractor' : (user.user_metadata?.role || 'user');

  // SELF HEALING: Create default profile if missing from 'users' table
  // This happens if registration inserts failed but Auth succeeded
  const defaultProfilePayload = {
      uid: user.id,
      email: email,
      first_name: user.user_metadata?.first_name || 'Korisnik',
      last_name: user.user_metadata?.last_name || '',
      role: inferredRole,
      created_at: new Date().toISOString()
  };
  
  await supabase!.from('users').upsert(defaultProfilePayload);
  
  return {
      uid: defaultProfilePayload.uid,
      email: defaultProfilePayload.email,
      firstName: defaultProfilePayload.first_name,
      lastName: defaultProfilePayload.last_name,
      role: defaultProfilePayload.role as UserRole,
      createdAt: defaultProfilePayload.created_at,
      phone: ''
  };
};

export const logout = async () => {
    if (isMockMode) return;
    return await supabase!.auth.signOut();
};

/**
 * Get Contractor Profile details
 */
export const getMyVendorProfile = async (uid: string): Promise<Vendor | null> => {
    if (isMockMode) return null;
    const { data, error } = await supabase!
        .from('vendors')
        .select('*')
        .eq('owner_id', uid)
        .maybeSingle();
    
    if (error || !data) return null;
    
    // Map snake_case to CamelCase
    const v = data;
    return {
        ...v,
        ownerId: v.owner_id
    } as Vendor;
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    if (isMockMode) return true;
    
    const dbPayload: any = {};
    if (data.firstName !== undefined) dbPayload.first_name = data.firstName;
    if (data.lastName !== undefined) dbPayload.last_name = data.lastName;
    if (data.phone !== undefined) dbPayload.phone = data.phone;
    
    // Allow updating other event fields too
    if (data.eventDate !== undefined) dbPayload.event_date = data.eventDate;
    if (data.guestCount !== undefined) dbPayload.guest_count = data.guestCount;

    const { error } = await supabase!.from('users').update(dbPayload).eq('uid', uid);
    if (error) throw error;
    
    return true;
};
