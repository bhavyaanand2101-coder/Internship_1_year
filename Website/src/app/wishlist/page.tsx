"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  image: string;
  inStock: boolean;
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [productsMap, setProductsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // Initialize wishlist from localStorage or set defaults
  useEffect(() => {
    // Fetch products to map correct genders for details routing
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const map: Record<number, string> = {};
        data.forEach((p: { id: number; gender: string }) => {
          map[p.id] = p.gender;
        });
        setProductsMap(map);
      })
      .catch((err) => console.error('Error fetching products list:', err));

    const stored = localStorage.getItem('cosostyle_wishlist');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWishlistItems(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default mock wishlist items to wow the user on first load
      const defaults = [
        {
          id: 1,
          name: 'Linen Blazer',
          price: 238,
          originalPrice: 298,
          discount: 20,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          inStock: true,
        },
        {
          id: 101,
          name: 'Silk Slip Dress',
          price: 198,
          originalPrice: null,
          discount: null,
          image: 'https://images.unsplash.com/photo-1583743814966-893c56b7fa16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          inStock: true,
        },
      ];
      setWishlistItems(defaults);
      localStorage.setItem('cosostyle_wishlist', JSON.stringify(defaults));
    }
    setLoading(false);
  }, []);

  const handleRemove = (id: number) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem('cosostyle_wishlist', JSON.stringify(updated));
    // Trigger custom event for header badge update
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Read current cart
    const currentCartStr = localStorage.getItem('cosostyle_cart');
    let cart = [];
    if (currentCartStr) {
      try {
        cart = JSON.parse(currentCartStr);
      } catch (e) {
        console.error(e);
      }
    }

    // Check if item exists in cart
    const existingIndex = cart.findIndex((cartItem: { id: number }) => cartItem.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        size: 'M', // default sizing
        color: 'Default',
      });
    }

    localStorage.setItem('cosostyle_cart', JSON.stringify(cart));
    // Trigger custom event for header badge update
    window.dispatchEvent(new Event('cart-updated'));
    alert(`Added "${item.name}" to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Loading Wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-black text-center">
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.36l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 12l-5.657-5.657z" />
            </svg>
            <h2 className="text-xl font-bold text-black mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save your favorite items here to view them later or add them to your cart.
            </p>
            <Link
              href="/collections"
              className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => {
              const hasDiscount = item.originalPrice && item.originalPrice > item.price;
              return (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={500}
                      className="object-cover w-full h-64"
                    />
                    {hasDiscount && item.discount && (
                      <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
                        -{item.discount}%
                      </span>
                    )}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-black">{item.name}</h3>
                    <div className="flex items-baseline mb-4">
                      {hasDiscount ? (
                        <>
                          <span className="mr-2 text-sm font-medium text-gray-500 line-through">
                            ${item.originalPrice}.00
                          </span>
                          <span className="font-bold text-black text-lg">
                            ${item.price}.00
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-black text-lg">${item.price}.00</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-[#D4AF37] hover:bg-[#b8860b] text-white text-sm font-medium rounded transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l2.292 6.232A2.916 2.916 0 0010.417 15H15a2 2 0 002 2v2a2 2 0 002 2m-7-4h12a2 2 0 012 2v4.314c0 .58-.33 1.095-.801 1.406a2.007 2.007 0 01-.416 1.12l-.378 1.088a2 2 0 01-2.074 0L9.41 18.25a2 2 0 01-.416-1.12A2.007 2.007 0 017 13.314V11z" />
                        </svg>
                        Add to Cart
                      </button>
                      <Link
                        href={
                          productsMap[item.id] === 'women'
                            ? `/women/${item.id}`
                            : productsMap[item.id] === 'men'
                            ? `/men/${item.id}`
                            : productsMap[item.id] === 'unisex'
                            ? `/unisex/${item.id}`
                            : item.id >= 100
                            ? `/women/${item.id}`
                            : `/men/${item.id}`
                        }
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
