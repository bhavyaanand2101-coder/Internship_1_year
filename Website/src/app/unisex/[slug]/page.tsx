"use client";

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  image: string;
  materials: string;
  care: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  gender: string;
}

export default function UnisexProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.slug, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [prevId, setPrevId] = useState(productId);
  if (productId !== prevId) {
    setPrevId(productId);
    setLoading(true);
    setProduct(null);
  }

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to fetch product details');
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    const currentCartStr = localStorage.getItem('cosostyle_cart');
    let cart = [];
    if (currentCartStr) {
      try {
        cart = JSON.parse(currentCartStr);
      } catch (e) {
        console.error(e);
      }
    }

    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;
    const existingIndex = cart.findIndex((item: { cartItemId?: string }) => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        cartItemId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
    }

    localStorage.setItem('cosostyle_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    alert(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    const currentStr = localStorage.getItem('cosostyle_wishlist');
    let wishlist = [];
    if (currentStr) {
      try {
        wishlist = JSON.parse(currentStr);
      } catch (e) {
        console.error(e);
      }
    }

    if (wishlist.some((item: { id: number }) => item.id === product.id)) {
      alert(`"${product.name}" is already in your wishlist!`);
      return;
    }

    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      inStock: product.inStock
    });

    localStorage.setItem('cosostyle_wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlist-updated'));
    alert(`Added "${product.name}" to wishlist!`);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest animate-pulse">
            Loading luxury item...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 max-w-xl mx-auto space-y-6">
            <h1 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Product Not Found</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-widest">We couldn&apos;t find that specific item. Browse our latest unisex collection instead!</p>
            <Link href="/" className="inline-block px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors rounded-none">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="space-y-6">
              <div className="relative aspect-[3/4] w-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
                <Image
                  src={imagesList[activeImageIndex] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-black dark:bg-white text-white dark:text-black text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1">
                    -{product.discount}%
                  </span>
                )}
              </div>
              
              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {imagesList.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-20 aspect-[3/4] bg-zinc-50 dark:bg-zinc-900 overflow-hidden border ${
                        activeImageIndex === index
                          ? 'border-black dark:border-white border-2'
                          : 'border-gray-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                      } transition-all`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4AF37] dark:text-luxury-gold tracking-wider">
                {product.category}
              </p>
              <h1 className="text-2xl font-medium tracking-wide uppercase text-zinc-900 dark:text-white">
                {product.name}
              </h1>
            </div>

            <div className="text-base font-semibold text-black dark:text-white">
              ${product.price}.00
            </div>

            <div className="divide-y divide-gray-150 dark:divide-zinc-900 border-t border-b border-gray-150 dark:border-zinc-900">
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
                <div className="py-6">
                  <h3 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest mb-4">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-[11px] font-medium transition-all rounded-none uppercase tracking-wider ${
                          selectedSize === size
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'bg-transparent text-gray-500 hover:text-black hover:border-black dark:text-zinc-400 dark:hover:text-white border-gray-200 dark:border-zinc-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="py-6">
                  <h3 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest mb-4">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center px-4 py-2 border text-[11px] font-medium transition-all rounded-none uppercase tracking-wider ${
                          selectedColor === color
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'bg-transparent text-gray-500 hover:text-black hover:border-black dark:text-zinc-400 dark:hover:text-white border-gray-200 dark:border-zinc-800'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full mr-2 border border-gray-200 dark:border-zinc-800"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === 'white' ? '#f8f8f8' :
                              color.toLowerCase() === 'black' ? '#000000' :
                              color.toLowerCase() === 'navy' ? '#000080' :
                              color.toLowerCase() === 'gray' ? '#808080' :
                              color.toLowerCase() === 'beige' ? '#f5f5dc' :
                              color.toLowerCase() === 'brown' ? '#a52a2a' :
                              color.toLowerCase() === 'olive' ? '#556b2f' :
                              color.toLowerCase() === 'red' ? '#ff0000' : '#808080'
                          }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="py-6">
                <h3 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest mb-4">
                  Quantity
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="flex h-8 w-8 items-center justify-center border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white rounded-none hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 12H6" />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-mono text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="flex h-8 w-8 items-center justify-center border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white rounded-none hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12M6 12h12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold rounded-none border border-black dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 py-4 bg-transparent text-black dark:text-white text-[10px] tracking-widest uppercase font-semibold rounded-none border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                Save to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Tab Section */}
        <div className="mt-24">
          <div className="flex border-b border-gray-150 dark:border-zinc-900 mb-8 space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTab === 'description'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTab === 'materials'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Materials & Care
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTab === 'reviews'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="max-w-2xl text-xs leading-relaxed text-gray-600 dark:text-zinc-400 font-light">
            {activeTab === 'description' && (
              <p className="uppercase tracking-wider">{product.description}</p>
            )}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-black dark:text-white uppercase tracking-wider mb-1">Materials</h3>
                  <p className="uppercase tracking-wider">{product.materials}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white uppercase tracking-wider mb-1">Care</h3>
                  <p className="uppercase tracking-wider">{product.care}</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-4.5 w-4.5 ${
                        star <= product.rating ? 'text-black dark:text-white fill-current' : 'text-gray-250 dark:text-zinc-800 fill-current'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-3 text-xs text-zinc-900 dark:text-zinc-100 font-semibold uppercase tracking-wider">
                    Overall rating: {product.rating} / 5 based on {product.reviewCount} customer reviews.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
