"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: "Alexandra",
    lastName: "Chen",
    email: "alexandra.chen@example.com",
    phone: "+1 (234) 567-890"
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Profile Settings</h1>
          <Link href="/account" className="text-sm font-semibold text-[#D4AF37] hover:text-[#b8860b] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Account Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Edit Profile Info */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-750 mb-1">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-750 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-750 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-750 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-black mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-750 mb-1">Current Password</label>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-750 mb-1">New Password</label>
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-750 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
