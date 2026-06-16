"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'COS-PENDING';
  
  // Format dynamic delivery date: +3 to +5 days from today
  const deliveryStart = new Date();
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  const deliveryEnd = new Date();
  deliveryEnd.setDate(deliveryEnd.getDate() + 5);
  
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const deliveryStr = `${deliveryStart.toLocaleDateString('en-US', options)} - ${deliveryEnd.toLocaleDateString('en-US', options)}`;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center h-16 w-16 bg-[#D4AF37]/20 rounded-full mb-6 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-black mb-4">
        Order Placed Successfully!
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
      </p>
      <div className="space-x-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/collections"
          className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300"
        >
          Explore Collections
        </Link>
      </div>
      <p className="mt-8 text-sm text-gray-500 bg-gray-50 p-4 rounded border border-gray-200 max-w-sm mx-auto">
        <span className="font-semibold text-black">Order ID:</span> {orderId}<br />
        <span className="font-semibold text-black">Estimated Delivery:</span> {deliveryStr}
      </p>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12">
      <Suspense fallback={
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}