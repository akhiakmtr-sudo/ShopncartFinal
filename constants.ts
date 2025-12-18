import { Product, ProductCategory } from './types';

// Generic manufacturer template
const DEFAULT_MANUFACTURER = {
  name: "Green Leaf Herbals Co.",
  contact: "+91 9876543210",
  email: "care@greenleafherbals.com",
  address: "123 Nature Way, Kerala, India"
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pure Ashwagandha Powder',
    price: 499,
    category: ProductCategory.BeautyHealthGrocery,
    images: ['https://images.unsplash.com/photo-1615485242231-9f2f89b97771?auto=format&fit=crop&q=80&w=800'],
    description: 'High-quality organic Ashwagandha root powder to reduce stress and boost energy levels naturally.',
    howToUse: 'Mix 1 teaspoon with warm milk or water daily before bed.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Consult a physician before use if pregnant or nursing.',
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Cold Pressed Neem Oil',
    price: 299,
    category: ProductCategory.BeautyHealthGrocery,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'],
    description: '100% pure cold pressed Neem oil for skin health and natural pest control for indoor plants.',
    howToUse: 'Apply a few drops to affected skin areas or dilute with water for plant spray.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'For external use only.',
    rating: 4.5,
    reviews: 89
  },
  {
    id: '3',
    name: 'Triphala Tablets (60 count)',
    price: 350,
    category: ProductCategory.BeautyHealthGrocery,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'],
    description: 'Traditional Ayurvedic formula for digestive health and detoxification.',
    howToUse: 'Take 1-2 tablets daily after dinner with warm water.',
    manufacturer: DEFAULT_MANUFACTURER,
    note: 'Store in a cool, dry place away from direct sunlight.',
    rating: 4.7,
    reviews: 210
  }
];

export const APP_NAME = "Green Leaf Herbals";

/**
 * Any user registering with this email will be granted 
 * administrative access to the store dashboard.
 */
export const ADMIN_EMAIL = "admin@greenleafherbals.com";