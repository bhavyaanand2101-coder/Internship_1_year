"use client";

import Link from 'next/link';
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

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?sort=newest')
      .then((res) => res.json())
      .then((data) => {
        // Show first 6 newest products
        setNewArrivals(data.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-black text-center">
          New Arrivals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-4 text-center py-12 text-gray-500">
              Loading new arrivals...
            </p>
          ) : (
            newArrivals.map((product) => (
              <Link
                key={product.id}
                href={
                  product.category === 'Footwear' ||
                  product.category === 'Accessories' ||
                  product.category === 'Bags'
                    ? `/unisex/${product.id}`
                    : product.category === 'Dresses' || product.category === 'Sweaters'
                    ? `/women/${product.id}`
                    : `/men/${product.id}`
                }
                className="group"
              >
                <ProductCard product={product} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}