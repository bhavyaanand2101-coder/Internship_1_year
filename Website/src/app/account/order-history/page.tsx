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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-mono font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 text-black dark:text-white bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-150 dark:border-zinc-900 pb-6">
          <div>
            <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">Order History</h1>
            <p className="text-[10px] text-gray-450 dark:text-zinc-500 mt-1 uppercase tracking-widest">
              Review your purchase invoices
            </p>
          </div>
          <Link href="/account" className="text-[10px] font-semibold tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-75 transition-opacity flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-zinc-200 dark:border-zinc-800 p-8 rounded-none bg-transparent hover:border-black dark:hover:border-white transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-between border-b border-zinc-150 dark:border-zinc-900 pb-6 mb-6 gap-6">
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-zinc-550">Order ID</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mt-1">#{order.id}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-zinc-550">Date Placed</p>
                  <p className="text-xs uppercase tracking-wider text-gray-700 dark:text-zinc-350 mt-1">{order.date}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-zinc-550">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-none border ${
                    order.status === 'Processing' 
                      ? 'bg-amber-50 text-amber-800 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-zinc-550">Total Amount</p>
                  <p className="text-xs font-mono font-bold text-black dark:text-white mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold uppercase tracking-widest text-black dark:text-white">{item.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
                        Qty: {item.quantity}{item.size || item.color ? ` • Size: ${item.size || 'M'} • Color: ${item.color || 'Default'}` : ''}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-gray-600 dark:text-zinc-300">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Footer details */}
              <div className="mt-8 pt-6 border-t border-zinc-150 dark:border-zinc-900 flex flex-col sm:flex-row justify-between text-xs gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-550 mr-2">Tracking Number:</span>
                  <span className="font-mono text-xs text-gray-700 dark:text-zinc-300">{order.tracking}</span>
                </div>
                <div>
                  <button className="text-[10px] font-semibold tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-75 transition-opacity">
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
