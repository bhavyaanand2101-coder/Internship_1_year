import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              CoSoStyle
            </h3>
            <p className="text-gray-600">
              Luxury fashion for the modern individual. Quality, elegance, and
              confidence in every stitch.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675s-4.128-11.675-11.675-11.675-11.675 4.128-11.675 11.675 4.128 11.675 11.675 11.675zm11.675-16.565c0 .596-.041 1.172-.115 1.732-.185 1.105-.468 2.164-.853 3.142a4.478 4.478 0 00-1.25 2.04l-.008.09a1.49 1.49 0 01-.376.514l-.38.39a1.48 1.48 0 01-1.063.55L9.67 15.11l-.26-.29a1.48 1.48 0 01-.55-1.063l.39-.38a1.49 1.49 0 01.514-.376l.09-.008a4.478 4.478 0 002.04-1.25c.978-.385 2.037-.668 3.142-.853.56-.074 1.136-.115 1.732-.115z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38A6.22 6.22 0 0118.08 6a6.22 6.22 0 01-4.34 4.34A6.22 6.22 0 016.66 11.62a4.3 4.3 0 00-1.81 5.11V16h2.89a4.3 4.3 0 00.87-2.11l3.16-3.16a6.22 6.22 0 01-1.44 2.16A6.22 6.22 0 014.11 18a6.22 6.22 0 01-3.17 1.17A6.22 6.22 0 011 18.08c0 .34.02.68.05 1.02A12.73 12.73 0 003.66 21h12.1a12.73 12.73 0 006.23-3.72c.21-.4.33-.84.39-1.28C23.08 8.3 22.46 6.84 22.46 6z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 2.91c0 1.71-1.39 3.1-3.1 3.1S1.8 4.62 1.8 2.91 3.19-.8 5 .8 8.2.69 8 2.91zm0 8.29c0 1.71-1.39 3.1-3.1 3.1S1.8 11.32 1.8 9.61 3.19 6.51 5 6.5 8.2 5.19 8 6.51zm0 8.29c0 1.71-1.39 3.1-3.1 3.1S1.8 19.62 1.8 17.91 3.19 14.21 5 14.2 8.2 13.19 8 17.91z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/men" className="text-gray-600 hover:text-gray-900 transition-colors">Men</Link></li>
              <li><Link href="/women" className="text-gray-600 hover:text-gray-900 transition-colors">Women</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-600 hover:text-gray-900 transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections" className="text-gray-600 hover:text-gray-900 transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link href="/account" className="text-gray-600 hover:text-gray-900 transition-colors">Account</Link></li>
              <li><Link href="/cart" className="text-gray-600 hover:text-gray-900 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Stay Updated</h4>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CoSoStyle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}