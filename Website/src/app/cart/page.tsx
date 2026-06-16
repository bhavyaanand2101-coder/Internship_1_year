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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-black text-center">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-black mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to your cart to get started.
            </p>
            <Link
              href="/men"
              className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex py-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={150}
                      className="object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex-1 ml-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-black">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} &middot; Color: {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        className="text-gray-500 hover:text-gray-900"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded border border-gray-300"
                        aria-label="Decrease quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded border border-gray-300"
                        aria-label="Increase quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-baseline mt-2">
                      <span className="font-bold text-black text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        (${item.price.toFixed(2)} each)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 h-fit lg:sticky lg:top-20">
              <h2 className="mb-4 text-xl font-semibold text-black">
                Cart Summary
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-600">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-black">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span className="text-lg font-medium">
                      Discount (SAVE10)
                    </span>
                    <span className="text-lg font-bold">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-600">
                    Tax (10%)
                  </span>
                  <span className="text-lg font-bold text-black">
                    ${calculateTax().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-300">
                  <span className="text-2xl font-bold text-black">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-black">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`mt-2 text-xs ${
                      couponMessage.startsWith('Invalid') ? 'text-red-600' : 'text-green-700'
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>
              <Link
                href="/checkout"
                className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Link>
              <Link
                href="/men"
                className="mt-3 w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
