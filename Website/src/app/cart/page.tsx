"use client";

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Cart() {
  // Mock cart items - in real app, this would come from state management (Zustand)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Linen Blazer',
      price: 238,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      quantity: 1,
      size: 'M',
      color: 'Beige',
    },
    {
      id: 102,
      name: 'Little Black Dress',
      price: 198,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      quantity: 2,
      size: 'M',
      color: 'Black',
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    // Simple discount logic for demo
    if (couponCode === 'SAVE10') {
      return calculateSubtotal() * 0.1;
    }
    return 0;
  };

  const calculateTax = () => {
    // Assuming 10% tax
    return (calculateSubtotal() - discount) * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discount + calculateTax();
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleApplyCoupon = () => {
    setDiscount(calculateDiscount());
  };

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
          <>
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-black">
                Cart Items
              </h2>
            </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex py-6">
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
                        <h3 className="text-lg font-semibold text-black">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-baseline mb-2">
                        <span className="mr-2 text-sm font-medium text-gray-500">
                          Size: {item.size}
                        </span>
                        <span className="mr-2 text-sm font-medium text-gray-500">
                          Color: {item.color}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-3 3m0 0l-3-3m3 3V6h6v3z" />
                          </svg>
                        </button>
                        <span className="w-10 text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15l3-3m0 0l3 3m-3-3h3v4H9z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-baseline mt-2">
                        <span className="font-bold text-black text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cart Summary */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <h2 className="mb-2 text-xl font-semibold text-black">
                      Cart Summary
                    </h2>
                    <p className="text-sm text-gray-600">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
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
                      <div className="flex justify-between">
                        <span className="text-lg font-medium text-gray-600">
                          Discount (SAVE10)
                        </span>
                        <span className="text-lg font-bold text-black">
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
                    <div className="mb-4">
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
                    </div>
                    <Link
                      href="/checkout"
                      className="w-full flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                    >
                      Proceed to Checkout ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  );
}