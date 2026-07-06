import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/AppContext';

export default function ProductCard({ id, title, price, tag, image, category }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const saved = isInWishlist(id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <div className="group relative flex flex-col bg-[#0A0A0C] rounded-luxury shadow-md hover:shadow-luxury hover:-translate-y-1 transition-luxury overflow-hidden p-2 select-none">
      {/* Display Asset Media Capture Frame Container Area */}
      <Link to={`/product/${id}`} className="relative aspect-[3.4/4] w-full bg-brand-card-bg rounded-t-[10px] overflow-hidden block">
        {tag && (
          <span className="absolute top-3 left-3 bg-brand-red text-white text-[8px] font-black tracking-widest px-2 py-0.5 z-10 rounded-full uppercase">
            {tag}
          </span>
        )}
        <button 
          onClick={handleHeartClick}
          className={`absolute top-3 right-3 p-2 rounded-full bg-black/40 text-neutral-400 hover:text-brand-red transition-colors z-10 backdrop-blur-md cursor-pointer ${
            saved ? 'text-brand-red' : ''
          }`}
        >
          <Heart size={12} className={saved ? 'fill-brand-red text-brand-red' : ''} />
        </button>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-transform duration-700 scale-100 group-hover:scale-102"
          loading="lazy"
        />
      </Link>

      {/* Meta Product Details Context Box Wrapper Info Layout */}
      <div className="pt-4 pb-2 px-2 flex flex-col bg-transparent">
        <span className="text-[8px] font-black tracking-widest text-brand-red mb-1 uppercase">
          {category || 'ESSENTIAL'}
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <Link 
            to={`/product/${id}`}
            className="text-neutral-200 hover:text-white font-bold text-xs tracking-wide truncate max-w-[80%] uppercase transition-colors"
          >
            {title}
          </Link>
          <span className="text-white font-bold text-xs">
            ₹{price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}