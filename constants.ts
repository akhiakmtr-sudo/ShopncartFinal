import { Product } from './types';

/**
 * Generic manufacturer template for ShopNcarT products
 */
export const DEFAULT_MANUFACTURER = {
  name: "ShopNcarT Global Logistics",
  contact: "+91 800-SHOP-NOW",
  email: "support@shopncart.com",
  address: "International Commerce Zone, Tech Park, Bangalore"
};

/**
 * Initial products are managed via the Admin Dashboard and stored in Supabase.
 */
export const PRODUCTS: Product[] = [];

export const APP_NAME = "ShopNcarT";