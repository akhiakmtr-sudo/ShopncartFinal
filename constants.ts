import { Product, ProductCategory } from './types';

// Generic manufacturer template
const DEFAULT_MANUFACTURER = {
  name: "ShopNcarT Global",
  contact: "+91 0000000000",
  email: "care@shopncart.store",
  address: "Main Business District, India"
};

/**
 * Empty product list - Mock data removed as requested.
 * Admin can add products via the dashboard.
 */
export const PRODUCTS: Product[] = [];

export const APP_NAME = "ShopNcarT";

/**
 * Any user registering with this email will be granted 
 * administrative access to the store dashboard.
 */
export const ADMIN_EMAIL = "admin@shopncart.store";