
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
        full_name: `${data.firstName} ${data.lastName}`
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Registracija nije uspela.");

  // 2. Create User Profile in Supabase 'users' table
  const userProfile: UserProfile = {
    uid: authData.user.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'user',
    createdAt: new Date().toISOString(),
    eventDate: data.eventDate,
    eventType: data.eventType,
    guestCount: data.guestCount,
    preferences: data.preferences
  };

  const { error: profileError } = await supabase!
    .from('users')
    .insert(userProfile);

  if (profileError) throw profileError;

  return userProfile;
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
        full_name: `${vendorData.contactFirstName} ${vendorData.contactLastName}`
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Registracija nije uspela.");

  // 2. Create User Profile
  const userProfile: UserProfile = {
    uid: authData.user.id,
    email: loginData.email,
    firstName: vendorData.contactFirstName,
    lastName: vendorData.contactLastName,
    phone: vendorData.phone,
    role: 'contractor',
    createdAt: new Date().toISOString()
  };

  const { error: profileError } = await supabase!
    .from('users')
    .insert(userProfile);

  if (profileError) throw profileError;

  // 3. Create Vendor Document
  const newVendorId = `partner-${authData.user.id.slice(0, 8)}`;
  
  const vendorStub: any = {
    id: newVendorId,
    ownerId: authData.user.id,
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

  const { error: vendorError } = await supabase!
    .from('vendors')
    .insert(vendorStub);

  if (vendorError) throw vendorError;

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
  const { data: userProfile, error: userError } = await supabase!
    .from('users')
    .select('*')
    .eq('uid', user.id)
    .single();

  if (userProfile) {
      return userProfile as UserProfile;
  }

  // Fallback: Check if they are a legacy vendor without a user doc (unlikely in Supabase fresh start but good for migration logic)
  const { data: vendorData } = await supabase!
    .from('vendors')
    .select('*')
    .eq('ownerId', user.id)
    .single();

  if (vendorData) {
      return {
          uid: user.id,
          email,
          firstName: 'Partner',
          lastName: '',
          phone: '',
          role: 'contractor',
          createdAt: new Date().toISOString()
      } as UserProfile;
  }

  // Fallback 2: Admin check
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

  // If no profile found but auth succeeded, create a default user profile
  // This handles cases where user signed up but DB insert failed previously
  const defaultProfile: UserProfile = {
      uid: user.id,
      email: email,
      firstName: user.user_metadata?.first_name || 'Korisnik',
      lastName: user.user_metadata?.last_name || '',
      phone: '',
      role: 'user',
      createdAt: new Date().toISOString()
  };
  
  await supabase!.from('users').insert(defaultProfile);
  
  return defaultProfile;
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
        .eq('ownerId', uid)
        .single();
    
    if (error || !data) return null;
    return data as Vendor;
};
