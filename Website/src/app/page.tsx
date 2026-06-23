"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';

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

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  productIds?: number[];
}

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch collections');
        return res.json();
      })
      .then((data) => {
        setCollections(data);
        setLoadingCollections(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingCollections(false);
      });

    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Slice products for trending now and best sellers
          setTrendingProducts(data.slice(0, 4));
          setBestSellers(data.slice(4, 7));
        }
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProducts(false);
      });
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/55 transition-colors duration-300"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="mb-4 text-4xl sm:text-6xl tracking-[0.2em] font-extralight uppercase">
            CoSoStyle
          </h1>
          <p className="mb-8 max-w-xl mx-auto text-xs sm:text-sm tracking-[0.25em] uppercase font-light text-gray-200">
            Redefining modern luxury. Minimalist silhouettes, timeless designs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/men"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-black hover:text-white border border-white hover:border-black transition-all duration-300 rounded-none"
            >
              Shop Men
            </Link>
            <Link
              href="/women"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-white hover:text-black border border-white transition-all duration-300 rounded-none"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.3em] text-center text-zinc-400 dark:text-zinc-500">
            Featured Collections
          </h2>
          {loadingCollections ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.slice(0, 3).map((collection) => (
                <Link 
                  key={collection.id} 
                  href={`/collections/${collection.id}`}
                  className="group flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover w-full transition-transform duration-[800ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-300"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-sm font-semibold tracking-widest uppercase mb-1">{collection.name}</h3>
                      <p className="text-[10px] tracking-wider text-gray-200 line-clamp-1">{collection.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.3em] text-center text-zinc-400 dark:text-zinc-500">
            Trending Now
          </h2>
          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.3em] text-center text-zinc-400 dark:text-zinc-500">
            Best Sellers
          </h2>
          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-xs font-semibold uppercase tracking-[0.3em] text-center text-zinc-400 dark:text-zinc-500">
            Customer Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Testimonial 1 */}
            <div className="flex flex-col justify-between text-center space-y-4">
              <p className="text-xs sm:text-sm tracking-wider leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
                &quot;The quality is exceptional. Every piece feels luxurious and well-made. I&apos;ve received so many compliments on my CoSoStyle outfits.&quot;
              </p>
              <div className="flex flex-col items-center">
                <h3 className="text-[11px] uppercase tracking-widest font-semibold text-zinc-800 dark:text-zinc-200">Alexandra Chen</h3>
                <p className="text-[9px] uppercase tracking-widest text-zinc-400">Verified Buyer</p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="flex flex-col justify-between text-center space-y-4">
              <p className="text-xs sm:text-sm tracking-wider leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
                &quot;The attention to detail is incredible. From the stitching to the fabric, everything exudes luxury. Worth every penny.&quot;
              </p>
              <div className="flex flex-col items-center">
                <h3 className="text-[11px] uppercase tracking-widest font-semibold text-zinc-800 dark:text-zinc-200">Michael Torres</h3>
                <p className="text-[9px] uppercase tracking-widest text-zinc-400">Verified Buyer</p>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="flex flex-col justify-between text-center space-y-4">
              <p className="text-xs sm:text-sm tracking-wider leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
                &quot;CoSoStyle has become my go-to for special occasions. The designs are timeless yet modern, and the fit is always perfect.&quot;
              </p>
              <div className="flex flex-col items-center">
                <h3 className="text-[11px] uppercase tracking-widest font-semibold text-zinc-800 dark:text-zinc-200">Sophie Laurent</h3>
                <p className="text-[9px] uppercase tracking-widest text-zinc-400">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-400 dark:text-zinc-500 block">Behind the Brand</span>
              <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-black dark:text-white">Our Story</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light font-sans">
                Founded in 2020, CoSoStyle began with a simple vision: to create luxury fashion that&apos;s accessible without compromising on quality. We believe that true style is timeless, and every garment should tell a story of craftsmanship and confidence.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light font-sans">
                From our sustainably sourced materials to our ethical manufacturing processes, we&apos;re committed to creating fashion that not only looks good but does good. Each collection is designed with the modern individual in mind—someone who values elegance, quality, and sustainability.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-block px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100 transition-colors rounded-none"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="Brand Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/40 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Stay in Style</h2>
          <h3 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-black dark:text-white">Join the Newsletter</h3>
          <p className="max-w-lg mx-auto text-xs text-gray-500 dark:text-gray-400 leading-relaxed tracking-wider">
            Subscribe to our newsletter for exclusive access to new collections, early sales, and styling tips.
          </p>
          <form className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center pt-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-80 px-4 py-3 bg-white dark:bg-zinc-900 text-xs border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors rounded-none"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] tracking-wider uppercase text-gray-400 dark:text-zinc-500 pt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.3em] text-center text-zinc-400 dark:text-zinc-500">
            From Our Instagram
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Instagram Image 1 */}
            <div className="overflow-hidden aspect-square relative bg-zinc-100 dark:bg-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 1"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
            </div>
            {/* Instagram Image 2 */}
            <div className="overflow-hidden aspect-square relative bg-zinc-100 dark:bg-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 2"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
            </div>
            {/* Instagram Image 3 */}
            <div className="overflow-hidden aspect-square relative bg-zinc-100 dark:bg-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 3"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
            </div>
            {/* Instagram Image 4 */}
            <div className="overflow-hidden aspect-square relative bg-zinc-100 dark:bg-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 4"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
            </div>
            {/* Instagram Image 5 */}
            <div className="overflow-hidden aspect-square relative bg-zinc-100 dark:bg-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 5"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
            </div>
            {/* Instagram Image 6 */}
            <div className="overflow-hidden aspect-square relative bg-zinc-100 dark:bg-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 6"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}