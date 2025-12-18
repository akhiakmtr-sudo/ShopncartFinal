
import { Product, Order, SupportTicket } from '../types';
import { supabase } from './supabase';

export const dbService = {
  // --- Products ---
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addProduct(product: Product): Promise<void> {
    const { error } = await supabase.from('products').insert([product]);
    if (error) throw error;
  },

  async updateProduct(product: Product): Promise<void> {
    const { error } = await supabase.from('products').update(product).eq('id', product.id);
    if (error) throw error;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createOrder(order: Order): Promise<void> {
    const { error } = await supabase.from('orders').insert([order]);
    if (error) throw error;
  },

  async updateOrderStatus(id: string, status: Order['status'], returnReason?: string): Promise<void> {
    const updateData: any = { status };
    if (returnReason) updateData.returnReason = returnReason;
    const { error } = await supabase.from('orders').update(updateData).eq('id', id);
    if (error) throw error;
  },

  // --- Support Tickets ---
  async getTickets(): Promise<SupportTicket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): Promise<void> {
    const { error } = await supabase.from('tickets').insert([{
      ...ticket,
      status: 'Open',
      createdAt: new Date().toISOString()
    }]);
    if (error) throw error;
  },

  async resolveTicket(id: string): Promise<void> {
    const { error } = await supabase.from('tickets').update({ status: 'Resolved' }).eq('id', id);
    if (error) throw error;
  },

  // --- Categories ---
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase.from('categories').select('name');
    if (error) throw error;
    return data?.map(c => c.name) || [];
  },

  async addCategory(category: string): Promise<void> {
    const { error } = await supabase.from('categories').insert([{ name: category }]);
    if (error) throw error;
  },

  async deleteCategory(category: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('name', category);
    if (error) throw error;
  }
};
