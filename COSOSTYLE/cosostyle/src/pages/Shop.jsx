import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';
import SEO from '../components/SEO';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Param Syncs
  const currentCategory = searchParams.get('category') || 'all';
  const urlSearchQuery = searchParams.get('search') || '';
  
  // Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [maxPrice, setMaxPrice] = useState(600); // Scraped prices are in INR (e.g. 299, 499)
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const list = await api.getProducts();
        setProducts(list);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Sync state search query if URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const setCategoryFilter = (category) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(600);
    setSelectedAvailability('all');
    setSortBy('newest');
    setSearchParams({});
  };

  // 1. FILTERING LOGIC
  const filteredProducts = products.filter((product) => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = selectedSize === 'all' || product.sizes.includes(selectedSize);
    const matchesColor = selectedColor === 'all' || product.color.toLowerCase() === selectedColor.toLowerCase();
    const matchesPrice = product.price <= maxPrice;
    const matchesAvailability = selectedAvailability === 'all' || product.availability === selectedAvailability;

    return matchesCategory && matchesSearch && matchesSize && matchesColor && matchesPrice && matchesAvailability;
  });

  // 2. SORTING LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'popular') return b.rating - a.rating;
    return b.id - a.id;
  });

  const sortLabel = {
    newest: 'NEWEST DROP',
    'price-low': 'PRICE: LOW TO HIGH',
    'price-high': 'PRICE: HIGH TO LOW',
    popular: 'MOST POPULAR'
  }[sortBy];

  return (
    <div className="w-full bg-black min-h-screen py-12">
      <SEO title="Shop Collection" description="Discover our full collection of premium organic cotton tees." />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Layout Categorized Header Segment Wrapper */}
        <div className="pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-950">
          <div>
            <span className="text-[10px] font-black text-brand-red tracking-widest uppercase block mb-1">COLLECTION</span>
            <h1 className="text-white text-5xl font-black font-impact tracking-tight uppercase">
              SHOP ALL TEES
            </h1>
          </div>
          <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
            {sortedProducts.length} ARTICLES DISPLAYED
          </span>
        </div>

        {/* Primary filter trigger bar & Search */}
        <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-neutral-950">
          
          {/* Quick Filter Selection Tabs - Rounded Luxury Style */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'classic', 'graphic', 'oversized'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2 text-[10px] font-black tracking-widest uppercase rounded-full transition-all cursor-pointer ${
                  currentCategory === cat
                    ? 'bg-brand-red text-white'
                    : 'bg-neutral-950/40 text-neutral-500 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex items-center bg-neutral-950 border border-neutral-950 focus-within:border-neutral-900 transition rounded-full px-3 py-1">
              <input
                type="text"
                placeholder="Search tees..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-transparent text-white px-2 py-1 pl-6 text-[10px] font-bold tracking-widest placeholder-neutral-700 focus:outline-none w-full md:w-56 uppercase"
              />
              <Search className="absolute left-4.5 text-neutral-700" size={12} />
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 border border-neutral-900 bg-neutral-950 hover:bg-neutral-900/80 px-4 py-2 text-[10px] font-black tracking-widest text-neutral-400 hover:text-white cursor-pointer rounded-full"
            >
              <SlidersHorizontal size={12} />
              FILTERS
            </button>

            {/* Sorting Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="relative flex items-center bg-[#0C0C0F] border border-neutral-950 px-4 py-2 text-[10px] font-black tracking-widest text-neutral-400 hover:text-white cursor-pointer select-none rounded-full"
              >
                <span>{sortLabel}</span>
                <ChevronDown size={12} className="ml-2 text-neutral-600" />
              </button>

              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-[#0F0F11] border border-neutral-900 rounded-luxury shadow-luxury z-20">
                    {[
                      { id: 'newest', name: 'NEWEST DROP' },
                      { id: 'price-low', name: 'PRICE: LOW TO HIGH' },
                      { id: 'price-high', name: 'PRICE: HIGH TO LOW' },
                      { id: 'popular', name: 'MOST POPULAR' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase transition ${
                          sortBy === opt.id ? 'text-brand-red bg-neutral-900/50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                        }`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Split Grid for Filters & Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar Column - Hidden on Mobile unless toggled */}
          <div className={`lg:col-span-3 space-y-6 ${showMobileFilters ? 'block animate-slide-down' : 'hidden lg:block'}`}>
            
            {/* Filter Section: Size */}
            <div className="bg-neutral-950/20 p-6 rounded-luxury border border-neutral-900/40">
              <h4 className="text-white text-[10px] font-black tracking-widest uppercase mb-4 border-b border-neutral-900/50 pb-2">
                FILTER BY SIZE
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 text-[9px] font-black tracking-widest uppercase rounded-full border transition cursor-pointer flex items-center justify-center ${
                      selectedSize === sz
                        ? 'bg-brand-red border-brand-red text-white'
                        : 'border-neutral-900 text-neutral-500 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {sz === 'all' ? 'ALL' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section: Color */}
            <div className="bg-neutral-950/20 p-6 rounded-luxury border border-neutral-900/40">
              <h4 className="text-white text-[10px] font-black tracking-widest uppercase mb-4 border-b border-neutral-900/50 pb-2">
                FILTER BY COLOR
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'white', 'black', 'navy', 'green', 'pink', 'blue'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-[9px] font-black tracking-widest uppercase border transition cursor-pointer rounded-full ${
                      selectedColor === color
                        ? 'bg-brand-red border-brand-red text-white'
                        : 'border-neutral-900 text-neutral-500 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section: Price Slider */}
            <div className="bg-neutral-950/20 p-6 rounded-luxury border border-neutral-900/40">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-900/50 pb-2">
                <h4 className="text-white text-[10px] font-black tracking-widest uppercase">
                  MAXIMUM PRICE
                </h4>
                <span className="text-[10px] text-neutral-400 font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="600"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-brand-red bg-neutral-900 cursor-pointer h-1 rounded-none outline-none"
              />
              <div className="flex justify-between text-[8px] text-neutral-600 font-bold mt-2">
                <span>₹200</span>
                <span>₹600</span>
              </div>
            </div>

            {/* Filter Section: Availability */}
            <div className="bg-neutral-950/20 p-6 rounded-luxury border border-neutral-900/40">
              <h4 className="text-white text-[10px] font-black tracking-widest uppercase mb-4 border-b border-neutral-900/50 pb-2">
                STOCK AVAILABILITY
              </h4>
              <div className="space-y-2.5 text-[9px] font-bold tracking-widest uppercase">
                {[
                  { id: 'all', label: 'SHOW ALL' },
                  { id: 'in-stock', label: 'IN STOCK ONLY' },
                  { id: 'low-stock', label: 'LIMITED RUN STOCK' }
                ].map((av) => (
                  <label key={av.id} className="flex items-center gap-2.5 cursor-pointer text-neutral-500 hover:text-white select-none">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === av.id}
                      onChange={() => setSelectedAvailability(av.id)}
                      className="accent-brand-red cursor-pointer"
                    />
                    <span className={selectedAvailability === av.id ? 'text-white' : ''}>{av.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={clearAllFilters}
              className="w-full bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-700 text-neutral-400 hover:text-white text-[10px] font-black tracking-widest py-3 uppercase transition rounded-full flex items-center justify-center gap-2"
            >
              <X size={12} />
              RESET FILTERS
            </button>

          </div>

          {/* Product Grid Column */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-neutral-950 rounded-luxury" />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-24 border border-dashed border-neutral-900 rounded-luxury flex flex-col justify-center items-center gap-4">
                <span className="text-xs font-bold tracking-widest text-neutral-600 uppercase">
                  NO PRODUCTS MATCH YOUR ACTIVE FILTERS
                </span>
                <button
                  onClick={clearAllFilters}
                  className="bg-brand-red hover:bg-red-700 text-white font-black text-[10px] tracking-widest px-6 py-2.5 uppercase transition cursor-pointer rounded-full"
                >
                  CLEAR FILTERS
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}