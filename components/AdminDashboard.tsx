import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Image as ImageIcon, List, Plus, Trash2, 
  Edit2, CheckCircle, XCircle, LogOut, Loader2, AlertCircle, 
  MessageSquare, RefreshCw
} from 'lucide-react';
import { Product, Order, SupportTicket } from '../types';
import { dbService } from '../services/dbService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  bannerImage: string;
  categories: string[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateBanner: (url: string) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banner' | 'categories' | 'help'>('products');
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', brand: '', price: 0, mrp: 0, category: '', images: ['', '', '', '', ''], description: '', note: ''
  });

  useEffect(() => {
    if (activeTab === 'help') {
      const fetchTickets = async () => {
        setIsLoading(true);
        try {
          const data = await dbService.getTickets();
          setTickets(data);
        } catch (e) {}
        finally { setIsLoading(false); }
      };
      fetchTickets();
    }
  }, [activeTab]);

  const handleResolveTicket = async (id: string) => {
    await dbService.resolveTicket(id);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
  };

  return (
    <div className="min-h-screen bg-white flex">
      <aside className="w-64 bg-primary-900 text-white fixed h-full flex flex-col p-6">
        <h2 className="text-2xl font-black tracking-tighter mb-12">ShopNcarT</h2>
        <nav className="flex-grow space-y-4">
          {[
            { id: 'products', label: 'Inventory', icon: <Package size={18}/> },
            { id: 'orders', label: 'Orders & Returns', icon: <ShoppingCart size={18}/> },
            { id: 'help', label: 'Customer Help', icon: <MessageSquare size={18}/> },
            { id: 'banner', label: 'Storefront Ads', icon: <ImageIcon size={18}/> },
            { id: 'categories', label: 'Categories', icon: <List size={18}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-600 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
            >
              {tab.icon} <span className="text-sm font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={props.onLogout} className="flex items-center space-x-3 text-red-400 p-3 hover:bg-white/5 rounded-xl transition-colors"><LogOut size={18}/> <span className="text-sm font-bold">Sign Out</span></button>
      </aside>

      <main className="flex-1 ml-64 p-10 bg-primary-50/20">
        {isLoading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" /></div>}
        
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
               <h1 className="text-3xl font-black text-primary-900">Inventory Management</h1>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); props.onAddProduct({ ...productForm, id: Date.now().toString(), rating: 5, reviews: 0, manufacturer: { name: 'ShopNcarT Fulfillment', address: 'Warehouse A', contact: '000', email: 'dispatch@shopncart.com' } } as Product); }} className="bg-white p-8 rounded-3xl shadow-sm border border-primary-50 grid grid-cols-2 gap-6">
                <input required className="p-3 border rounded-xl" placeholder="Product Name" onChange={e => setProductForm({...productForm, name: e.target.value})} />
                <input required className="p-3 border rounded-xl" placeholder="Brand" onChange={e => setProductForm({...productForm, brand: e.target.value})} />
                <select className="p-3 border rounded-xl" onChange={e => setProductForm({...productForm, category: e.target.value})}>
                  <option>Select Category</option>
                  {props.categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="flex space-x-4">
                  <input required type="number" className="p-3 border rounded-xl flex-1" placeholder="Price" onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} />
                  <input required type="number" className="p-3 border rounded-xl flex-1" placeholder="MRP" onChange={e => setProductForm({...productForm, mrp: parseFloat(e.target.value)})} />
                </div>
                <textarea className="p-3 border rounded-xl col-span-2" placeholder="Description" rows={3} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                <button className="bg-primary-600 text-white font-black py-4 rounded-xl col-span-2 shadow-lg hover:bg-primary-700 transition-all">Add New Item</button>
             </form>
             <div className="bg-white rounded-3xl shadow-sm border border-primary-50 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-primary-50">
                    <tr><th className="p-4 font-black">PRODUCT</th><th className="p-4 font-black">PRICE</th><th className="p-4 font-black">ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {props.products.map(p => (
                      <tr key={p.id} className="border-t border-primary-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold">{p.name}</td>
                        <td className="p-4 font-bold">₹{p.price}</td>
                        <td className="p-4"><button onClick={() => props.onDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <h1 className="text-3xl font-black text-primary-900">Order Tracking & Returns</h1>
             <div className="bg-white rounded-3xl shadow-sm border border-primary-50 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-primary-50">
                    <tr><th className="p-4 font-black">ORDER ID</th><th className="p-4 font-black">CUSTOMER</th><th className="p-4 font-black">STATUS</th><th className="p-4 font-black">ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {props.orders.map(order => (
                      <tr key={order.id} className="border-t border-primary-50">
                        <td className="p-4 font-mono">{order.id.slice(-6)}</td>
                        <td className="p-4 font-bold">{order.customerName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-lg uppercase tracking-tighter font-black ${
                            order.status.includes('Return') || order.status === 'Refunded' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'
                          }`}>{order.status}</span>
                          {order.returnReason && <p className="text-[10px] text-red-400 mt-1 italic font-medium">Reason: {order.returnReason}</p>}
                        </td>
                        <td className="p-4 flex space-x-2">
                          <button onClick={() => props.onUpdateOrderStatus(order.id, 'Shipped')} className="p-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" title="Mark Shipped"><Package size={14}/></button>
                          <button onClick={() => props.onUpdateOrderStatus(order.id, 'Delivered')} className="p-2 text-green-500 bg-green-50 rounded-lg hover:bg-green-100 transition-colors" title="Mark Delivered"><CheckCircle size={14}/></button>
                          {order.status === 'Return Requested' && (
                            <>
                              <button onClick={() => props.onUpdateOrderStatus(order.id, 'Refunded')} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="Approve Refund"><RefreshCw size={14}/></button>
                              <button onClick={() => props.onUpdateOrderStatus(order.id, 'Return Rejected')} className="p-2 text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors" title="Reject Return"><XCircle size={14}/></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h1 className="text-3xl font-black text-primary-900">Customer Help Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {tickets.map(t => (
                 <div key={t.id} className={`p-6 rounded-3xl border ${t.status === 'Open' ? 'bg-white border-primary-100' : 'bg-primary-50/50 border-transparent opacity-60'}`}>
                    <div className="flex justify-between items-start mb-4">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${t.status === 'Open' ? 'bg-primary-600 text-white' : 'bg-primary-200 text-primary-800'}`}>{t.status}</span>
                       <p className="text-[10px] text-gray-400 font-bold">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    <h3 className="font-black text-primary-900 mb-2">{t.subject}</h3>
                    <p className="text-sm text-gray-600 mb-6">{t.message}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-primary-50">
                       <p className="text-[10px] font-black uppercase text-primary-600">{t.userName}</p>
                       {t.status === 'Open' && (
                         <button onClick={() => handleResolveTicket(t.id)} className="text-[10px] font-black text-primary-600 hover:underline uppercase transition-all">Resolve Ticket</button>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'banner' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             <h1 className="text-3xl font-black text-primary-900">Storefront Banner Ads</h1>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary-50 max-w-2xl">
                <img src={props.bannerImage} className="w-full h-40 object-cover rounded-2xl mb-6 shadow-lg" />
                <input 
                  className="w-full p-4 border rounded-2xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                  defaultValue={props.bannerImage} 
                  onBlur={e => props.onUpdateBanner(e.target.value)} 
                  placeholder="Paste banner image URL..."
                />
                <p className="text-xs text-primary-600 font-bold flex items-center"><AlertCircle size={14} className="mr-2"/> Recommended aspect ratio: 16:9 or 21:9.</p>
             </div>
           </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <h1 className="text-3xl font-black text-primary-900">Shop Taxonomy</h1>
             <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary-50">
                   <h3 className="font-black mb-6">Create New Category</h3>
                   <input className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Electronics" id="catInput" />
                   <button onClick={() => { const el = document.getElementById('catInput') as any; if(el.value) props.onAddCategory(el.value); el.value = ''; }} className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors">Add Category</button>
                </div>
                <div className="space-y-2">
                  {props.categories.map(c => (
                    <div key={c} className="bg-white p-4 rounded-2xl border border-primary-50 flex justify-between items-center hover:shadow-sm transition-shadow">
                       <span className="font-bold">{c}</span>
                       <button onClick={() => props.onDeleteCategory(c)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;