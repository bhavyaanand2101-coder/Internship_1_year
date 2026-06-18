'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cosostyle_cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('cosostyle_wishlist') || '[]');
        const totalItemsInCart = cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
        setCartCount(totalItemsInCart);
        setWishlistCount(wishlist.length);
      } catch (e) {
        console.error(e);
      }
    };

    updateCounts();

    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    // Also listen to storage events for multi-tab updates
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex flex-shrink-0 items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="CoSoStyle Logo"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-bold text-black">CoSoStyle</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:space-x-8">
          <Link
            href="/"
            className={pathname === '/' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            Home
          </Link>
          <Link
            href="/men"
            className={pathname.startsWith('/men') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            Men
          </Link>
          <Link
            href="/women"
            className={pathname.startsWith('/women') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            Women
          </Link>
          <Link
            href="/new-arrivals"
            className={pathname === '/new-arrivals' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            New Arrivals
          </Link>
          <Link
            href="/collections"
            className={pathname === '/collections' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            Collections
          </Link>
          <Link
            href="/about"
            className={pathname === '/about' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className={pathname === '/contact' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-600 hover:text-gray-900'}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search Toggle/Field */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 flex items-center bg-white border border-gray-300 rounded-full shadow-sm py-1 px-3 z-10 w-44 sm:w-56">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-black bg-transparent focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="text-gray-500 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          <Link href="/wishlist" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 hover:text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.36l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 12l-5.657-5.657z" />
            </svg>
            {/* Wishlist count badge */}
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-medium text-white p-2">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 hover:text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l2.292 6.232A2.916 2.916 0 0010.417 15H15a2 2 0 002 2v2a2 2 0 002 2m-7-4h12a2 2 0 012 2v4.314c0 .58-.33 1.095-.801 1.406a2.007 2.007 0 01-.416 1.12l-.378 1.088a2 2 0 01-2.074 0L9.41 18.25a2 2 0 01-.416-1.12A2.007 2.007 0 017 13.314V11z" />
            </svg>
            {/* Cart count badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-medium text-white p-2">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/account" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 hover:text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01.5-.5h.7a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" />
            </svg>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={pathname === '/' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              Home
            </Link>
            <Link
              href="/men"
              className={pathname.startsWith('/men') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              Men
            </Link>
            <Link
              href="/women"
              className={pathname.startsWith('/women') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              Women
            </Link>
            <Link
              href="/new-arrivals"
              className={pathname === '/new-arrivals' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              New Arrivals
            </Link>
            <Link
              href="/collections"
              className={pathname === '/collections' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className={pathname === '/about' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={pathname === '/contact' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 block px-3 py-2 rounded-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md'}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}