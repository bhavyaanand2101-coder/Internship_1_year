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
          setSelectedSize(data.sizes[0] === 'One Size' ? 'One Size' : null);
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">
            Loading luxury item...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn&apos;t find that specific item. Browse our latest unisex collection instead!</p>
            <Link href="/" className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={imagesList[activeImageIndex] || product.image}
                  alt={product.name}
                  width={800}
                  height={1000}
                  className="rounded-lg object-cover w-full h-[60vh]"
                  priority
                />
                {/* Thumbnails */}
                {imagesList.length > 1 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {imagesList.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className="focus:outline-none"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} view ${index + 1}`}
                          width={80}
                          height={80}
                          className={`rounded border object-cover h-20 w-20 transition-all ${
                            activeImageIndex === index ? 'border-[#D4AF37] border-2 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <p className="text-sm font-medium text-[#D4AF37] tracking-wider uppercase">{product.category}</p>
            </div>

            <div className="text-2xl font-bold text-black">${product.price}.00</div>

            <div className="divide-y divide-gray-200">
              {/* Size Selector */}
              {product.sizes[0] !== 'One Size' && (
                <div className="py-4">
                  <h3 className="mb-2 text-lg font-semibold text-black">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-10 w-12 items-center justify-center rounded border border-gray-300 text-sm font-medium ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              <div className="py-4">
                <h3 className="mb-2 text-lg font-semibold text-black">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex h-10 px-4 items-center justify-center rounded border border-gray-300 text-sm font-medium ${
                        selectedColor === color
                          ? 'bg-black text-white border-black'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full mr-2 border border-gray-300"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === 'white'
                              ? '#f0f0f0'
                            : color.toLowerCase() === 'black'
                              ? '#000000'
                            : color.toLowerCase() === 'navy'
                              ? '#000080'
                            : color.toLowerCase() === 'gray'
                              ? '#808080'
                            : color.toLowerCase() === 'beige'
                              ? '#f5f5dc'
                            : color.toLowerCase() === 'brown'
                              ? '#a52a2a'
                            : color.toLowerCase() === 'olive'
                              ? '#556b2f'
                            : color.toLowerCase() === 'red'
                              ? '#ff0000'
                            : '#808080',
                        }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="py-4">
                <h3 className="mb-2 text-lg font-semibold text-black">Quantity</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded border border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                  </button>
                  <span className="w-10 text-center font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded border border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
              >
                Save to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Tab Section */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'description'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'materials'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Materials & Care
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          {activeTab === 'description' && (
            <div className="text-gray-700 leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-black">Materials</h3>
                <p className="text-gray-600">{product.materials}</p>
              </div>
              <div>
                <h3 className="font-semibold text-black">Care</h3>
                <p className="text-gray-600">{product.care}</p>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-gray-600 space-y-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${
                      star <= product.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300 fill-gray-200'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600 font-medium">
                  Overall rating: {product.rating} / 5 based on {product.reviewCount} customer reviews.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
