
import { User } from '../types';
import { supabase } from './supabase';

/**
 * Green Leaf Herbals Authentication Service
 * Roles (admin/user) are managed in the Supabase 'profiles' table.
 */
export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Authentication failed: No user found.');

    // Fetch profile containing the 'role' column from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role, phone, address, city, state, zip')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn("Profile not found, defaulting to user role.");
    }

    return {
      id: data.user.id,
      name: profile?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      // Role is derived strictly from the database
      role: (profile?.role === 'admin') ? 'admin' : 'user',
      phone: profile?.phone,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      zip: profile?.zip
    };
  },

  async register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create a profile record for the new user. 
      // Note: In a production Supabase setup, the 'role' column should default to 'user' via SQL.
      await supabase.from('profiles').insert({
        id: data.user.id,
        name: name,
        email: email,
        role: 'user' // Explicitly set as user on signup
      });
    }

    return data.user;
  },

  async confirmRegister(email: string, code: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });
    if (error) throw error;
    return true;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role, phone, address, city, state, zip')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      name: profile?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: (profile?.role === 'admin') ? 'admin' : 'user',
      phone: profile?.phone,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      zip: profile?.zip
    };
  },

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  },

  async resendCode(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
    return true;
  },

  async confirmNewPassword(email: string, code: string, password: any) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return true;
  }
};
