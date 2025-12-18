export enum ProductCategory {
  Fashion = 'Fashion',
  Electronics = 'Electronics',
  Mobiles = 'Mobiles',
  Beauty = 'Beauty',
  Furniture = 'Furniture',
  HomeAppliances = 'Home Appliances',
  Sports = 'Sports',
  Toys = 'Toys',
  Automobiles = 'Automobiles'
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
  price: number;
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

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
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
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
}