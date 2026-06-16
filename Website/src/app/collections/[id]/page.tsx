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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">
            Loading premium collection...
          </p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-black mb-4">Collection Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn&apos;t find that specific collection. Explore our other featured seasonal lines instead!</p>
            <Link href="/collections" className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200">
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Banner */}
      <section className="relative h-[40vh] bg-gray-900 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-40 animate-fade-in"
            priority
          />
        </div>
        <div className="relative z-10 max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl mb-4 tracking-tight">
            {collection.name}
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto font-light">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Product List */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-black">Collection Items</h2>
            <Link href="/collections" className="text-sm font-semibold text-[#D4AF37] hover:text-[#b8860b] flex items-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Collections
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collection.products.map((product) => (
              <Link
                key={product.id}
                href={product.gender === 'women' ? `/women/${product.id}` : product.gender === 'men' ? `/men/${product.id}` : `/unisex/${product.id}`}
                className="group"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

