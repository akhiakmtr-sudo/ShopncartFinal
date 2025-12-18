
export enum ProductCategory {
  HerbalSupplements = 'Herbal Supplements',
  EssentialOils = 'Essential Oils',
  OrganicTeas = 'Organic Teas',
  Skincare = 'Natural Skincare',
  WellnessKits = 'Wellness Kits'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Manufacturer {
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  category: string;
  images: string[];
  description: string;
  howToUse: string;
  manufacturer: Manufacturer;
  note: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Return Requested' | 'Refunded' | 'Return Rejected';
  date: string;
  returnReason?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}
