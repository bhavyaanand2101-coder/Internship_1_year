import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronDown, ChevronUp, Star, ZoomIn, Info } from 'lucide-react';
import { useCart, useWishlist, useRecentlyViewed, useToasts } from '../context/AppContext';
import { api } from '../lib/api';
import SEO from '../components/SEO';

export default function ProductDetails() {
  const { id } = useParams();
  const productId = parseInt(id);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed();
  const { addToast } = useToasts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(0); // 0: Details, 1: Specs, 2: Care
  const [zoomLevel, setZoomLevel] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [newReviewUser, setNewReviewUser] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProductDetails() {
      try {
        setLoading(true);
        const data = await api.getProduct(productId);
        setProduct(data);
        addToRecentlyViewed(data);

        // Fetch reviews
        const commentList = await api.getReviews(productId);
        setReviews(commentList);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="w-full bg-black min-h-[70vh] flex justify-center items-center">
        <SEO title="Loading Product" />
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-black min-h-[70vh] flex flex-col justify-center items-center text-center px-4">
        <SEO title="Product Not Found" />
        <h2 className="text-white font-black font-impact tracking-widest text-3xl uppercase mb-4">
          PRODUCT NOT FOUND
        </h2>
        <p className="text-neutral-500 text-xs tracking-wider mb-8 max-w-xs">
          The item you are searching for does not exist in our store catalog.
        </p>
        <Link 
          to="/shop" 
          className="bg-brand-red hover:bg-red-700 text-white font-black text-xs tracking-widest px-8 py-3.5 uppercase transition rounded-full"
        >
          SHOP THE DROP
        </Link>
      </div>
    );
  }

  const toggleAccordion = (idx) => {
    setActiveAccordion(activeAccordion === idx ? null : idx);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewUser || !newReviewComment) {
      addToast('Please fill out all fields.', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const added = await api.addReview(product.id, {
        user: newReviewUser,
        rating: newReviewRating,
        comment: newReviewComment
      });
      setReviews((prev) => [added, ...prev]);
      setNewReviewUser('');
      setNewReviewComment('');
      setNewReviewRating(5);
      addToast('Review submitted successfully!', 'success');
    } catch (err) {
      addToast('Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLikeReview = async (reviewMongoId) => {
    try {
      const updated = await api.likeReview(product.id, reviewMongoId);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewMongoId ? { ...r, likes: updated.likes, helpful: true } : r))
      );
      addToast('Review helpful vote recorded.', 'success');
    } catch (err) {
      // Ignored
    }
  };

  return (
    <div className="w-full bg-black min-h-screen py-12 md:py-20 select-none">
      <SEO title={product.title} description={product.description} image={product.image} />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-8">
          <Link to="/" className="hover:text-white transition">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition">SHOP</Link>
          <span>/</span>
          <span className="text-white">{product.title}</span>
        </div>

        {/* Split Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          
          {/* Left Media Stage Column */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            
            {/* Vertical thumbnails */}
            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 bg-neutral-950 rounded-luxury overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    idx === activeImageIdx ? 'border-brand-red' : 'border-transparent hover:border-neutral-700'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover object-top" alt="" />
                </button>
              ))}
            </div>

            {/* Main Stage with Zoom */}
            <div 
              className="flex-grow aspect-[3.2/4] bg-neutral-950 rounded-luxury overflow-hidden relative cursor-zoom-in order-1 md:order-2 shadow-luxury"
              onMouseEnter={() => setZoomLevel(true)}
              onMouseLeave={() => setZoomLevel(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={product.images[activeImageIdx]} 
                alt={product.title}
                className={`w-full h-full object-cover object-top transition-transform duration-100 ${
                  zoomLevel ? 'scale-[2.0]' : 'scale-100'
                }`}
                style={
                  zoomLevel 
                    ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` } 
                    : undefined
                }
              />
              {!zoomLevel && (
                <div className="absolute bottom-4 right-4 bg-black/50 border border-neutral-950 p-2.5 rounded-full text-white/80 pointer-events-none backdrop-blur-sm">
                  <ZoomIn size={14} />
                </div>
              )}
            </div>

          </div>

          {/* Right configurations column */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            <div className="pb-6 mb-6 border-b border-neutral-950">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="bg-brand-red text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase">
                  {product.tag}
                </span>
                <span className="text-[9px] text-neutral-500 font-bold tracking-widest uppercase">
                  {product.category} STYLE
                </span>
              </div>
              
              <h1 className="text-white text-3xl sm:text-4xl font-black font-impact tracking-tight uppercase leading-none mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-6">
                <div className="text-2xl font-bold text-white">₹{product.price.toFixed(2)}</div>
                
                <div className="flex items-center gap-1.5 border border-neutral-950 px-3 py-1 bg-neutral-950/40 rounded-full">
                  <Star size={10} className="fill-brand-red text-brand-red" />
                  <span className="text-xs font-bold text-white">{product.rating}</span>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed tracking-wide mb-8">
              {product.description}
            </p>

            {/* Colors list */}
            <div className="mb-6">
              <span className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-2">
                Color: {product.color}
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <div
                    key={c.name}
                    title={c.name}
                    className={`w-6 h-6 border rounded-full ${c.class} flex items-center justify-center p-0.5`}
                  >
                    <span className="w-full h-full rounded-full" style={{ backgroundColor: c.value }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Size list */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase">
                  SELECT SIZE
                </span>
                <Link to="/faq" className="text-[9px] font-bold text-brand-red hover:underline tracking-widest uppercase">
                  SIZE GUIDE
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full text-xs font-black tracking-widest border uppercase transition-all cursor-pointer flex items-center justify-center ${
                      selectedSize === size
                        ? 'bg-brand-red border-brand-red text-white'
                        : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:border-neutral-600 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-neutral-950 bg-neutral-950/40 rounded-full px-2 shrink-0">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-3 text-neutral-500 hover:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 text-xs font-black text-white w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-3 text-neutral-500 hover:text-white cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, selectedSize, product.color, quantity)}
                className="flex-grow bg-brand-red hover:bg-red-700 text-white font-black text-xs tracking-widest py-4 uppercase transition duration-300 rounded-full shadow-lg hover:shadow-brand-red/20 cursor-pointer"
              >
                ADD TO BAG
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 border rounded-full cursor-pointer transition ${
                  isInWishlist(product.id)
                    ? 'border-brand-red bg-brand-red/10 text-brand-red'
                    : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:border-neutral-600 hover:text-white'
                }`}
              >
                <Heart size={16} className={isInWishlist(product.id) ? 'fill-brand-red' : ''} />
              </button>
            </div>

            {/* Accordions */}
            <div className="space-y-px border-t border-neutral-950">
              
              <div className="py-4 border-b border-neutral-950">
                <button
                  onClick={() => toggleAccordion(0)}
                  className="w-full flex items-center justify-between text-left text-xs font-black tracking-widest uppercase text-white hover:text-brand-red transition cursor-pointer"
                >
                  <span>FABRIC & DETAILS</span>
                  {activeAccordion === 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {activeAccordion === 0 && (
                  <div className="text-neutral-500 text-[11px] font-semibold mt-3 tracking-wide leading-relaxed uppercase space-y-2">
                    <p>Double-knit premium 240 GSM organic combed ringspun cotton fabric drape.</p>
                    {product.highlights && product.highlights.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="py-4 border-b border-neutral-950">
                <button
                  onClick={() => toggleAccordion(1)}
                  className="w-full flex items-center justify-between text-left text-xs font-black tracking-widest uppercase text-white hover:text-brand-red transition cursor-pointer"
                >
                  <span>SPECIFICATIONS</span>
                  {activeAccordion === 1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {activeAccordion === 1 && (
                  <ul className="text-neutral-500 text-[11px] font-semibold mt-3 tracking-wide space-y-2 list-disc list-inside">
                    {product.specs.map((spec, sidx) => (
                      <li key={sidx} className="uppercase">{spec}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="py-4 border-b border-neutral-950">
                <button
                  onClick={() => toggleAccordion(2)}
                  className="w-full flex items-center justify-between text-left text-xs font-black tracking-widest uppercase text-white hover:text-brand-red transition cursor-pointer"
                >
                  <span>CARE & WASH INSTRUCTIONS</span>
                  {activeAccordion === 2 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {activeAccordion === 2 && (
                  <p className="text-neutral-500 text-[11px] font-semibold mt-3 tracking-wide leading-relaxed uppercase">
                    {product.careInstructions || 'Wash cold, hang to dry.'}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 mb-24 border-t border-neutral-950">
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-white text-2xl font-black font-impact tracking-widest uppercase mb-2">
                CUSTOMER REVIEWS
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex text-brand-red">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-red text-brand-red" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white uppercase">{product.rating} OUT OF 5</span>
              </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleAddReviewSubmit} className="bg-neutral-950/20 border border-neutral-900/40 p-6 rounded-luxury space-y-4">
              <h4 className="text-white font-black text-xs tracking-widest uppercase">WRITE A REVIEW</h4>
              
              <div>
                <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">YOUR NAME</label>
                <input
                  type="text"
                  required
                  value={newReviewUser}
                  onChange={(e) => setNewReviewUser(e.target.value)}
                  className="bg-black border border-neutral-900 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition"
                  placeholder="CHRIS T."
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1 flex items-center justify-between">
                  <span>RATING</span>
                  <span className="text-neutral-400">{newReviewRating} STARS</span>
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewReviewRating(stars)}
                      className="text-brand-red hover:scale-110 transition cursor-pointer"
                    >
                      <Star size={18} className={stars <= newReviewRating ? 'fill-brand-red text-brand-red' : 'text-neutral-700'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">COMMENTS</label>
                <textarea
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={4}
                  className="bg-black border border-neutral-900 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition resize-none"
                  placeholder="WHAT DO YOU THINK?"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-brand-red hover:bg-red-700 text-white font-black text-xs tracking-widest py-3 uppercase transition duration-300 rounded-full cursor-pointer disabled:opacity-50"
              >
                {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h4 className="text-neutral-400 font-bold text-xs tracking-widest uppercase border-b border-neutral-950 pb-2">
              VERIFIED FEEDBACK ({reviews.length})
            </h4>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev._id || rev.id} className="bg-neutral-950/10 border border-neutral-900/40 p-5 rounded-luxury space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white uppercase">{rev.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < rev.rating ? 'fill-brand-red text-brand-red' : 'text-neutral-800'} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-600 font-bold tracking-widest">{rev.date}</span>
                    </div>
                    <p className="text-neutral-400 text-xs tracking-wide leading-relaxed font-medium uppercase">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => !rev.helpful && handleLikeReview(rev._id)}
                        disabled={rev.helpful}
                        className={`text-[8px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border transition cursor-pointer flex items-center gap-1.5 ${
                          rev.helpful
                            ? 'bg-neutral-900 border-neutral-900 text-brand-red'
                            : 'border-neutral-900 text-neutral-500 hover:text-white hover:border-neutral-700'
                        }`}
                      >
                        HELPFUL ({rev.likes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-600 font-semibold tracking-wider py-8">
                NO FEEDBACK REGISTERED FOR THIS DROP YET. BE THE FIRST.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
