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
      <div className="mb-12 text-center">
        <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">Search Results</h1>
        {query && (
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-2 uppercase tracking-widest">
            Showing results for &quot;<span className="font-semibold text-black dark:text-white">{query}</span>&quot;
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-mono font-medium text-gray-450 dark:text-zinc-500 uppercase tracking-widest animate-pulse">Searching items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-zinc-650 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-3">No Products Found</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed uppercase tracking-wider">
            We couldn&apos;t find any products matching &quot;{query}&quot;. Try adjusting your keywords or search for other classic styles.
          </p>
          <Link
            href="/collections"
            className="inline-block px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none hover:opacity-85 transition-opacity"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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
    <div className="min-h-[calc(100vh-4rem)] py-16 bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white dark:bg-zinc-950">
          <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-mono font-medium text-gray-450 dark:text-zinc-500 uppercase tracking-widest animate-pulse">Loading search...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}