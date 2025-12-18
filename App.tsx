import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, User as UserIcon, Search, Menu, Home, Store, Truck, 
  X, LogOut, MapPin, Mail, Phone, Package, Loader2, CheckCircle, 
  ShieldCheck, ChevronRight, Settings, Star, MessageSquare, 
  ArrowLeft, RefreshCcw, HelpCircle
} from 'lucide-react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, User, Order, SupportTicket } from './types';
import { authService } from './services/authService';
import { dbService } from './services/dbService';

type ViewType = 'home' | 'shop' | 'product-detail' | 'cart' | 'auth' | 'admin' | 'orders' | 'support' | 'order-confirmation' | 'payment';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200');
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const [currentUser, dbProducts, dbCategories, dbOrders] = await Promise.all([
          authService.getCurrentUser(),
          dbService.getProducts(),
          dbService.getCategories(),
          dbService.getOrders()
        ]);
        setUser(currentUser);
        setProducts(dbProducts);
        setCategories(dbCategories);
        setOrders(dbOrders);
        
        if (currentUser?.role === 'admin') {
          setCurrentView('admin');
        }
      } catch (err) {
        console.error('Initial data sync failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const navigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setOrders([]);
      navigate('home');
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (user?.role === 'admin') {
      alert("Admin accounts are for management and cannot place orders.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1, image: product.images[0] }];
    });
  };

  const handleReturnRequest = async (orderId: string) => {
    const reason = prompt("Please provide a reason for return/refund:");
    if (!reason) return;
    setIsLoading(true);
    try {
      await dbService.updateOrderStatus(orderId, 'Return Requested', reason);
      const updatedOrders = await dbService.getOrders();
      setOrders(updatedOrders);
      alert("Return request submitted. Admin will review it.");
    } catch (e) {
      alert("Failed to process return request.");
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery, products]);

  const SupportForm = () => {
    const [ticket, setTicket] = useState({ subject: '', message: '' });
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return navigate('auth');
      setIsLoading(true);
      try {
        await dbService.createTicket({
          userId: user.id,
          userName: user.name,
          email: user.email,
          subject: ticket.subject,
          message: ticket.message
        });
        alert("Support request submitted successfully.");
        navigate('home');
      } catch (e) {
        alert("Failed to submit request.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <h2 className="text-3xl font-black text-primary-900 mb-6">Customer Support</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-primary-50 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
            <input 
              required 
              value={ticket.subject} 
              onChange={e => setTicket({...ticket, subject: e.target.value})}
              className="w-full p-3 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" 
              placeholder="How can we help you?" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
            <textarea 
              required 
              rows={5} 
              value={ticket.message} 
              onChange={e => setTicket({...ticket, message: e.target.value})}
              className="w-full p-3 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" 
              placeholder="Provide details about your query..." 
            />
          </div>
          <button className="w-full bg-primary-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-primary-700 transition-all">
            Send Message
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <Loader2 size={48} className="text-primary-600 animate-spin" />
          <p className="mt-4 text-primary-900 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing ShopNcarT...</p>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-primary-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg"><Menu /></button>
            <h1 onClick={() => navigate('home')} className="text-2xl font-black tracking-tighter cursor-pointer">ShopNcarT</h1>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('cart')} className="relative p-2 hover:bg-white/10 rounded-lg">
              <ShoppingBag />
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-primary-600">{cartItemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-700">
             <div className="p-4">
                <div className="rounded-3xl overflow-hidden relative h-[450px] group cursor-pointer" onClick={() => navigate('shop')}>
                   <img src={bannerImage} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent flex items-end p-12">
                      <div className="text-white max-w-xl">
                         <h2 className="text-5xl font-black mb-4 leading-tight">PREMIUM GLOBAL SHOPPING</h2>
                         <p className="text-lg opacity-90 mb-8">Curated essentials for your modern lifestyle. Quality guaranteed.</p>
                         <button className="bg-white text-primary-600 px-10 py-4 rounded-full font-black uppercase text-sm shadow-xl active:scale-95 transition-transform">Explore Store</button>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-8">
               {[
                 { icon: <Truck />, title: 'Global Delivery', desc: 'Fast shipping worldwide' },
                 { icon: <ShieldCheck />, title: 'Buyer Protection', desc: 'Secure payments & transactions' },
                 { icon: <RefreshCcw />, title: 'Easy Returns', desc: 'Hassle-free 30-day returns' },
                 { icon: <HelpCircle />, title: 'Expert Support', desc: 'Available for you 24/7' }
               ].map((item, i) => (
                 <div key={i} className="bg-primary-50/50 p-6 rounded-3xl text-center border border-primary-100 hover:shadow-sm transition-shadow">
                    <div className="text-primary-600 flex justify-center mb-3">{item.icon}</div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-primary-900 mb-1">{item.title}</h3>
                    <p className="text-[10px] text-primary-700 font-bold uppercase opacity-60">{item.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {currentView === 'shop' && (
          <div className="px-4 py-12 max-w-7xl mx-auto">
             <div className="flex space-x-3 overflow-x-auto no-scrollbar mb-12">
               {['All', ...categories].map(cat => (
                 <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary-600 text-white shadow-lg' : 'bg-primary-50 text-primary-800'}`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} user={user} onAddToCart={addToCart} onClick={(p) => { setSelectedProduct(p); navigate('product-detail'); }} />
                )) : (
                  <div className="col-span-full py-24 text-center">
                    <Package size={48} className="mx-auto text-primary-100 mb-4" />
                    <p className="font-bold text-primary-900">No products found matching your search.</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {currentView === 'support' && <SupportForm />}

        {currentView === 'orders' && user && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-black text-primary-900 mb-8">My Orders</h2>
            <div className="space-y-4">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-primary-50 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="font-black text-primary-900">Order #{order.id.slice(-6)}</p>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-primary-50 text-primary-600'
                      }`}>{order.status}</span>
                    </div>
                    <p className="text-xs text-primary-600/60 font-bold uppercase">{order.date}</p>
                  </div>
                  <div className="flex justify-between md:justify-end items-center md:space-x-6">
                    <p className="font-black text-lg">₹{order.total}</p>
                    {order.status === 'Delivered' && (
                      <button 
                        onClick={() => handleReturnRequest(order.id)}
                        className="text-[9px] font-black uppercase tracking-widest text-primary-600 border border-primary-600 px-4 py-2 rounded-xl hover:bg-primary-600 hover:text-white transition-all"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-primary-50/20 rounded-3xl border border-dashed border-primary-100">
                  <Package size={32} className="mx-auto text-primary-200 mb-4" />
                  <p className="text-primary-900/40 font-bold">You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail product={selectedProduct} user={user} onBack={() => navigate('shop')} onAddToCart={addToCart} onBuyNow={() => navigate('cart')} onAddReview={() => {}} />
        )}
        
        {currentView === 'auth' && <Auth onLogin={u => { setUser(u); if(u.role === 'admin') navigate('admin'); else navigate('home'); }} onBack={() => navigate('home')} />}
        
        {currentView === 'admin' && user?.role === 'admin' && (
          <AdminDashboard 
            products={products} orders={orders} bannerImage={bannerImage} categories={categories}
            onUpdateProduct={async p => { await dbService.updateProduct(p); setProducts(prev => prev.map(o => o.id === p.id ? p : o)); }}
            onAddProduct={async p => { await dbService.addProduct(p); setProducts(prev => [p, ...prev]); }}
            onDeleteProduct={async id => { await dbService.deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); }}
            onUpdateOrderStatus={async (id, s) => { await dbService.updateOrderStatus(id, s); setOrders(prev => prev.map(o => o.id === id ? { ...o, status: s } : o)); }}
            onUpdateBanner={setBannerImage}
            onAddCategory={async c => { await dbService.addCategory(c); setCategories(prev => [...prev, c]); }}
            onDeleteCategory={async c => { await dbService.deleteCategory(c); setCategories(prev => prev.filter(cat => cat !== c)); }}
            onLogout={handleLogout}
          />
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-primary-50 md:hidden flex justify-around p-4 z-40">
        <button onClick={() => navigate('home')} className={currentView === 'home' ? 'text-primary-600' : 'text-primary-300'}><Home /></button>
        <button onClick={() => navigate('shop')} className={currentView === 'shop' ? 'text-primary-600' : 'text-primary-300'}><Store /></button>
        <button onClick={() => navigate('support')} className={currentView === 'support' ? 'text-primary-600' : 'text-primary-300'}><HelpCircle /></button>
        <button onClick={() => navigate(user ? 'orders' : 'auth')} className={currentView === 'orders' ? 'text-primary-600' : 'text-primary-300'}><UserIcon /></button>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-72 h-full p-8 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
             <div className="flex justify-between items-center mb-12">
               <h2 className="font-black text-primary-900 tracking-tighter uppercase text-sm">ShopNcarT Menu</h2>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-primary-50 rounded-lg"><X /></button>
             </div>
             <div className="space-y-6 flex-grow">
                <button onClick={() => navigate('home')} className="flex items-center space-x-4 font-bold text-primary-900 hover:text-primary-600 w-full text-left transition-colors"><Home size={20}/> <span>Home</span></button>
                <button onClick={() => navigate('shop')} className="flex items-center space-x-4 font-bold text-primary-900 hover:text-primary-600 w-full text-left transition-colors"><Store size={20}/> <span>All Categories</span></button>
                <button onClick={() => navigate('support')} className="flex items-center space-x-4 font-bold text-primary-900 hover:text-primary-600 w-full text-left transition-colors"><MessageSquare size={20}/> <span>Support</span></button>
                {user?.role === 'admin' && (
                  <button onClick={() => navigate('admin')} className="flex items-center space-x-4 font-bold text-primary-600 w-full text-left pt-4 border-t border-primary-50"><Settings size={20}/> <span>Admin Dashboard</span></button>
                )}
             </div>
             <div className="pt-8 border-t border-primary-50">
                {user ? (
                   <button onClick={handleLogout} className="flex items-center space-x-4 font-bold text-red-500 w-full text-left hover:opacity-80 transition-opacity"><LogOut size={20}/> <span>Logout</span></button>
                ) : (
                   <button onClick={() => navigate('auth')} className="flex items-center space-x-4 font-bold text-primary-600 w-full text-left hover:opacity-80 transition-opacity"><UserIcon size={20}/> <span>Sign In / Join</span></button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;