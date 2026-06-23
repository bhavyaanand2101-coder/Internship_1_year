"use client";

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';

import { use, useEffect, useState } from 'react';

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
  gender: string;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

export default function CollectionDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const collectionId = parseInt(resolvedParams.id, 10);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prevId, setPrevId] = useState(collectionId);
  if (collectionId !== prevId) {
    setPrevId(collectionId);
    setLoading(true);
    setCollection(null);
  }

  useEffect(() => {
    fetch(`/api/collections/${collectionId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Collection not found');
        }
        return res.json();
      })
      .then((data) => {
        setCollection(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to fetch collection');
        setLoading(false);
      });
  }, [collectionId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-mono font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse">
            Loading collection...
          </p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-16 bg-white dark:bg-zinc-950 text-black dark:text-white flex items-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white mb-4">Collection Not Found</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed uppercase tracking-wider">We couldn&apos;t find that specific collection. Explore our other seasonal lines.</p>
          <Link href="/collections" className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest hover:opacity-85 transition-opacity">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-zinc-950 text-black dark:text-white">
      {/* Hero Banner */}
      <section className="relative h-[45vh] bg-zinc-950 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-35 animate-fade-in"
            priority
          />
        </div>
        <div className="relative z-10 max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest mb-4">
            {collection.name}
          </h1>
          <p className="text-xs text-gray-300 max-w-xl mx-auto font-light uppercase tracking-widest leading-relaxed">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Product List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-zinc-150 dark:border-zinc-900 pb-6">
            <div>
              <h2 className="text-lg font-light uppercase tracking-widest text-black dark:text-white">Collection Items</h2>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">{collection.products.length} items</p>
            </div>
            <Link href="/collections" className="text-[10px] font-semibold tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-75 transition-opacity flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Collections
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

