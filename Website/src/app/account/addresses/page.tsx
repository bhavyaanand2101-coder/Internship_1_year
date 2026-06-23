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
    <div className="min-h-[calc(100vh-4rem)] py-16 text-black dark:text-white bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-150 dark:border-zinc-900 pb-6">
          <div>
            <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">My Addresses</h1>
            <p className="text-[10px] text-gray-450 dark:text-zinc-500 mt-1 uppercase tracking-widest">
              Manage your delivery locations
            </p>
          </div>
          <Link href="/account" className="text-[10px] font-semibold tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-75 transition-opacity flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Edit or Add Form */}
        {(isAdding || editingAddress) ? (
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 mb-12 max-w-xl mx-auto rounded-none bg-transparent">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Address Label (e.g. Shipping, Billing)</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  placeholder="123 Main St, Apt 4"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">City, State, Zip Code</label>
                <input
                  type="text"
                  value={formData.cityStateZip}
                  onChange={(e) => setFormData(prev => ({ ...prev, cityStateZip: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  placeholder="New York, NY 10001"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-6">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3.5 bg-transparent text-black dark:text-white text-[10px] font-semibold uppercase tracking-widest rounded-none border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {addresses.map((address) => (
                <div key={address.id} className="border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between rounded-none bg-transparent hover:border-black dark:hover:border-white transition-colors duration-300">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 px-2.5 py-1">
                        {address.type}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-3">{address.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider space-y-1">
                      {address.address}<br />
                      {address.cityStateZip}<br />
                      {address.country}<br />
                      <span className="text-gray-400 dark:text-zinc-650">Phone:</span> {address.phone}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex space-x-4 border-t border-zinc-150 dark:border-zinc-900 pt-4">
                    <button
                      onClick={() => handleEditClick(address)}
                      className="text-[10px] font-semibold uppercase tracking-widest text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-75 transition-opacity"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(address.id)}
                      className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500 border-b border-transparent hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <p className="col-span-2 text-center py-24 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                  No addresses saved. Add a new shipping or billing address below.
                </p>
              )}
            </div>

            <button
              onClick={handleAddClick}
              className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity"
            >
              Add New Address
            </button>
          </>
        )}
      </div>
    </div>
  );
}
