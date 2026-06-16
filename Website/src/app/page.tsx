"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
          <div className="overflow-x-auto space-x-4">
            <div className="inline-flex min-w-[200px]">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1520975916091-11292d6b3d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Summer Collection"
                  width={200}
                  height={260}
                  className="rounded"
                />
                <h3 className="mt-4 text-lg font-semibold text-black">Summer 2024</h3>
                <p className="text-sm text-gray-500 mt-1">Lightweight fabrics • Vibrant colors</p>
                <Link
                  href="/collections"
                  className="mt-3 inline-flex items-center px-3 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded hover:bg-gray-200"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="inline-flex min-w-[200px] ml-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Winter Collection"
                  width={200}
                  height={260}
                  className="rounded"
                />
                <h3 className="mt-4 text-lg font-semibold text-black">Winter 2024</h3>
                <p className="text-sm text-gray-500 mt-1">Luxurious wool • Cashmere blends</p>
                <Link
                  href="/collections"
                  className="mt-3 inline-flex items-center px-3 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded hover:bg-gray-200"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="inline-flex min-w-[200px] ml-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Evening Wear"
                  width={200}
                  height={260}
                  className="rounded"
                />
                <h3 className="mt-4 text-lg font-semibold text-black">Evening Wear</h3>
                <p className="text-sm text-gray-500 mt-1">Silk gowns • Tailored tuxedos</p>
                <Link
                  href="/collections"
                  className="mt-3 inline-flex items-center px-3 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded hover:bg-gray-200"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            Trending Now
          </h2>
          <div className="space-y-6">
            {/* Carousel placeholder - in real implementation, use Swiper or similar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product Card 1 */}
              <div className="group">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Trending Product"
                    width={300}
                    height={400}
                    className="rounded"
                  />
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
                    -20%
                  </span>
                  <button
                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 flex items-center justify-center px-4 py-2 bg-black/70 text-white transition-opacity"
                    onClick={() => {}}
                  >
                    Quick View
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Linen Blazer</h3>
                  <p className="mt-1 text-gray-500 line-through">$298.00</p>
                  <p className="mt-1 font-medium text-black">$238.00</p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0l4.418 4.418A11.944 11.944 0 0012 21c5.522 0 10-4.478 10-10S17.522 4 12 4zm0-2h7a2 2 0 012 2v5h-.586m0 0L12.586 9.414a2 2 0 00-2.828 0L5.414 12H2a2 2 0 01-2-2V6a2 2 0 012-2h7z" />
                      </svg>
                      Wishlist
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
              {/* Product Card 2 */}
              <div className="group">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1583743814966-893c56b7fa16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Trending Product"
                    width={300}
                    height={400}
                    className="rounded"
                  />
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
                    New
                  </span>
                  <button
                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 flex items-center justify-center px-4 py-2 bg-black/70 text-white transition-opacity"
                    onClick={() => {}}
                  >
                    Quick View
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Silk Slip Dress</h3>
                  <p className="mt-1 text-gray-500">$198.00</p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0l4.418 4.418A11.944 11.944 0 0012 21c5.522 0 10-4.478 10-10S17.522 4 12 4zm0-2h7a2 2 0 012 2v5h-.586m0 0L12.586 9.414a2 2 0 00-2.828 0L5.414 12H2a2 2 0 01-2-2V6a2 2 0 012-2h7z" />
                      </svg>
                      Wishlist
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
              {/* Product Card 3 */}
              <div className="group">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1551041110-8a3f87411f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Trending Product"
                    width={300}
                    height={400}
                    className="rounded"
                  />
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
                    -15%
                  </span>
                  <button
                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 flex items-center justify-center px-4 py-2 bg-black/70 text-white transition-opacity"
                    onClick={() => {}}
                  >
                    Quick View
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Cashmere Sweater</h3>
                  <p className="mt-1 text-gray-500 line-through">$398.00</p>
                  <p className="mt-1 font-medium text-black">$338.00</p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0l4.418 4.418A11.944 11.944 0 0012 21c5.522 0 10-4.478 10-10S17.522 4 12 4zm0-2h7a2 2 0 012 2v5h-.586m0 0L12.586 9.414a2 2 0 00-2.828 0L5.414 12H2a2 2 0 01-2-2V6a2 2 0 012-2h7z" />
                      </svg>
                      Wishlist
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
              {/* Product Card 4 */}
              <div className="group">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1542291026-7yec2d6c2c3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Trending Product"
                    width={300}
                    height={400}
                    className="rounded"
                  />
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
                    -10%
                  </span>
                  <button
                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 flex items-center justify-center px-4 py-2 bg-black/70 text-white transition-opacity"
                    onClick={() => {}}
                  >
                    Quick View
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Tailored Wool Coat</h3>
                  <p className="mt-1 text-gray-500 line-through">$598.00</p>
                  <p className="mt-1 font-medium text-black">$538.00</p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0l4.418 4.418A11.944 11.944 0 0012 21c5.522 0 10-4.478 10-10S17.522 4 12 4zm0-2h7a2 2 0 012 2v5h-.586m0 0L12.586 9.414a2 2 0 00-2.828 0L5.414 12H2a2 2 0 01-2-2V6a2 2 0 012-2h7z" />
                      </svg>
                      Wishlist
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-black text-center">
            Best Sellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Best Seller Card 1 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1595777460388-5b0a6d3e5b3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Best Seller"
                width={400}
                height={500}
                className="object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-black">Classic White Shirt</h3>
                <p className="mt-2 text-sm text-gray-500">Timeless staple</p>
                <p className="mt-4 font-medium text-black">$98.00</p>
                <Link
                  href="/men"
                  className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            {/* Best Seller Card 2 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Best Seller"
                width={400}
                height={500}
                className="object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-black">Little Black Dress</h3>
                <p className="mt-2 text-sm text-gray-500">Essential evening wear</p>
                <p className="mt-4 font-medium text-black">$198.00</p>
                <Link
                  href="/women"
                  className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            {/* Best Seller Card 3 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1581091852973-4657cb591151?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Best Seller"
                width={400}
                height={500}
                className="object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-black">Leather Biker Jacket</h3>
                <p className="mt-2 text-sm text-gray-500">Premium lambskin</p>
                <p className="mt-4 font-medium text-black">$398.00</p>
                <Link
                  href="/men"
                  className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
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