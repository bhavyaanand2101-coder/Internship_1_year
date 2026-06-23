"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export default function Women() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: 'all',
    size: 'all',
    color: 'all',
    priceRange: [0, 1000],
    availability: 'all',
  });
  const [sort, setSort] = useState('popularity');

  useEffect(() => {
    fetch('/api/products?gender=women')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter products based on filters state (simplified for demo)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filters.category === 'all' || product.category.toLowerCase() === filters.category;
    const matchesColor =
      filters.color === 'all' ||
      product.colors.some((c) => c.toLowerCase() === filters.color.toLowerCase());
    const matchesSize =
      filters.size === 'all' ||
      product.sizes.some((s) => s.toLowerCase() === filters.size.toLowerCase());
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesAvailability =
      filters.availability === 'all' ||
      (filters.availability === 'inStock' && product.inStock) ||
      (filters.availability === 'outOfStock' && !product.inStock);
    return matchesCategory && matchesColor && matchesSize && matchesPrice && matchesAvailability;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'priceLowHigh') return a.price - b.price;
    if (sort === 'priceHighLow') return b.price - a.price;
    if (sort === 'newest') return b.id - a.id; // assuming higher id is newer
    // popularity: default order (as is)
    return 0;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 shrink-0 lg:mb-8 mb-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">Category</h3>
              <div className="space-y-2">
                {['all', 'dresses', 'sweaters', 'blazers', 'jackets', 'trousers', 'accessories'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                    className={`block w-full text-left py-1 text-xs uppercase tracking-wider transition-colors ${
                      filters.category === cat
                        ? 'font-semibold text-black dark:text-white underline underline-offset-4'
                        : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">Size</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, size: 'all' }))}
                  className={`px-3 py-1.5 border text-[10px] font-medium uppercase tracking-wider transition-all rounded-none ${
                    filters.size === 'all'
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'bg-transparent text-gray-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  All
                </button>
                {[...new Set(products.flatMap((p) => p.sizes))].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFilters((prev) => ({ ...prev, size: size }))}
                    className={`px-3 py-1.5 border text-[10px] font-medium uppercase tracking-wider transition-all rounded-none ${
                      filters.size === size
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'bg-transparent text-gray-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">Color</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, color: 'all' }))}
                  className={`block w-full text-left py-1 text-xs uppercase tracking-wider transition-colors ${
                    filters.color === 'all'
                      ? 'font-semibold text-black dark:text-white underline underline-offset-4'
                      : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                {[...new Set(products.flatMap((p) => p.colors))].map((color) => (
                  <button
                    key={color}
                    onClick={() => setFilters((prev) => ({ ...prev, color: color }))}
                    className={`flex items-center w-full text-left py-1 text-xs uppercase tracking-wider transition-colors ${
                      filters.color === color
                        ? 'font-semibold text-black dark:text-white'
                        : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 mr-2 rounded-full border border-zinc-200 dark:border-zinc-800"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === 'white' ? '#f8f8f8' :
                          color.toLowerCase() === 'black' ? '#000000' :
                          color.toLowerCase() === 'navy' ? '#000080' :
                          color.toLowerCase() === 'gray' ? '#808080' :
                          color.toLowerCase() === 'beige' ? '#f5f5dc' :
                          color.toLowerCase() === 'brown' ? '#a52a2a' :
                          color.toLowerCase() === 'charcoal' ? '#36454f' :
                          '#808080'
                      }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">Price</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [Number(e.target.value), prev.priceRange[1]],
                    }))
                  }
                  className="w-1/2 px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                  min="0"
                />
                <span className="text-gray-400 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1] || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], Number(e.target.value)],
                    }))
                  }
                  className="w-1/2 px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                  min="0"
                />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">Availability</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'inStock', label: 'In Stock' },
                  { value: 'outOfStock', label: 'Out of Stock' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters((prev) => ({ ...prev, availability: option.value }))}
                    className={`block w-full text-left py-1 text-xs uppercase tracking-wider transition-colors ${
                      filters.availability === option.value
                        ? 'font-semibold text-black dark:text-white underline underline-offset-4'
                        : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-zinc-150 dark:border-zinc-900 gap-4">
            <div>
              <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">
                Women&apos;s Collection
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">
                Showing {sortedProducts.length} items
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-450 dark:text-zinc-400">Sort By</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none uppercase tracking-widest text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
              >
                <option value="popularity" className="bg-white dark:bg-zinc-950">Popularity</option>
                <option value="priceLowHigh" className="bg-white dark:bg-zinc-950">Price: Low to High</option>
                <option value="priceHighLow" className="bg-white dark:bg-zinc-950">Price: High to Low</option>
                <option value="newest" className="bg-white dark:bg-zinc-950">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {loading ? (
              <p className="col-span-3 text-center py-24 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-zinc-500 animate-pulse">
                Loading collection...
              </p>
            ) : (
              sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
            {!loading && sortedProducts.length === 0 && (
              <p className="col-span-3 text-center py-24 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                No products match your filters.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}