import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Search, 
  Menu, 
  Home, 
  Store, 
  Truck,
  Headphones,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  X,
  LogOut,
  LayoutDashboard,
  MapPin,
  Mail,
  Phone,
  Package,
  Save,
  Calendar,
  Building2,
  Stethoscope,
  Loader2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Settings,
  CreditCard
} from 'lucide-react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { PRODUCTS } from './constants';
import { Product, CartItem, User, Order, ProductCategory } from './types';

// -- Subcategory Data --
const MENS_FASHION_SUB = [
  {
    title: "Men's Clothing",
    items: ["Clothing", "T-shirts & Polos", "Shirts", "Jeans", "Innerwear"]
  },
  {
    title: "Accessories",
    items: ["Watches", "Bags & Luggage", "Sunglasses", "Jewellery", "Wallets"]
  },
  {
    title: "Men's Shoes",
    items: ["Shoes", "Sports Shoes", "Formal Shoes", "Casual Shoes"]
  }
];

const WOMENS_FASHION_SUB = [
  {
    title: "Women's Clothing",
    items: ["Clothing", "Tops & Tees", "Dresses", "Jeans", "Ethnic Wear", "Innerwear"]
  },
  {
    title: "Accessories",
    items: ["Handbags", "Watches", "Jewellery", "Sunglasses", "Beauty"]
  },
  {
    title: "Women's Shoes",
    items: ["Flats", "Heels", "Sports Shoes", "Casual Shoes"]
  }
];

// -- Loading Component --
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="relative">
       <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl animate-pulse"></div>
       <Loader2 size={48} className="text-brand animate-spin relative z-10" />
    </div>
    <p className="text-gray-500 font-medium animate-pulse text-sm mt-4 tracking-wide">Processing...</p>
  </div>
);

// -- Sub-Components for User Profile Views --

const OrderConfirmationView = ({ 
  user, 
  cart, 
  total, 
  onBack, 
  onPayNow 
}: { 
  user: User, 
  cart: CartItem[], 
  total: number, 
  onBack: () => void, 
  onPayNow: (details: any) => void 
}) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zip: user.zip || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayNow(formData);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Order Confirmation</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
            <form id="order-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">Shipping Details</h3>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email ID</label>
                        <input name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                        <input name="zip" value={formData.zip} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                        <input name="city" value={formData.city} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                        <input name="state" value={formData.state} onChange={handleChange} required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                </div>
            </form>
        </div>

        <div className="md:col-span-2">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600 flex-1 truncate mr-4">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Total to Pay</span>
                    <span className="font-bold text-xl text-brand">₹{total}</span>
                </div>
                
                <button 
                    form="order-form"
                    type="submit"
                    className="w-full bg-brand text-white font-bold py-4 rounded-xl mt-6 hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                    Pay Now
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const PaymentView = ({ total, onBack, onComplete }: { total: number, onBack: () => void, onComplete: () => void }) => (
    <div className="px-4 py-12 max-w-lg mx-auto text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand">
            <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Gateway</h2>
        <p className="text-gray-600 mb-8">
            You are about to pay <span className="font-bold text-gray-900">₹{total}</span>
        </p>
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-8">
            <p className="text-yellow-800 text-sm font-medium">Payment integration pending...</p>
        </div>
        <button onClick={onComplete} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all mb-4">
             Complete Payment (Demo)
        </button>
        <button onClick={onBack} className="text-brand font-bold hover:underline text-sm">
            Cancel & Go Back
        </button>
    </div>
);

const AddressView = ({ user, onSave, onBack }: { user: User, onSave: (u: User) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zip: user.zip || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  return (
    <div className="px-4 py-6 max-w-xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800 md:hidden">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">My Address</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
          <textarea 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            rows={3}
            placeholder="House No, Street, Landmark"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
            <input 
              type="text" 
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            />
           </div>
           <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
            <input 
              type="text" 
              value={formData.zip}
              onChange={e => setFormData({...formData, zip: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            />
           </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
          <input 
            type="text" 
            value={formData.state}
            onChange={e => setFormData({...formData, state: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
          />
        </div>
        <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl mt-4 hover:bg-green-600 transition-colors flex items-center justify-center">
          <Save size={18} className="mr-2" /> Save Address
        </button>
      </form>
    </div>
  );
};

const OrdersView = ({ orders, onBack, onStartShopping }: { orders: Order[], onBack: () => void, onStartShopping: () => void }) => {
  return (
    <div className="px-4 py-6 max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800 md:hidden">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
           <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-500">No orders found.</p>
           <button onClick={onStartShopping} className="text-brand font-semibold mt-2 hover:underline">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                 <div>
                   <span className="text-xs font-bold text-gray-500 block">ORDER ID</span>
                   <span className="font-mono text-sm font-semibold">{order.id}</span>
                 </div>
                 <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">{order.date}</span>
                 </div>
               </div>
               <div className="space-y-2 mb-4">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                         <span className="font-bold text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-2">{item.quantity}x</span> 
                         {item.name}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                   </div>
                 ))}
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-sm font-bold text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-brand">₹{order.total}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HospitalsView = ({ onBack }: { onBack: () => void }) => {
  const hospitals: any[] = [];

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Partner Hospitals</h2>
      </div>
      {hospitals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No partner hospitals found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map(h => (
            <div key={h.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                 <img src={h.image} alt={h.name} className="w-full h-full object-cover"/>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{h.name}</h3>
                <div className="flex items-center text-gray-600 mt-3 text-sm">
                  <MapPin size={16} className="mr-2 text-brand flex-shrink-0"/> <span className="truncate">{h.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2 text-sm">
                  <Phone size={16} className="mr-2 text-brand flex-shrink-0"/> <span>{h.phone}</span>
                </div>
                <button className="mt-5 w-full border border-brand text-brand font-bold py-2 rounded-lg hover:bg-brand hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AppointmentView = ({ onBack, user, setIsLoading }: { onBack: () => void, user: User | null, setIsLoading: (loading: boolean) => void }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    date: '',
    department: 'General Consultation'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Network Request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate Booking ID
    const bookingId = `BK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Prepare Payload
    const bookingDetails = {
      bookingId,
      to: 'info@shopncart.store',
      patientName: formData.name,
      phone: formData.phone,
      date: formData.date,
      department: formData.department,
      status: 'Pending Confirmation'
    };

    setIsLoading(false);
    alert(`Appointment Request Sent Successfully!\n\nBooking ID: ${bookingId}\n\nOur team will contact you shortly to confirm.`);
    onBack();
  };

  return (
    <div className="px-4 py-6 max-w-xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-800">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Patient Name</label>
          <input 
            required
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            placeholder="Enter Full Name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
          <input 
            required
            type="tel" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
          <input 
            required
            type="date" 
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
          <select 
            value={formData.department}
            onChange={e => setFormData({...formData, department: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
          >
            <option>General Consultation</option>
            <option>Customer Support</option>
            <option>Product Inquiries</option>
            <option>Repair & Service</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl mt-4 hover:bg-green-600 transition-colors">
          Confirm Booking
        </button>
      </form>
    </div>
  )
}

// -- Main App Component --

function App() {
  // Global State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(Object.values(ProductCategory));
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200');
  const [orders, setOrders] = useState<Order[]>([]);

  // View State
  type ViewType = 'home' | 'shop' | 'product-detail' | 'cart' | 'auth' | 'admin' | 'orders' | 'address' | 'appointments' | 'hospitals' | 'order-confirmation' | 'payment';
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [drawerSubView, setDrawerSubView] = useState<'main' | 'mens-fashion' | 'womens-fashion'>('main');

  // --- Global Loading Wrapper ---
  const navigate = async (view: ViewType) => {
    if (view === currentView) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentView(view);
    window.scrollTo(0, 0);
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = async (cat: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setActiveCategory(cat);
    setIsLoading(false);
  };

  const handleAddToCartWithLoad = async (product: Product) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product);
    setIsLoading(false);
  };

  const handleAddReviewWithLoad = async (productId: string, rating: number) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    handleAddReview(productId, rating);
    setIsLoading(false);
  };

  const handleSaveAddressWithLoad = async (updatedUser: User) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    handleSaveAddress(updatedUser);
    setIsLoading(false);
  };

  const handleLogin = async (loggedInUser: User) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      setCurrentView('admin');
    } else {
      if (selectedProduct && currentView === 'auth') {
        setCurrentView('product-detail');
      } else {
        setCurrentView('home');
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(null);
    setCurrentView('home');
    setShowProfileMenu(false);
    setIsLoading(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };
  const handleUpdateBanner = (url: string) => setBannerImage(url);
  const handleAddCategory = (cat: string) => setCategories(prev => [...prev, cat]);
  const handleDeleteCategory = (cat: string) => setCategories(prev => prev.filter(c => c !== cat));

  const addToCart = (product: Product) => {
    if (user && user.role === 'admin') {
      alert("Admins cannot shop!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, image: product.images[0] }];
    });
  };

  const handleBuyNow = async (product: Product) => {
    if (!user) {
      alert("Please login to purchase products.");
      navigate('auth');
      setSelectedProduct(product);
      return;
    }
    if (user.role === 'admin') {
      alert("Admins cannot shop!");
      return;
    }
    await handleAddToCartWithLoad(product);
    navigate('order-confirmation');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleAddReview = (productId: string, rating: number) => {
     if (!user) {
       alert("Please login to add a review.");
       navigate('auth');
       return;
     }
     setProducts(prev => prev.map(p => {
       if (p.id === productId) {
         const newCount = p.reviews + 1;
         const newRating = ((p.rating * p.reviews) + rating) / newCount;
         return { ...p, rating: parseFloat(newRating.toFixed(1)), reviews: newCount };
       }
       return p;
     }));
     alert("Thanks for your review!");
  };

  const handleProductClick = async (product: Product) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo(0,0);
    setIsLoading(false);
  };

  const handleSaveAddress = (updatedUser: User) => {
    setUser(updatedUser);
    alert('Address saved successfully!');
    setCurrentView('home');
  };

  const handlePaymentComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (user) {
        const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            customerName: user.name,
            total: cartTotal,
            items: [...cart],
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
    }
    setIsLoading(false);
    alert("Payment Successful! Order Placed.");
    navigate('home');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery, products]);

  if (currentView === 'auth') {
    return <Auth onLogin={handleLogin} onBack={() => navigate('home')} />;
  }

  if (currentView === 'admin' && user?.role === 'admin') {
    return (
      <AdminDashboard 
        products={products}
        orders={orders}
        bannerImage={bannerImage}
        categories={categories}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateBanner={handleUpdateBanner}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'product-detail' && selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct}
        user={user}
        onBack={() => navigate('shop')}
        onAddToCart={handleAddToCartWithLoad}
        onBuyNow={handleBuyNow}
        onAddReview={handleAddReviewWithLoad}
      />
    );
  }

  if (currentView === 'order-confirmation' && user) {
    return (
      <OrderConfirmationView 
        user={user} 
        cart={cart} 
        total={cartTotal} 
        onBack={() => navigate('cart')} 
        onPayNow={async (details) => navigate('payment')}
      />
    );
  }

  if (currentView === 'payment') {
    return <PaymentView total={cartTotal} onBack={() => navigate('cart')} onComplete={handlePaymentComplete} />
  }

  const renderHome = () => (
    <>
      <div className="px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div 
          className="rounded-2xl shadow-sm overflow-hidden cursor-pointer group relative"
          onClick={() => navigate('shop')}
        >
          <img 
            src={bannerImage} 
            alt="Hero Banner" 
            className="w-full h-32 sm:h-40 md:h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 mb-8">
        <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50 animate-in zoom-in duration-500 delay-100">
          <div className="bg-blue-50 p-2 rounded-full mb-1 text-blue-600">
            <Truck size={20} />
          </div>
          <h3 className="font-bold text-xs text-gray-800">Fast Delivery</h3>
          <p className="text-[10px] text-gray-500">Free on orders above ₹1999</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50 animate-in zoom-in duration-500 delay-200">
          <div className="bg-blue-50 p-2 rounded-full mb-1 text-blue-600">
            <Headphones size={20} />
          </div>
          <h3 className="font-bold text-xs text-gray-800">24/7 Support</h3>
          <p className="text-[10px] text-gray-500">Expert help anytime</p>
        </div>
      </div>

      <div className="px-4 mb-12">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-gray-800">Popular Now</h2>
           <button onClick={() => navigate('shop')} className="text-brand text-sm font-semibold">View All</button>
        </div>
        {products.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed text-center text-gray-400 text-sm">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                user={user}
                onAddToCart={handleAddToCartWithLoad} 
                onAddReview={handleAddReview}
                onClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>

      <section className="px-4 py-8 bg-white my-8 mx-4 rounded-2xl shadow-sm border border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">About Us</h2>
        <div className="w-12 h-1 bg-brand mb-4"></div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 text-justify">
          ShopNcarT is your premium destination for everything you need. From fashion to electronics, we believe in transparency, quality, and customer trust. Every product on our platform undergoes strict quality checks.
        </p>
        <p className="font-bold text-brand mt-4">ShopNcarT — Quality. Trusted. Verified.</p>
      </section>

      <section className="px-4 py-8 bg-white my-8 mx-4 rounded-2xl shadow-sm border border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0"><MapPin size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Visit Us</h3>
              <p className="text-gray-600 text-sm mt-1">46/A1, PKP Complex, Mannur, Kerala</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0"><Mail size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Email Us</h3>
              <a href="mailto:info@shopncart.store" className="text-gray-600 text-sm hover:text-brand">info@shopncart.store</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderShop = () => (
    <div className="px-4 py-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        <button
          onClick={() => handleCategoryChange('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === 'All' ? 'bg-brand text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-brand text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            user={user}
            onAddToCart={handleAddToCartWithLoad} 
            onAddReview={handleAddReview}
            onClick={handleProductClick}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="px-4 py-6 mb-24 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bag</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your bag is empty.</p>
          <button onClick={() => navigate('shop')} className="text-brand font-semibold">Start Shopping</button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <div className="ml-4 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm">-</button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky bottom-24">
            <div className="flex justify-between mb-4">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-bold text-lg text-brand">₹{cartTotal}</span>
            </div>
            <button 
              onClick={() => user ? navigate('order-confirmation') : navigate('auth')}
              className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-green-600 shadow-lg shadow-green-100"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-0 relative">
      {isLoading && <LoadingOverlay />}
      
      {/* Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-80 max-w-[90%] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b flex justify-between items-center bg-blue-900 text-white">
               <div className="flex items-center space-x-3">
                 {drawerSubView !== 'main' && (
                    <button onClick={() => setDrawerSubView('main')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                      <ChevronLeft size={24} />
                    </button>
                 )}
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <UserIcon size={20} />
                 </div>
                 <div className="overflow-hidden">
                    <p className="font-bold truncate leading-tight">{user ? `Hello, ${user.name}` : 'Welcome'}</p>
                    <p className="text-xs text-blue-200 truncate">{user ? user.email : 'Sign in for better experience'}</p>
                 </div>
               </div>
               <button onClick={() => { setIsMobileMenuOpen(false); setDrawerSubView('main'); }} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2 bg-gray-50 no-scrollbar">
               
               {/* Main Drawer View */}
               {drawerSubView === 'main' && (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                    {/* Login / Profile Actions */}
                    <div className="bg-white mb-2 py-1">
                      {!user ? (
                        <button 
                          onClick={() => { navigate('auth'); setIsMobileMenuOpen(false); }} 
                          className="w-full text-left px-5 py-4 flex items-center justify-between text-gray-800 font-bold group"
                        >
                          <span className="group-hover:text-brand transition-colors">Login / Signup</span>
                          <ChevronRight size={18} className="text-gray-400 group-hover:text-brand transition-colors" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                          className="w-full text-left px-5 py-4 flex items-center justify-between text-red-600 font-bold group"
                        >
                          <span>Sign Out</span>
                          <LogOut size={18} />
                        </button>
                      )}
                    </div>

                    {/* My Account Section */}
                    <div className="bg-white mb-2 py-1">
                      <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">My Account</div>
                      <button onClick={() => { navigate('orders'); setIsMobileMenuOpen(false); }} className="w-full text-left px-5 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center"><Package size={18} className="mr-3 text-gray-400" /> <span>My Orders</span></div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </button>
                      <button onClick={() => { navigate('address'); setIsMobileMenuOpen(false); }} className="w-full text-left px-5 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center"><MapPin size={18} className="mr-3 text-gray-400" /> <span>Saved Addresses</span></div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </button>
                    </div>

                    {/* Shop by Category Section */}
                    <div className="bg-white py-1">
                      <div className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">Shop by Category</div>
                      <div className="divide-y divide-gray-100">
                          {categories.map(cat => (
                            <button 
                              key={cat}
                              onClick={() => { 
                                if (cat === ProductCategory.MensFashion) {
                                  setDrawerSubView('mens-fashion');
                                } else if (cat === ProductCategory.WomensFashion) {
                                  setDrawerSubView('womens-fashion');
                                } else {
                                  handleCategoryChange(cat); 
                                  navigate('shop'); 
                                  setIsMobileMenuOpen(false); 
                                }
                              }}
                              className="w-full text-left px-5 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                              <span className="text-[15px] font-medium">{cat}</span>
                              <ChevronRight size={18} className="text-gray-300" />
                            </button>
                          ))}
                      </div>
                    </div>
                 </div>
               )}

               {/* Men's Fashion Sub View */}
               {drawerSubView === 'mens-fashion' && (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {MENS_FASHION_SUB.map((section, sidx) => (
                      <div key={sidx} className="bg-white mb-2 py-2">
                         <div className="px-5 py-3 text-lg font-bold text-gray-900">{section.title}</div>
                         <div className="space-y-1">
                           {section.items.map((item, iidx) => (
                             <button 
                               key={iidx}
                               onClick={() => {
                                 handleCategoryChange(ProductCategory.MensFashion);
                                 setSearchQuery(item); // Simple mock behavior: search for the specific item
                                 navigate('shop');
                                 setIsMobileMenuOpen(false);
                                 setDrawerSubView('main');
                               }}
                               className="w-full text-left px-5 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-[15px]"
                             >
                               {item}
                             </button>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
               )}

               {/* Women's Fashion Sub View */}
               {drawerSubView === 'womens-fashion' && (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {WOMENS_FASHION_SUB.map((section, sidx) => (
                      <div key={sidx} className="bg-white mb-2 py-2">
                         <div className="px-5 py-3 text-lg font-bold text-gray-900">{section.title}</div>
                         <div className="space-y-1">
                           {section.items.map((item, iidx) => (
                             <button 
                               key={iidx}
                               onClick={() => {
                                 handleCategoryChange(ProductCategory.WomensFashion);
                                 setSearchQuery(item);
                                 navigate('shop');
                                 setIsMobileMenuOpen(false);
                                 setDrawerSubView('main');
                               }}
                               className="w-full text-left px-5 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-[15px]"
                             >
                               {item}
                             </button>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
               )}

            </div>
            
            {/* Footer / App Version info */}
            <div className="p-4 bg-white border-t border-gray-100 text-center">
               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">&copy; ShopNcarT v1.0.2</p>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-blue-900 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 rounded-lg text-white hover:bg-white/10 transition-colors"><Menu size={28} /></button>
               <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
                  <div className="h-8 md:h-10">
                    <img src="https://placehold.co/200x50/1e3a8a/ffffff?text=ShopNcarT&font=playfair-display" alt="ShopNcarT" className="h-full object-contain" />
                  </div>
               </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => user ? setShowProfileMenu(!showProfileMenu) : navigate('auth')} className="hidden md:flex items-center space-x-1 text-gray-200 hover:text-white transition-colors">
                <UserIcon size={24} />
                {user && <span className="text-xs font-bold">{user.name}</span>}
              </button>
              <button onClick={() => navigate('cart')} className="text-gray-200 hover:text-white relative transition-colors">
                <ShoppingBag size={24} />
                {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-blue-900 font-bold">{cartItemCount}</span>}
              </button>
            </div>
          </div>
          <div className="relative">
             <input type="text" placeholder="Search for products, brands..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value && currentView !== 'shop') navigate('shop'); }} className="peer w-full bg-blue-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-blue-300 focus:bg-white focus:text-gray-900 transition-all outline-none" />
             <Search className="absolute left-3 top-3 text-blue-300 peer-focus:text-gray-400" size={18} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto min-h-[calc(100vh-300px)]">
        {currentView === 'home' && renderHome()}
        {currentView === 'shop' && renderShop()}
        {currentView === 'cart' && renderCart()}
        {currentView === 'hospitals' && <HospitalsView onBack={() => navigate('home')}/>}
        {currentView === 'appointments' && <AppointmentView onBack={() => navigate('home')} user={user} setIsLoading={setIsLoading}/>}
        {currentView === 'orders' && user && <OrdersView orders={orders.filter(o => o.customerName === user.name)} onBack={() => navigate('home')} onStartShopping={() => navigate('shop')}/>}
        {currentView === 'address' && user && <AddressView user={user} onSave={handleSaveAddressWithLoad} onBack={() => navigate('home')} />}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-12 px-4 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">ShopNcarT</h4>
            <p className="text-sm leading-relaxed mb-4">Your one-stop shop for everything you need. Quality verified and customer trusted.</p>
            <div className="flex space-x-4">
              <Facebook size={18} className="cursor-pointer hover:text-brand transition-colors" />
              <Instagram size={18} className="cursor-pointer hover:text-brand transition-colors" />
              <Twitter size={18} className="cursor-pointer hover:text-brand transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => { handleCategoryChange(ProductCategory.MensFashion); navigate('shop'); }} className="hover:text-brand">Fashion</button></li>
              <li><button onClick={() => { handleCategoryChange(ProductCategory.TVAppliancesElectronics); navigate('shop'); }} className="hover:text-brand">Electronics</button></li>
              <li><button onClick={() => { handleCategoryChange(ProductCategory.MobilesComputers); navigate('shop'); }} className="hover:text-brand">Mobiles</button></li>
              <li><button onClick={() => { handleCategoryChange(ProductCategory.BeautyHealthGrocery); navigate('shop'); }} className="hover:text-brand">Beauty & Health</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand">Track Order</a></li>
              <li><a href="#" className="hover:text-brand">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-brand">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2"><Mail size={16} /> <span>info@shopncart.store</span></li>
              <li className="flex items-center space-x-2"><Phone size={16} /> <span>+91 7829585677</span></li>
              <li className="flex items-center space-x-2"><MapPin size={16} /> <span className="leading-tight">46/A1, PKP Complex, Mannur, Kerala</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopNcarT. All rights reserved.</p>
        </div>
      </footer>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30 md:hidden h-16 flex justify-around items-center pb-safe">
        <button onClick={() => navigate('home')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'home' ? 'text-brand' : 'text-gray-400'}`}><Home size={22} /><span className="text-[10px] mt-1 font-medium">Home</span></button>
        <button onClick={() => navigate('shop')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'shop' ? 'text-brand' : 'text-gray-400'}`}><Store size={22} /><span className="text-[10px] mt-1 font-medium">Shop</span></button>
        <button onClick={() => navigate('cart')} className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${currentView === 'cart' ? 'text-brand' : 'text-gray-400'}`}><ShoppingBag size={22} /><span className="text-[10px] mt-1 font-medium">Bag</span></button>
        <button onClick={() => user ? setShowProfileMenu(!showProfileMenu) : navigate('auth')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${user ? 'text-brand' : 'text-gray-400'}`}><UserIcon size={22} /><span className="text-[10px] mt-1 font-medium">{user ? 'Account' : 'Login'}</span></button>
      </nav>
    </div>
  );
}

export default App;