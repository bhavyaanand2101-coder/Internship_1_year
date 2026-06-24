'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Header Navigation Component.
 * Implements sticky positioning, light/dark theme toggles, dynamic search overlay forms, 
 * real-time badge count updating for cart/wishlist items via custom window events, and responsive mobile nav toggle sheets.
 */
export default function Header() {
  const pathname = usePathname(); // Retrieves current active route path
  const router = useRouter(); // Router handler for trigger redirects
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle drawer state
  const [cartCount, setCartCount] = useState(0); // Cart quantity badge count
  const [wishlistCount, setWishlistCount] = useState(0); // Wishlist items count
  const [searchOpen, setSearchOpen] = useState(false); // Controls search textfield expand overlay
  const [searchQuery, setSearchQuery] = useState(''); // Text value in search field
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Theme selection indicator

  // Synchronize site theme styling (using Tailwind dark: class selectors) with localStorage values on load
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('cosostyle_theme') || 'light';
      Promise.resolve().then(() => {
        setTheme(savedTheme as 'light' | 'dark');
      });
      // Toggle dark styling class at document document root
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Switches theme selection state and writes choice to localStorage persistence cache
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('cosostyle_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Triggers search routing query to `/search?q=query`
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false); // Reset search popup
      setSearchQuery('');
    }
  };

  // Listens to global events to sync item counts instantly across components
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cosostyle_cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('cosostyle_wishlist') || '[]');
        
        // Sum total quantities of items logged in the cart
        const totalItemsInCart = cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
        setCartCount(totalItemsInCart);
        setWishlistCount(wishlist.length);
      } catch (e) {
        console.error(e);
      }
    };

    updateCounts(); // Run initial counts generation on mount

    // Listeners reacting to cart/wishlist state changes across sibling card triggers
    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    // React to storage changes made in alternate tab panes
    window.addEventListener('storage', updateCounts);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        
        {/* Branding Logo Block */}
        <div className="flex flex-shrink-0 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="CoSoStyle Logo"
              width={26}
              height={26}
              priority
              className="dark:invert transition-all duration-300"
            />
            <span className="text-base font-semibold tracking-widest text-black dark:text-white uppercase transition-colors duration-300">CoSoStyle</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          <Link
            href="/"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname === '/' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/men"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname.startsWith('/men') ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Men
          </Link>
          <Link
            href="/women"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname.startsWith('/women') ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Women
          </Link>
          <Link
            href="/new-arrivals"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname === '/new-arrivals' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            New Arrivals
          </Link>
          <Link
            href="/collections"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname === '/collections' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Collections
          </Link>
          <Link
            href="/about"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname === '/about' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              pathname === '/contact' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Global Toolbar items (Search, Wishlist, Cart, Theme Toggler, Account, Mobile Menu) */}
        <div className="flex items-center space-x-5">
          
          {/* Expanded Search Form overlay when toggled */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 flex items-center bg-gray-50 dark:bg-zinc-900 rounded-full py-1 px-3.5 z-10 w-44 sm:w-56 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[11px] text-black dark:text-white bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                  autoFocus
                />
                <button type="submit" className="text-gray-400 hover:text-black dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Wishlist Link & Counter badge */}
          <Link href="/wishlist" className="relative p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.36l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 12l-5.657-5.657z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black dark:bg-white text-[9px] font-bold text-white dark:text-black shadow-sm transition-colors duration-300">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link & Counter badge */}
          <Link href="/cart" className="relative p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black dark:bg-white text-[9px] font-bold text-white dark:text-black shadow-sm transition-colors duration-300">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Theme Toggler trigger */}
          <button
            onClick={toggleTheme}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          {/* User Account profile Link */}
          <Link href="/account" className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </Link>

          {/* Mobile responsive toggle trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile responsive slide-down menu sheet */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6 border-t border-gray-100 dark:border-zinc-900">
            <Link
              href="/"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname === '/' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/men"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname.startsWith('/men') ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Men
            </Link>
            <Link
              href="/women"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname.startsWith('/women') ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Women
            </Link>
            <Link
              href="/new-arrivals"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname === '/new-arrivals' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/collections"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname === '/collections' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname === '/about' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block py-3 text-[11px] uppercase tracking-[0.2em] ${
                pathname === '/contact' ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}