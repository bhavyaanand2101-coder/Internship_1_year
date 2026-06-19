"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AddressItem {
  id: number;
  type: string;
  name: string;
  address: string;
  cityStateZip: string;
  country: string;
  phone: string;
}
const defaultAddresses: AddressItem[] = [
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

export default function Addresses() {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: "Shipping",
    name: "",
    address: "",
    cityStateZip: "",
    country: "United States",
    phone: ""
  });

  // Load from localStorage or set defaults
  useEffect(() => {
    const stored = localStorage.getItem('cosostyle_addresses');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => {
          setAddresses(parsed);
        });
      } catch (e) {
        console.error('Failed to parse addresses from localStorage', e);
        Promise.resolve().then(() => {
          setAddresses(defaultAddresses);
        });
      }
    } else {
      Promise.resolve().then(() => {
        setAddresses(defaultAddresses);
      });
      localStorage.setItem('cosostyle_addresses', JSON.stringify(defaultAddresses));
    }
  }, []);

  const handleRemove = (id: number) => {
    const next = addresses.filter((a) => a.id !== id);
    setAddresses(next);
    localStorage.setItem('cosostyle_addresses', JSON.stringify(next));
  };

  const handleEditClick = (address: AddressItem) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      cityStateZip: address.cityStateZip,
      country: address.country,
      phone: address.phone
    });
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingAddress(null);
    setFormData({
      type: "Shipping",
      name: "",
      address: "",
      cityStateZip: "",
      country: "United States",
      phone: ""
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.cityStateZip || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    let next: AddressItem[];
    if (editingAddress) {
      next = addresses.map((a) =>
        a.id === editingAddress.id ? { ...a, ...formData } : a
      );
    } else {
      const newAddress = {
        id: Date.now(),
        ...formData
      };
      next = [...addresses, newAddress];
    }

    setAddresses(next);
    localStorage.setItem('cosostyle_addresses', JSON.stringify(next));
    setEditingAddress(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAdding(false);
  };

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

        {/* Edit or Add Form */}
        {(isAdding || editingAddress) ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8 max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-black mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Label (e.g. Shipping, Billing)</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="123 Main St, Apt 4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City, State, Zip Code</label>
                <input
                  type="text"
                  value={formData.cityStateZip}
                  onChange={(e) => setFormData(prev => ({ ...prev, cityStateZip: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="New York, NY 10001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-150 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
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
                    <button
                      onClick={() => handleEditClick(address)}
                      className="text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(address.id)}
                      className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <p className="col-span-2 text-center py-12 text-gray-500">
                  No addresses saved. Add a new shipping or billing address below.
                </p>
              )}
            </div>

            <button
              onClick={handleAddClick}
              className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors shadow-sm"
            >
              Add New Address
            </button>
          </>
        )}
      </div>
    </div>
  );
}
