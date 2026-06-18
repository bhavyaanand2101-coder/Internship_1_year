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

export default function Men() {
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
    fetch('/api/products?gender=men')
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
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 lg:pr-8 lg:mb-8 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === 'all'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">All</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="blazers"
                    checked={filters.category === 'blazers'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Blazers</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="shirts"
                    checked={filters.category === 'shirts'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Shirts</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="sweaters"
                    checked={filters.category === 'sweaters'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Sweaters</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="coats"
                    checked={filters.category === 'coats'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Coats</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="jackets"
                    checked={filters.category === 'jackets'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Jackets</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="trousers"
                    checked={filters.category === 'trousers'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Trousers</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Size</h3>
              <div className="space-y-2">
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="size"
                    value="all"
                    checked={filters.size === 'all'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, size: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">All</span>
                </label>
                {[...new Set(products.flatMap((p) => p.sizes))].map((size) => (
                  <label key={size} className="flex items-center p-2 rounded-hover bg-gray-50">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={filters.size === size}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, size: e.target.value }))
                      }
                      className="h-4 w-4 text-[#D4AF37]"
                    />
                    <span className="ml-3 text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Color</h3>
              <div className="space-y-2">
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="color"
                    value="all"
                    checked={filters.color === 'all'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">All</span>
                </label>
                {[...new Set(products.flatMap((p) => p.colors))].map((color) => (
                  <label key={color} className="flex items-center p-2 rounded-hover bg-gray-50">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={filters.color === color}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, color: e.target.value }))
                      }
                      className="h-4 w-4 text-[#D4AF37]"
                    />
                    <span className="ml-3 flex items-center">
                      <span
                        className="w-3 h-3 mr-2 rounded"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === 'white'
                              ? '#f0f0f0'
                              : color.toLowerCase() === 'black'
                              ? '#000000'
                              : color.toLowerCase() === 'navy'
                              ? '#000080'
                              : color.toLowerCase() === 'gray'
                              ? '#808080'
                              : color.toLowerCase() === 'beige'
                              ? '#f5f5dc'
                              : color.toLowerCase() === 'brown'
                              ? '#a52a2a'
                              : color.toLowerCase() === 'charcoal'
                              ? '#36454f'
                              : '#808080',
                        }}
                      />
                      <span className="text-sm">{color}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Price</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-1/2">Min</span>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [Number(e.target.value), prev.priceRange[1]],
                      }))
                    }
                    className="w-1/2 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-1/2">Max</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], Number(e.target.value)],
                      }))
                    }
                    className="w-1/2 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Availability</h3>
              <div className="space-y-2">
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="availability"
                    value="all"
                    checked={filters.availability === 'all'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, availability: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">All</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="availability"
                    value="inStock"
                    checked={filters.availability === 'inStock'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, availability: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">In Stock</span>
                </label>
                <label className="flex items-center p-2 rounded-hover bg-gray-50">
                  <input
                    type="radio"
                    name="availability"
                    value="outOfStock"
                    checked={filters.availability === 'outOfStock'}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, availability: e.target.value }))
                    }
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <span className="ml-3 text-sm">Out of Stock</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="lg:flex-1 w-full">
          <div className="flex flex-col lg:flex-row-reverse lg:space-x-8">
            {/* Sorting */}
            <div className="lg:w-64 lg:mb-8 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus-ring-[#D4AF37]"
                >
                  <option value="popularity">Popularity</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <p className="text-sm text-gray-500">
                Showing {sortedProducts.length} products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="col-span-3 text-center py-12 text-gray-500">
                  Loading premium collection...
                </p>
              ) : (
                sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
              {!loading && sortedProducts.length === 0 && (
                <p className="col-span-3 text-center py-12 text-gray-500">
                  No products match your filters.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}