"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  tracking: string;
}

const mockOrders: Order[] = [
  {
    id: "20231105-001",
    date: "November 5, 2023",
    status: "Processing",
    total: 697.40,
    items: [
      { name: "Linen Blazer", quantity: 1, price: 238.00 },
      { name: "Little Black Dress", quantity: 2, price: 198.00 }
    ],
    tracking: "Pending"
  },
  {
    id: "20231015-092",
    date: "October 15, 2023",
    status: "Delivered",
    total: 338.00,
    items: [
      { name: "Cashmere Sweater", quantity: 1, price: 338.00 }
    ],
    tracking: "1Z999AA10123456784"
  }
];

interface CheckoutOrder {
  id: string;
  date: string;
  status: string;
  totals?: { total: number };
  total?: number;
  items: OrderItem[];
  tracking: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/checkout')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((order: CheckoutOrder) => ({
            id: order.id,
            date: order.date,
            status: order.status,
            total: order.totals ? order.totals.total : order.total,
            items: order.items,
            tracking: order.tracking
          }));
          // Merge actual orders on top of mock orders so the user sees both
          setOrders([...mapped, ...mockOrders]);
        } else {
          setOrders(mockOrders);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOrders(mockOrders);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Order History</h1>
          <Link href="/account" className="text-sm font-semibold text-[#D4AF37] hover:text-[#b8860b] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Account Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Order ID</p>
                  <p className="text-sm font-bold text-black">#{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Date Placed</p>
                  <p className="text-sm text-gray-700">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    order.status === 'Processing' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Total Amount</p>
                  <p className="text-sm font-bold text-black">${order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size || item.color ? ` • Size: ${item.size || 'M'} • Color: ${item.color || 'Default'}` : ''}</p>
                    </div>
                    <p className="font-medium text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Footer details */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-sm gap-4">
                <div>
                  <span className="font-medium text-gray-500 mr-2">Tracking Number:</span>
                  <span className="font-mono text-gray-800">{order.tracking}</span>
                </div>
                <div>
                  <button className="text-sm font-semibold text-[#D4AF37] hover:text-[#b8860b]">
                    Need Help with this Order?
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
