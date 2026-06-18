"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  image: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  gender?: string;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!!query);
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setLoading(!!query);
    if (!query) {
      setProducts([]);
    }
  }

  useEffect(() => {
    if (!query) return;

    fetch(`/api/products?search=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-black">Search Results</h1>
        {query && (
          <p className="text-sm text-gray-500 mt-2">
            Showing results for &quot;<span className="font-semibold text-black">{query}</span>&quot;
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">Searching premium items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md mx-auto mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-bold text-black mb-2">No Products Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find any products matching &quot;{query}&quot;. Try adjusting your keywords or search for other classic styles.
          </p>
          <Link
            href="/collections"
            className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">Loading search...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}