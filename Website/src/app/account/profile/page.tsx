"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const stored = localStorage.getItem('cosostyle_profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => {
          setProfile(parsed);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cosostyle_profile', JSON.stringify(profile));
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
    <div className="min-h-[calc(100vh-4rem)] py-16 text-black dark:text-white bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-150 dark:border-zinc-900 pb-6">
          <div>
            <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">Profile Settings</h1>
            <p className="text-[10px] text-gray-450 dark:text-zinc-500 mt-1 uppercase tracking-widest">
              Manage your personal information
            </p>
          </div>
          <Link href="/account" className="text-[10px] font-semibold tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-75 transition-opacity flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Edit Profile Info */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 rounded-none bg-transparent">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">Personal Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity pt-4"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 rounded-none bg-transparent">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity pt-4"
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
