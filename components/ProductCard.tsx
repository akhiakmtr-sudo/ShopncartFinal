import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { Product, User } from '../types';

interface ProductCardProps {
  product: Product;
  user: User | null;
  onAddToCart: (product: Product) => void;
  onAddReview?: (productId: string, rating: number) => void;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, user, onAddToCart, onAddReview, onClick }) => {
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [userRating, setUserRating] = useState(5);

  const handleReviewSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddReview) {
      onAddReview(product.id, userRating);
      setShowReviewInput(false);
    }
  };

  const discount = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:translate-y-[-4px] transition-all cursor-pointer group relative"
    >
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
          {discount}% OFF
        </div>
      )}
      
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-gray-700 flex items-center shadow-sm">
          <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
          {product.rating}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
          {product.brand}
        </div>
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        <div className="flex items-baseline space-x-2 mt-auto">
          <span className="font-black text-lg text-gray-900">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-[11px] text-gray-400 line-through">₹{product.mrp}</span>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="w-full mt-3 bg-brand text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95"
          aria-label="Add to cart"
        >
          <Plus size={16} className="mr-1" /> Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;