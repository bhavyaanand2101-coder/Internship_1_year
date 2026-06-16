"use client";

import Link from 'next/link';

export default function Addresses() {
  const addresses = [
    {
      id: 1,
      type: "Default Shipping",
      name: "Alexandra Chen",
      address: "123 Fashion Avenue, Apt 4B",
      cityStateZip: "New York, NY 10001",
      country: "United States",
      phone: "+1 (234) 567-890"
    },
    {
      id: 2,
      type: "Default Billing",
      name: "Alexandra Chen",
      address: "123 Fashion Avenue, Apt 4B",
      cityStateZip: "New York, NY 10001",
      country: "United States",
      phone: "+1 (234) 567-890"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">My Addresses</h1>
          <Link href="/account" className="text-sm font-semibold text-[#D4AF37] hover:text-[#b8860b] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Account Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                    {address.type}
                  </span>
                </div>
                <h3 className="font-bold text-black text-lg mb-2">{address.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {address.address}<br />
                  {address.cityStateZip}<br />
                  {address.country}<br />
                  <span className="text-gray-400">Phone:</span> {address.phone}
                </p>
              </div>
              
              <div className="mt-6 flex space-x-3 border-t border-gray-100 pt-4">
                <button className="text-sm font-semibold text-gray-700 hover:text-black transition-colors">
                  Edit
                </button>
                <button className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors shadow-sm">
          Add New Address
        </button>
      </div>
    </div>
  );
}
