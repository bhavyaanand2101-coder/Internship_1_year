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

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || isModalOpen) {
      return;
    }
    const productGender = product.gender ? product.gender.toLowerCase() : 'unisex';
    router.push(
      productGender === 'women'
        ? `/women/${product.id}`
        : productGender === 'men'
        ? `/men/${product.id}`
        : `/unisex/${product.id}`
    );
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group relative bg-transparent overflow-hidden transition-all duration-300 h-full flex flex-col justify-between cursor-pointer"
      >
        <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover w-full transition-transform duration-[800ms] ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 30vw"
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-black dark:bg-white text-white dark:text-black text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm">
              -{discountPercent}%
            </span>
          )}
          
          {/* Wishlist Heart Icon (Top-right, minimal overlay) */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-200"
            aria-label="Add to wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-colors ${
                isInWishlist ? 'text-black dark:text-white fill-black dark:fill-white' : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'
              }`}
              fill={isInWishlist ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.36l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 12l-5.657-5.657z" />
            </svg>
          </button>

          {/* Dual Quick Actions slide-up overlay */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/90 dark:bg-black/90 backdrop-blur-sm py-3 text-center shadow-md flex divide-x divide-gray-100 dark:divide-zinc-800">
            <button
              onClick={handleQuickViewClick}
              className="flex-1 text-[9px] font-semibold tracking-[0.15em] uppercase text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              Quick View
            </button>
            <button
              onClick={handleAddToCartClick}
              className="flex-1 text-[9px] font-semibold tracking-[0.15em] uppercase text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              + Quick Add
            </button>
          </div>
        </div>

        <div className="pt-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1 gap-2">
              <h3 className="text-[13px] tracking-wide text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[80%] uppercase">
                {product.name}
              </h3>
              <span className={`text-[9px] font-semibold uppercase tracking-widest ${product.inStock ? 'text-zinc-400 dark:text-zinc-500' : 'text-red-500'}`}>
                {product.inStock ? '' : 'Sold Out'}
              </span>
            </div>
            
            <div className="flex items-baseline mb-2">
              {hasDiscount ? (
                <>
                  <span className="text-[13px] font-medium text-black dark:text-white mr-2">
                    ${product.price}.00
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-zinc-500 line-through">
                    ${product.originalPrice}.00
                  </span>
                </>
              ) : (
                <span className="text-[13px] font-medium text-black dark:text-white">${product.price}.00</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            {product.sizes && product.sizes.length > 0 && (
              <div className="text-[9px] text-gray-400 dark:text-zinc-500 font-mono tracking-widest uppercase">
                {product.sizes.slice(0, 4).join('  ')}
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1.5 items-center">
                {product.colors.slice(0, 3).map((color) => (
                  <span
                    key={color}
                    className="w-2 h-2 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm inline-block"
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white dark:bg-zinc-950 rounded-none border border-gray-100 dark:border-zinc-900 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative text-black dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white z-10 p-2 bg-white/80 dark:bg-black/80 rounded-full shadow-sm hover:scale-105 transition-all"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {modalLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Loading Details...</p>
              </div>
            ) : detailedProduct ? (
              <>
                {/* Images Section */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col space-y-4 border-r border-gray-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900">
                  <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-white dark:bg-black">
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
                          className={`w-14 h-14 relative rounded-none border overflow-hidden transition-all ${
                            activeImageIndex === index ? 'border-black dark:border-white border-2 shadow-sm scale-105' : 'border-gray-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
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
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-zinc-950">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">{detailedProduct.category}</p>
                      <h2 className="text-xl font-medium tracking-wide text-zinc-900 dark:text-white uppercase">{detailedProduct.name}</h2>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      {detailedProduct.originalPrice ? (
                        <>
                          <span className="text-[15px] font-semibold text-black dark:text-white">${detailedProduct.price}.00</span>
                          <span className="text-xs text-gray-400 dark:text-zinc-500 line-through">${detailedProduct.originalPrice}.00</span>
                        </>
                      ) : (
                        <span className="text-[15px] font-semibold text-black dark:text-white">${detailedProduct.price}.00</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-light">{detailedProduct.description}</p>

                    {/* Size Selector */}
                    {detailedProduct.sizes && detailedProduct.sizes.length > 0 && detailedProduct.sizes[0] !== 'One Size' && (
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest mb-3">Size</h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedProduct.sizes.map((size: string) => (
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
                    {detailedProduct.colors && detailedProduct.colors.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest mb-3">Color</h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedProduct.colors.map((color: string) => (
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
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest mb-3">Quantity</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="flex h-8 w-8 items-center justify-center border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white rounded-none hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 12H6" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-mono text-xs">{quantity}</span>
                        <button
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="flex h-8 w-8 items-center justify-center border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white rounded-none hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12M6 12h12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={handleModalAddToCart}
                      className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold rounded-none border border-black dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleModalBuyNow}
                      className="flex-1 py-4 bg-transparent text-black dark:text-white text-[10px] tracking-widest uppercase font-semibold rounded-none border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
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