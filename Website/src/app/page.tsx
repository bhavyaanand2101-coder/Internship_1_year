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
      <section className="relative min-h-[80vh] bg-gray-50 overflow-hidden">
        <div className="absolute inset-0">
          {/* Placeholder for background image/video */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
            CoSoStyle
          </h1>
          <p className="mb-6 max-w-xl text-lg text-gray-600">
            Luxury fashion redefined. Discover timeless elegance and modern sophistication.
          </p>
          <div className="space-x-4">
            <Link
              href="/men"
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Shop Men
            </Link>
            <Link
              href="/women"
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            Featured Collections
          </h2>
          {loadingCollections ? (
            <p className="text-center py-12 text-gray-500">Loading premium collections...</p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-250">
              {collections.map((collection) => (
                <div key={collection.id} className="flex-shrink-0 w-[240px]">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col justify-between">
                    <div>
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        width={200}
                        height={260}
                        className="rounded object-cover h-[260px] w-full"
                      />
                      <h3 className="mt-4 text-lg font-semibold text-black">{collection.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{collection.description}</p>
                    </div>
                    <Link
                      href={`/collections/${collection.id}`}
                      className="mt-4 inline-flex items-center justify-center w-full px-3 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded hover:bg-gray-250 transition-colors"
                    >
                      View Collection
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            Trending Now
          </h2>
          {loadingProducts ? (
            <p className="text-center py-12 text-gray-500">Loading premium collection...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            Best Sellers
          </h2>
          {loadingProducts ? (
            <p className="text-center py-12 text-gray-500">Loading premium collection...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            What Our Customers Say
          </h2>
          <div className="grid gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-4 text-lg italic text-gray-700">
                &quot;The quality is exceptional. Every piece feels luxurious and well-made. I&apos;ve received so many compliments on my CoSoStyle outfits.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                  alt="Customer 1"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium text-black">Alexandra Chen</h3>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-4 text-lg italic text-gray-700">
                &quot;The attention to detail is incredible. From the stitching to the fabric, everything exudes luxury. Worth every penny.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                  alt="Customer 2"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium text-black">Michael Torres</h3>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-4 text-lg italic text-gray-700">
                &quot;CoSoStyle has become my go-to for special occasions. The designs are timeless yet modern, and the fit is always perfect.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802bcb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                  alt="Customer 3"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium text-black">Sophie Laurent</h3>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-black">Our Story</h2>
              <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                Founded in 2020, CoSoStyle began with a simple vision: to create luxury fashion that&apos;s accessible without compromising on quality. We believe that true style is timeless, and every garment should tell a story of craftsmanship and confidence.
              </p>
              <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                From our sustainably sourced materials to our ethical manufacturing processes, we&apos;re committed to creating fashion that not only looks good but does good. Each collection is designed with the modern individual in mind—someone who values elegance, quality, and sustainability.
              </p>
              <Link
                href="/about"
                className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
              >
                Learn More
              </Link>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Brand Story"
                width={500}
                height={500}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
                <p className="font-medium">Crafted with Passion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold text-black">Stay in Style</h2>
          <p className="mb-8 text-lg text-gray-600">
            Subscribe to our newsletter for exclusive access to new collections, early sales, and styling tips.
          </p>
          <form className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] sm:w-1/2"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            From Our Instagram
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Instagram Image 1 */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 1"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            {/* Instagram Image 2 */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1515378791036-1-5473257598?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 2"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            {/* Instagram Image 3 */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1520975916091-11292d6b3d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 3"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            {/* Instagram Image 4 */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 4"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            {/* Instagram Image 5 */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 5"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            {/* Instagram Image 6 */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                alt="Instagram 6"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}