import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Phone, Mail, MapPin, AlertCircle, ShoppingCart } from 'lucide-react';
import { Product, User } from '../types';

interface ProductDetailProps {
  product: Product;
  user: User | null;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddReview: (productId: string, rating: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  user, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onAddReview 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(product.id, userRating);
    setShowReviewForm(false);
    setReviewText('');
  };

  const discount = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header / Back Button */}
      <div className="sticky top-0 z-10 bg-blue-900 border-b border-blue-800 px-4 py-3 flex items-center shadow-md">
        <button onClick={onBack} className="p-2 hover:bg-blue-800 rounded-full transition-colors mr-2 text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white truncate max-w-[200px] sm:max-w-md">{product.name}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
            {discount > 0 && (
              <div className="absolute top-6 left-6 z-10 bg-red-500 text-white font-black px-4 py-1 rounded-xl shadow-lg">
                {discount}% OFF
              </div>
            )}
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
            {product.images.filter(img => img !== '').map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white ${
                  activeImageIndex === idx ? 'border-brand shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {product.brand}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                 <Star size={16} className="text-yellow-400 fill-current mr-1.5" />
                 <span className="text-gray-900 font-black text-sm">{product.rating}</span>
              </div>
              <span className="text-gray-400 font-medium text-sm">{product.reviews} Global Reviews</span>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-black text-gray-900 tracking-tight">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-lg text-gray-400 line-through font-medium">₹{product.mrp}</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-2 flex items-center">
                <ShieldCheck size={12} className="mr-1 text-brand"/> TAX INCLUDED • SECURE TRANSACTION
              </p>
            </div>

            <div className="mb-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Product Summary</h3>
               <p className="text-gray-600 leading-relaxed text-sm">
                 {product.description}
               </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 py-4 px-6 border-2 border-brand text-brand font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center active:scale-95"
              >
                <ShoppingCart size={22} className="mr-2" />
                Add to Cart
              </button>
              <button 
                onClick={() => onBuyNow(product)}
                className="flex-1 py-4 px-6 bg-brand text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                Order Now
              </button>
            </div>

            {/* Logistics Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Truck size={20} className="text-brand flex-shrink-0" />
                <span className="font-bold">Lightning Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <ShieldCheck size={20} className="text-brand flex-shrink-0" />
                <span className="font-bold">Buyer Protection Policy</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Details */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Important Notes</h3>
            <div className="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100 text-sm text-gray-600 leading-relaxed">
               {product.note || 'No specific notes for this product.'}
            </div>
          </div>

          {/* Seller Details */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Fulfilled By</h3>
            <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 space-y-3 border border-gray-100">
              <div className="flex items-center justify-between">
                 <p className="font-black text-gray-800 text-base">{product.manufacturer.name}</p>
                 <span className="bg-brand text-white text-[9px] font-black px-2 py-0.5 rounded-full">TOP SELLER</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span className="font-medium">{product.manufacturer.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400" />
                <span className="font-medium">{product.manufacturer.contact}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <span className="font-medium">{product.manufacturer.email}</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-10" />

          {/* Reviews Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Community Verdict</h3>
              {user && user.role === 'user' && !showReviewForm && (
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Post Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-3xl mb-10 border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                <div className="mb-5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">My Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        <Star 
                          size={28} 
                          className={star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Observations</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
                    rows={4}
                    placeholder="Describe your experience with this product..."
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 text-xs font-black text-white bg-brand rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all active:scale-95"
                  >
                    Submit Veridct
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
               <div className="py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Star size={32} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold text-sm tracking-tight">No customer reviews verified for this SKU yet.</p>
                  <p className="text-[10px] text-gray-300 uppercase font-black mt-1">Be the pioneer of this listing</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;