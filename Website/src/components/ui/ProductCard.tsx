"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  image: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  gender?: string;
}

interface ProductCardProps {
  product: Product;
}

interface DetailedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  description: string;
  images?: string[];
  materials?: string;
  care?: string;
  rating?: number;
  reviewCount?: number;
  gender: string;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  originalPrice?: number | null;
  discount?: number | null;
  gender?: string;
}

interface CartItem {
  id: number;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedProduct, setDetailedProduct] = useState<DetailedProduct | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal selectors state
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const discountPercent = product.discount ?? 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Sync with LocalStorage wishlist on mount and product change
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cosostyle_wishlist');
      const wishlist: WishlistItem[] = stored ? JSON.parse(stored) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInWishlist(wishlist.some((item) => item.id === product.id));
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('cosostyle_wishlist');
      let wishlist: WishlistItem[] = stored ? JSON.parse(stored) : [];
      const isExist = wishlist.some((item) => item.id === product.id);

      if (isExist) {
        wishlist = wishlist.filter((item) => item.id !== product.id);
        localStorage.setItem('cosostyle_wishlist', JSON.stringify(wishlist));
        setIsInWishlist(false);
        alert(`Removed "${product.name}" from wishlist.`);
      } else {
        wishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          inStock: product.inStock ?? true,
          originalPrice: product.originalPrice,
          discount: product.discount,
          gender: product.gender
        });
        localStorage.setItem('cosostyle_wishlist', JSON.stringify(wishlist));
        setIsInWishlist(true);
        alert(`Added "${product.name}" to wishlist!`);
      }
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('cosostyle_cart');
      const cart: CartItem[] = stored ? JSON.parse(stored) : [];
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';
      const cartItemId = `${product.id}-${defaultSize}-${defaultColor}`;

      const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          id: product.id,
          cartItemId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          size: defaultSize,
          color: defaultColor,
        });
      }
      localStorage.setItem('cosostyle_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      alert(`Added "${product.name}" to cart!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    setModalLoading(true);
    setQuantity(1);
    setActiveImageIndex(0);

    fetch(`/api/products/${product.id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: DetailedProduct) => {
        setDetailedProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize('M');
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        } else {
          setSelectedColor('Default');
        }
        setModalLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product details for quick view', err);
        setModalLoading(false);
      });
  };

  const handleModalClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
    setDetailedProduct(null);
  };

  const handleModalAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!detailedProduct) return;

    try {
      const stored = localStorage.getItem('cosostyle_cart');
      const cart: CartItem[] = stored ? JSON.parse(stored) : [];
      const size = selectedSize || 'M';
      const color = selectedColor || 'Default';
      const cartItemId = `${detailedProduct.id}-${size}-${color}`;

      const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: detailedProduct.id,
          cartItemId,
          name: detailedProduct.name,
          price: detailedProduct.price,
          image: detailedProduct.images?.[0] || detailedProduct.image,
          quantity,
          size,
          color,
        });
      }
      localStorage.setItem('cosostyle_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      setIsModalOpen(false);
      setDetailedProduct(null);
      alert(`Added ${quantity}x "${detailedProduct.name}" to cart!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!detailedProduct) return;

    handleModalAddToCart(e);
    router.push('/checkout');
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-between">
        <div className="relative group overflow-hidden">
          <div className="relative h-64 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          </div>
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 flex flex-col items-center justify-center p-4 space-y-2 transition-opacity duration-300">
            <button
              onClick={handleQuickViewClick}
              className="flex items-center px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-100 transition-all shadow hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleWishlistClick}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded transition-all shadow hover:scale-105 ${
                  isInWishlist ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill={isInWishlist ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.36l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 12l-5.657-5.657z" />
                </svg>
                {isInWishlist ? 'Saved' : 'Wishlist'}
              </button>
              <button
                onClick={handleAddToCartClick}
                className="flex items-center px-3 py-2 bg-[#D4AF37] text-white text-sm font-medium rounded hover:bg-[#b8860b] transition-all shadow hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l2.292 6.232A2.916 2.916 0 0010.417 15H15a2 2 0 002 2v2a2 2 0 002 2m-7-4h12a2 2 0 012 2v4.314c0 .58-.33 1.095-.801 1.406" />
                </svg>
                + Cart
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="mb-1.5 text-base font-bold text-black group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
            <div className="flex items-baseline mb-2.5">
              {hasDiscount ? (
                <>
                  <span className="mr-2 text-xs font-medium text-gray-400 line-through">
                    ${product.originalPrice}.00
                  </span>
                  <span className="font-extrabold text-[#D4AF37] text-base">
                    ${product.price}.00
                  </span>
                </>
              ) : (
                <span className="font-extrabold text-black text-base">${product.price}.00</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-1 mb-2 text-xs">
              {product.sizes?.slice(0, 4).map((size) => (
                <span key={size} className="px-1.5 py-0.5 bg-gray-50 text-[10px] rounded border border-gray-200 text-gray-500 font-mono">
                  {size}
                </span>
              ))}
              {product.sizes && product.sizes.length > 4 && (
                <span className="px-1.5 py-0.5 bg-gray-50 text-[10px] rounded border border-gray-200 text-gray-400">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-gray-100">
              <div className="flex gap-1.5">
                {product.colors?.slice(0, 3).map((color) => (
                  <span
                    key={color}
                    className="w-2.5 h-2.5 rounded-full border border-gray-300 shadow-sm inline-block"
                    title={color}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === 'white' ? '#f8f8f8' :
                        color.toLowerCase() === 'black' ? '#000000' :
                        color.toLowerCase() === 'navy' ? '#000080' :
                        color.toLowerCase() === 'gray' ? '#808080' :
                        color.toLowerCase() === 'beige' ? '#f5f5dc' :
                        color.toLowerCase() === 'brown' ? '#a52a2a' :
                        color.toLowerCase() === 'charcoal' ? '#36454f' :
                        color.toLowerCase() === 'olive' ? '#556b2f' :
                        color.toLowerCase() === 'red' ? '#ff0000' : '#808080',
                    }}
                  />
                ))}
                {product.colors && product.colors.length > 3 && (
                  <span className="text-[10px] text-gray-400 font-medium leading-none">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 p-2 bg-white/80 rounded-full shadow-sm hover:scale-105 transition-all"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {modalLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">Loading Details...</p>
              </div>
            ) : detailedProduct ? (
              <>
                {/* Images Section */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col space-y-4 border-r border-gray-100">
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={(detailedProduct.images && detailedProduct.images.length > 0) ? detailedProduct.images[activeImageIndex] : detailedProduct.image}
                      alt={detailedProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  {detailedProduct.images && detailedProduct.images.length > 1 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {detailedProduct.images.map((img: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-14 h-14 relative rounded border overflow-hidden transition-all ${
                            activeImageIndex === index ? 'border-[#D4AF37] border-2 shadow-sm scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${detailedProduct.name} view ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="60px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">{detailedProduct.category}</p>
                      <h2 className="text-2xl font-extrabold text-black">{detailedProduct.name}</h2>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      {detailedProduct.originalPrice ? (
                        <>
                          <span className="text-sm font-medium text-gray-400 line-through">${detailedProduct.originalPrice}.00</span>
                          <span className="text-xl font-bold text-black">${detailedProduct.price}.00</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-black">${detailedProduct.price}.00</span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed font-light">{detailedProduct.description}</p>

                    {/* Size Selector */}
                    {detailedProduct.sizes && detailedProduct.sizes.length > 0 && detailedProduct.sizes[0] !== 'One Size' && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Size</h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedProduct.sizes.map((size: string) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                                selectedSize === size
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white hover:bg-gray-50 border-gray-300'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selector */}
                    {detailedProduct.colors && detailedProduct.colors.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Color</h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedProduct.colors.map((color: string) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`flex items-center px-3 py-1 rounded border text-xs font-medium transition-all ${
                                selectedColor === color
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white hover:bg-gray-50 border-gray-300'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full mr-2 border border-gray-300"
                                style={{
                                  backgroundColor:
                                    color.toLowerCase() === 'white' ? '#f0f0f0' :
                                    color.toLowerCase() === 'black' ? '#000000' :
                                    color.toLowerCase() === 'navy' ? '#000080' :
                                    color.toLowerCase() === 'gray' ? '#808080' :
                                    color.toLowerCase() === 'beige' ? '#f5f5dc' :
                                    color.toLowerCase() === 'brown' ? '#a52a2a' :
                                    color.toLowerCase() === 'charcoal' ? '#36454f' :
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
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Quantity</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-mono text-sm">{quantity}</span>
                        <button
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={handleModalAddToCart}
                      className="flex-1 px-5 py-3 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded transition-colors shadow-sm hover:scale-[1.02] active:scale-[0.98] duration-150"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleModalBuyNow}
                      className="flex-1 px-5 py-3 bg-[#D4AF37] hover:bg-[#b8860b] text-white text-sm font-semibold rounded transition-colors shadow-sm hover:scale-[1.02] active:scale-[0.98] duration-150"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 py-16 text-center text-gray-500">Failed to load product details.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}