"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CartItem {
  id: number;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Hydrate cart from localStorage and stay in sync with header badge / product pages.
  useEffect(() => {
    const syncCart = () => {
      try {
        const stored = localStorage.getItem('cosostyle_cart');
        setCartItems(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error('Failed to read cart from localStorage', e);
        setCartItems([]);
      } finally {
        setLoaded(true);
      }
    };

    syncCart();
    window.addEventListener('cart-updated', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const persist = (next: CartItem[]) => {
    setCartItems(next);
    localStorage.setItem('cosostyle_cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateTax = () => (calculateSubtotal() - discount) * 0.1;

  const calculateTotal = () => calculateSubtotal() - discount + calculateTax();

  const handleRemoveItem = (cartItemId: string) => {
    persist(cartItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    persist(
      cartItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      const d = calculateSubtotal() * 0.1;
      setDiscount(d);
      setCouponMessage('Promo code SAVE10 applied (10% off).');
    } else {
      setDiscount(0);
      setCouponMessage('Invalid promo code.');
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-16 text-xs font-semibold uppercase tracking-[0.3em] text-center text-zinc-400 dark:text-zinc-500">
          Shopping Bag
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <h2 className="text-base uppercase tracking-widest text-black dark:text-white font-medium">
              Your bag is currently empty
            </h2>
            <p className="text-xs tracking-wider text-gray-500 dark:text-zinc-500 max-w-xs mx-auto">
              Browse our collections and discover pieces designed to last a lifetime.
            </p>
            <div className="pt-4">
              <Link
                href="/men"
                className="inline-block px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors rounded-none"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 divide-y divide-gray-100 dark:divide-zinc-900 border-t border-b border-gray-100 dark:border-zinc-900">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex py-8">
                  <div className="flex-shrink-0 w-24 sm:w-32 aspect-[3/4] relative bg-zinc-50 dark:bg-zinc-900">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 ml-6 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-black dark:text-white">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-gray-500 dark:text-zinc-500">
                        Size: {item.size} &middot; Color: {item.color}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white rounded-none hover:bg-gray-55 dark:hover:bg-zinc-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 12H6" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-mono text-xs text-black dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white rounded-none hover:bg-gray-55 dark:hover:bg-zinc-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12M6 12h12" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-black dark:text-white block">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 block">
                          (${item.price.toFixed(2)} each)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="space-y-8 lg:sticky lg:top-24 bg-zinc-50 dark:bg-zinc-900/40 p-8 transition-colors duration-300 text-black dark:text-white">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-semibold mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700 dark:text-green-500">
                      <span>
                        Discount (SAVE10)
                      </span>
                      <span className="font-semibold">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">
                      Estimated Tax
                    </span>
                    <span className="font-medium">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-zinc-800 text-sm font-semibold">
                    <span>
                      Total
                    </span>
                    <span>
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code Form */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-900 text-xs px-4 py-2 border border-gray-200 dark:border-zinc-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors rounded-none placeholder-gray-400"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors rounded-none"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[10px] tracking-wide uppercase font-semibold ${
                      couponMessage.startsWith('Invalid') ? 'text-red-500' : 'text-green-600 dark:text-green-500'
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center px-6 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors rounded-none block text-center"
                >
                  Proceed to Checkout ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                </Link>
                <Link
                  href="/men"
                  className="w-full flex items-center justify-center px-6 py-4 bg-transparent text-black dark:text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white transition-all rounded-none block text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
