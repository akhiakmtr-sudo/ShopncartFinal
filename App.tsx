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
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Settings,
  CreditCard,
  AlertCircle,
  Star
} from 'lucide-react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { PRODUCTS, APP_NAME } from './constants';
import { Product, CartItem, User, Order, ProductCategory } from './types';
import { authService } from './services/authService';

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
            <p className="text-yellow-800 text-sm font-medium">Securely processing payment...</p>
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

// -- Main App Component --

function App() {
  // Global State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(Object.values(ProductCategory));
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1543083115-638c32cd3d58?auto=format&fit=crop&q=80&w=1200');
  const [orders, setOrders] = useState<Order[]>([]);

  // View State
  type ViewType = 'home' | 'shop' | 'product-detail' | 'cart' | 'auth' | 'admin' | 'orders' | 'address' | 'order-confirmation' | 'payment';
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [drawerSubView, setDrawerSubView] = useState<'main'>('main');

  // Initial Session Check
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          if (currentUser.role === 'admin') setCurrentView('admin');
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  // --- Navigation Helpers ---
  const navigate = async (view: ViewType) => {
    if (view === currentView) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setCurrentView(view);
    window.scrollTo(0, 0);
    setIsLoading(false);
  };

  const handleCategoryChange = async (cat: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setActiveCategory(cat);
    setIsLoading(false);
  };

  const handleLogin = async (loggedInUser: User) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await authService.logout();
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(null);
    setCurrentView('home');
    setShowProfileMenu(false);
    setIsLoading(false);
  };

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
    addToCart(product);
    navigate('order-confirmation');
  };

  const handleSaveAddressWithLoad = (updatedUser: User) => {
    setUser(updatedUser);
    alert('Address updated successfully!');
    navigate('home');
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
        onUpdateProduct={(p) => setProducts(prev => prev.map(old => old.id === p.id ? p : old))}
        onAddProduct={(p) => setProducts(prev => [...prev, p])}
        onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
        onUpdateOrderStatus={(id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))}
        onUpdateBanner={setBannerImage}
        onAddCategory={(c) => setCategories(prev => [...prev, c])}
        onDeleteCategory={(c) => setCategories(prev => prev.filter(cat => cat !== c))}
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
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
        onAddReview={() => alert("Review added!")}
      />
    );
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
            className="w-full h-40 sm:h-48 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-8">
            <div className="text-white max-w-xs">
               <h2 className="text-2xl md:text-3xl font-bold mb-2">Organic Wellness for a Better Life</h2>
               <p className="text-sm opacity-90 mb-4">Discover the power of nature with our premium herbal extracts.</p>
               <button className="bg-brand text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-green-600 transition-colors">Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-50 animate-in zoom-in duration-500 delay-100">
          <div className="bg-green-50 p-2 rounded-full mb-1 text-brand">
            <Truck size={24} />
          </div>
          <h3 className="font-bold text-sm text-gray-800">Swift Delivery</h3>
          <p className="text-xs text-gray-500">Across India</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-100 animate-in zoom-in duration-500 delay-200">
          <div className="bg-green-50 p-2 rounded-full mb-1 text-brand">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-sm text-gray-800">100% Pure</h3>
          <p className="text-xs text-gray-500">Quality Assured</p>
        </div>
      </div>

      <div className="px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
           <button onClick={() => navigate('shop')} className="text-brand text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              user={user}
              onAddToCart={addToCart} 
              onClick={(p) => { setSelectedProduct(p); navigate('product-detail'); }}
            />
          ))}
        </div>
      </div>

      <section className="px-6 py-10 bg-white mx-4 rounded-2xl shadow-sm border border-gray-50 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Roots</h2>
        <div className="w-16 h-1 bg-brand mb-6"></div>
        <p className="text-gray-600 text-sm leading-relaxed text-justify">
          At {APP_NAME}, we are committed to bringing you the finest selection of herbal remedies. Our products are sourced from sustainable farms and processed using methods that preserve their natural potency. We believe health is wealth, and nature holds the key.
        </p>
      </section>

      <section className="px-6 py-10 bg-blue-900 text-white mx-4 rounded-2xl shadow-lg mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Get in Touch</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-full shrink-0"><MapPin size={24} /></div>
            <div>
              <h3 className="font-bold text-sm">Main Branch</h3>
              <p className="text-blue-200 text-sm mt-1 leading-snug">46/A1, PKP Complex, Mannur, Palakkad, Kerala</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-full shrink-0"><Mail size={24} /></div>
            <div>
              <h3 className="font-bold text-sm">Customer Care</h3>
              <a href="mailto:care@greenleafherbals.com" className="text-blue-200 text-sm hover:text-white transition-colors">care@greenleafherbals.com</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-0 relative">
      {isLoading && <LoadingOverlay />}
      
      {/* Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-72 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-blue-900 text-white">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <UserIcon size={20} />
                 </div>
                 <div>
                    <p className="font-bold text-sm leading-tight">{user ? user.name : 'Welcome Guest'}</p>
                    <p className="text-[10px] text-blue-200 truncate w-32">{user ? user.email : 'Log in for orders'}</p>
                 </div>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 bg-gray-50">
                <div className="bg-white mb-2 py-1">
                  {!user ? (
                    <button onClick={() => { navigate('auth'); setIsMobileMenuOpen(false); }} className="w-full text-left px-6 py-4 flex items-center justify-between text-gray-800 font-bold hover:bg-gray-50">
                      <span>Login / Signup</span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  ) : (
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-6 py-4 flex items-center justify-between text-red-600 font-bold hover:bg-gray-50">
                      <span>Sign Out</span>
                      <LogOut size={18} />
                    </button>
                  )}
                </div>

                <div className="bg-white mb-2 py-1">
                  <div className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">My Hub</div>
                  <button onClick={() => { navigate('orders'); setIsMobileMenuOpen(false); }} className="w-full text-left px-6 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center"><Package size={18} className="mr-3 text-gray-400" /> <span>My Orders</span></div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                  <button onClick={() => { navigate('address'); setIsMobileMenuOpen(false); }} className="w-full text-left px-6 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center"><MapPin size={18} className="mr-3 text-gray-400" /> <span>Addresses</span></div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                </div>

                <div className="bg-white py-1">
                  <div className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop All</div>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => { handleCategoryChange(cat); navigate('shop'); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-6 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                    >
                      <span className="text-sm">{cat}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </button>
                  ))}
                </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 rounded-lg text-white hover:bg-white/10 transition-colors"><Menu size={26} /></button>
               <div className="flex items-center space-x-1 cursor-pointer" onClick={() => navigate('home')}>
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-md">
                     <Package size={20} className="text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-white tracking-tight hidden sm:block">{APP_NAME}</h1>
               </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('cart')} className="text-white hover:text-brand relative transition-colors">
                <ShoppingBag size={24} />
                {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-blue-900 font-bold">{cartItemCount}</span>}
              </button>
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-white/90">
                  <div className="text-right">
                    <p className="text-[10px] font-bold leading-tight">{user.name}</p>
                    <p className="text-[9px] opacity-60">Verified</p>
                  </div>
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-1 bg-white/10 rounded-full"><Settings size={16}/></button>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
             <input 
               type="text" 
               placeholder="Search organic herbals..." 
               value={searchQuery} 
               onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value && currentView !== 'shop') navigate('shop'); }} 
               className="w-full bg-blue-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-blue-300 focus:bg-white focus:text-gray-900 transition-all outline-none shadow-inner" 
             />
             <Search className="absolute left-3 top-2.5 text-blue-300" size={16} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto min-h-[calc(100vh-400px)]">
        {currentView === 'home' && renderHome()}
        {currentView === 'shop' && (
          <div className="px-4 py-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 pb-2">
              <button
                onClick={() => handleCategoryChange('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === 'All' ? 'bg-brand text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat ? 'bg-brand text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100'
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
                  onAddToCart={addToCart} 
                  onClick={(p) => { setSelectedProduct(p); navigate('product-detail'); }}
                />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-400 italic">No herbals found matching your criteria.</div>
            )}
          </div>
        )}
        {currentView === 'cart' && (
          <div className="px-4 py-6 mb-24 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Shopping Bag</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4 font-medium">Your bag is as light as a leaf.</p>
                <button onClick={() => navigate('shop')} className="bg-brand text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-100">Start Shopping</button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-gray-50" />
                      <div className="ml-4 flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                            <p className="text-[10px] text-brand font-bold uppercase">{item.category}</p>
                          </div>
                          <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-gray-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-2 py-1">
                            <button onClick={() => {
                              setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
                            }} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm font-bold">-</button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => {
                              setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
                            }} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm font-bold">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky bottom-24 z-20">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-lg text-gray-800">Grand Total</span>
                    <span className="font-bold text-2xl text-brand">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => user ? navigate('order-confirmation') : navigate('auth')}
                    className="w-full bg-brand text-white font-bold py-4 rounded-2xl hover:bg-green-600 shadow-xl shadow-green-100 transition-all active:scale-95"
                  >
                    Proceed to Secure Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {currentView === 'order-confirmation' && user && <OrderConfirmationView user={user} cart={cart} total={cartTotal} onBack={() => navigate('cart')} onPayNow={() => navigate('payment')} />}
        {currentView === 'payment' && <PaymentView total={cartTotal} onBack={() => navigate('order-confirmation')} onComplete={handlePaymentComplete} />}
        {currentView === 'orders' && user && <OrdersView orders={orders.filter(o => o.customerName === user.name)} onBack={() => navigate('home')} onStartShopping={() => navigate('shop')}/>}
        {currentView === 'address' && user && <AddressView user={user} onSave={handleSaveAddressWithLoad} onBack={() => navigate('home')} />}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-white font-bold text-xl mb-6">{APP_NAME}</h4>
            <p className="text-sm leading-relaxed mb-6">Premium organic extracts for a healthier tomorrow. Nature's wisdom, verified by science.</p>
            <div className="flex space-x-6">
              <Facebook size={20} className="cursor-pointer hover:text-brand transition-colors" />
              <Instagram size={20} className="cursor-pointer hover:text-brand transition-colors" />
              <Twitter size={20} className="cursor-pointer hover:text-brand transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate('shop')} className="hover:text-brand transition-colors">Shop All</button></li>
              <li><button onClick={() => navigate('orders')} className="hover:text-brand transition-colors">Track Order</button></li>
              <li><a href="#" className="hover:text-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3"><Mail size={18} className="text-brand shrink-0" /> <span>care@greenleafherbals.com</span></li>
              <li className="flex items-start space-x-3"><Phone size={18} className="text-brand shrink-0" /> <span>+91 98765 43210</span></li>
              <li className="flex items-start space-x-3"><MapPin size={18} className="text-brand shrink-0" /> <span className="leading-tight">46/A1, PKP Complex, Mannur, Palakkad, Kerala</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-xs mb-4">Join our community for herbal tips and exclusive offers.</p>
            <div className="flex bg-gray-800 rounded-xl overflow-hidden p-1">
               <input type="email" placeholder="Your email" className="bg-transparent border-none px-4 py-2 text-xs text-white outline-none w-full" />
               <button className="bg-brand text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Proudly rooted in Kerala.</p>
        </div>
      </footer>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-30 md:hidden h-16 flex justify-around items-center pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button onClick={() => navigate('home')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'home' ? 'text-brand' : 'text-gray-400'}`}><Home size={22} /><span className="text-[9px] mt-1 font-bold uppercase tracking-wider">Home</span></button>
        <button onClick={() => navigate('shop')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'shop' ? 'text-brand' : 'text-gray-400'}`}><Store size={22} /><span className="text-[9px] mt-1 font-bold uppercase tracking-wider">Shop</span></button>
        <button onClick={() => navigate('cart')} className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${currentView === 'cart' ? 'text-brand' : 'text-gray-400'}`}><ShoppingBag size={22} /><span className="text-[9px] mt-1 font-bold uppercase tracking-wider">Bag</span></button>
        <button onClick={() => user ? setIsMobileMenuOpen(true) : navigate('auth')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${user ? 'text-brand' : 'text-gray-400'}`}><UserIcon size={22} /><span className="text-[9px] mt-1 font-bold uppercase tracking-wider">{user ? 'Me' : 'Join'}</span></button>
      </nav>
    </div>
  );
}

export default App;