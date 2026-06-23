"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface AddressItem {
  id: number;
  type: string;
  name: string;
  address: string;
  cityStateZip: string;
  country: string;
  phone: string;
}

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  
  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  const [isSameAsShipping, setIsSameAsShipping] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cosostyle_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setTimeout(() => {
          setCartItems(parsed);
        }, 0);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const storedProfile = localStorage.getItem('cosostyle_profile');
      const storedAddresses = localStorage.getItem('cosostyle_addresses');

      let profileData = null;
      let addressData = null;

      if (storedProfile) {
        profileData = JSON.parse(storedProfile);
      }
      if (storedAddresses) {
        const addresses = JSON.parse(storedAddresses) as AddressItem[];
        addressData = addresses.find(
          (a: AddressItem) =>
            a.type === 'Default Shipping' || a.type.toLowerCase().includes('shipping')
        );
        if (!addressData && addresses.length > 0) {
          addressData = addresses[0];
        }
      }

      if (profileData || addressData) {
        setTimeout(() => {
          setShippingInfo((prev) => {
            const addressVal = addressData ? addressData.address : '';
            const phoneVal = profileData?.phone || addressData?.phone || '';

            let cityVal = '';
            let stateVal = '';
            let zipVal = '';

            if (addressData?.cityStateZip) {
              const parts = addressData.cityStateZip.split(',');
              if (parts.length > 0) {
                cityVal = parts[0].trim();
              }
              if (parts.length > 1) {
                const stateZipParts = parts[1].trim().split(' ');
                if (stateZipParts.length > 0) {
                  stateVal = stateZipParts[0].trim();
                }
                if (stateZipParts.length > 1) {
                  zipVal = stateZipParts.slice(1).join(' ').trim();
                }
              }
            }

            return {
              ...prev,
              firstName: profileData?.firstName || addressData?.name?.split(' ')[0] || '',
              lastName: profileData?.lastName || addressData?.name?.split(' ').slice(1).join(' ') || '',
              email: profileData?.email || '',
              phone: phoneVal,
              address: addressVal,
              city: cityVal,
              state: stateVal,
              zipCode: zipVal,
              country: addressData?.country || 'USA',
            };
          });
        }, 0);
      }
    } catch (err) {
      console.error('Failed to prefill shipping info:', err);
    }
  }, []);

  // Compute pricing totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedPromo === 'SAVE10' ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

  const handleNext = () => {
    if (step === 1) {
      // Validate shipping info
      if (
        !shippingInfo.firstName ||
        !shippingInfo.lastName ||
        !shippingInfo.email ||
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.zipCode
      ) {
        alert('Please fill in all required shipping information');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate payment info
      if (
        !paymentInfo.cardNumber ||
        !paymentInfo.expiryDate ||
        !paymentInfo.cvv ||
        !paymentInfo.nameOnCard
      ) {
        alert('Please fill in all payment information');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shippingInfo,
        paymentInfo,
        cartItems,
        couponCode: appliedPromo || undefined,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to place order');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          // Clear cart
          localStorage.removeItem('cosostyle_cart');
          window.dispatchEvent(new Event('cart-updated'));
          alert(`Order placed successfully! Order ID: ${data.orderId}`);
          router.push(`/checkout/success?orderId=${data.orderId}`);
        } else {
          alert(data.error || 'Failed to place order');
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Something went wrong while placing your order. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-black dark:text-white">
        
        {/* Step Progress Header */}
        <div className="mb-16 text-center">
          <h1 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mb-6">Checkout</h1>
          <div className="flex justify-center items-center space-x-6 text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-400 dark:text-zinc-650">
            <span className={step === 1 ? 'text-black dark:text-white font-bold' : ''}>01 Shipping</span>
            <span className="text-zinc-200 dark:text-zinc-800">|</span>
            <span className={step === 2 ? 'text-black dark:text-white font-bold' : ''}>02 Payment</span>
            <span className="text-zinc-200 dark:text-zinc-800">|</span>
            <span className={step === 3 ? 'text-black dark:text-white font-bold' : ''}>03 Review</span>
          </div>
        </div>

        <div className="space-y-12">
          {step === 1 && (
            <div className="space-y-8">
              <h2 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-zinc-900 pb-3">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                    Apartment, Suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, etc."
                    value={shippingInfo.apartment}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        apartment: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      Country
                    </label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                    >
                      <option value="USA">United States</option>
                      <option value="CAN">Canada</option>
                      <option value="GBR">United Kingdom</option>
                      <option value="AUS">Australia</option>
                      <option value="DEU">Germany</option>
                      <option value="FRA">France</option>
                      <option value="JPN">Japan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-zinc-900 pb-3">Billing Address</h2>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="same-as-shipping"
                    checked={isSameAsShipping}
                    onChange={(e) => setIsSameAsShipping(e.target.checked)}
                    className="h-4 w-4 border-gray-300 dark:border-zinc-800 rounded-none text-black dark:text-white focus:ring-0 focus:ring-offset-0 accent-black dark:accent-white"
                  />
                  <label className="ml-3 text-[10px] font-semibold uppercase tracking-widest text-gray-700 dark:text-zinc-300 cursor-pointer" htmlFor="same-as-shipping">
                    Bill to same address
                  </label>
                </div>
                {isSameAsShipping ? (
                  <p className="text-xs text-gray-500 dark:text-zinc-500 tracking-wider">
                    Your billing address is configured to match your shipping address.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={billingInfo.firstName}
                        onChange={(e) =>
                          setBillingInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={billingInfo.lastName}
                        onChange={(e) =>
                          setBillingInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={billingInfo.address}
                        onChange={(e) =>
                          setBillingInfo((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment or Suite"
                        value={billingInfo.apartment}
                        onChange={(e) =>
                          setBillingInfo((prev) => ({
                            ...prev,
                            apartment: e.target.value,
                          }))
                        }
                        className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          placeholder="City"
                          value={billingInfo.city}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                          State / Province *
                        </label>
                        <input
                          type="text"
                          placeholder="State"
                          value={billingInfo.state}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }))
                          }
                          className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                          ZIP / Postal Code *
                        </label>
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={billingInfo.zipCode}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              zipCode: e.target.value,
                            }))
                          }
                          className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                          Country
                        </label>
                        <select
                          value={billingInfo.country}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                          className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                        >
                          <option value="USA">United States</option>
                          <option value="CAN">Canada</option>
                          <option value="GBR">United Kingdom</option>
                          <option value="AUS">Australia</option>
                          <option value="DEU">Germany</option>
                          <option value="FRA">France</option>
                          <option value="JPN">Japan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-zinc-900 pb-3">Payment Details</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          cardNumber: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim(),
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      Expiry Date (MM/YY) *
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          expiryDate: e.target.value
                            .replace(/[^0-9]/g, '')
                            .replace(/^(\d{2})(\d{0,2})/, '$1/$2')
                            .substring(0, 5),
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 3),
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      placeholder="Name as it appears on card"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          nameOnCard: e.target.value,
                        }))
                      }
                      className="w-full bg-white dark:bg-zinc-900 text-xs px-4 py-3 border border-gray-250 dark:border-zinc-800 rounded-none focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-zinc-900 pb-3">Review Order</h2>
              
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-8 transition-colors duration-300 text-black dark:text-white space-y-8">
                
                {/* Address Overview Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                  <div className="space-y-2">
                    <h3 className="font-semibold uppercase tracking-wider text-[11px]">Shipping To</h3>
                    <p className="text-gray-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}{shippingInfo.apartment ? `, ${shippingInfo.apartment}` : ''}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold uppercase tracking-wider text-[11px]">Billing To</h3>
                    <p className="text-gray-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
                      {isSameAsShipping ? (
                        'Same as shipping address'
                      ) : (
                        <>
                          {billingInfo.firstName} {billingInfo.lastName}<br />
                          {billingInfo.address}{billingInfo.apartment ? `, ${billingInfo.apartment}` : ''}<br />
                          {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}<br />
                          {billingInfo.country}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Items Block */}
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-4">
                  <h3 className="font-semibold uppercase tracking-wider text-[11px] mb-4">Items</h3>
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-xs py-2">
                      <div className="space-y-1">
                        <span className="font-medium text-black dark:text-white uppercase tracking-wide">{item.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 block uppercase font-mono tracking-widest">
                          Size: {item.size} • Color: {item.color}
                        </span>
                      </div>
                      <span className="font-medium text-gray-600 dark:text-zinc-400">
                        ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  {cartItems.length === 0 && (
                    <p className="text-xs text-gray-400 py-4 text-center">Your cart is empty.</p>
                  )}
                </div>

                {/* Promo Code Input Block */}
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                    Promo Code
                  </label>
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      className="flex-1 bg-white dark:bg-zinc-900 text-xs px-4 py-2 border border-gray-200 dark:border-zinc-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors rounded-none placeholder-gray-400"
                      disabled={!!appliedPromo}
                    />
                    {appliedPromo ? (
                      <button
                        onClick={() => {
                          setAppliedPromo('');
                          setCouponCode('');
                        }}
                        className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white text-[10px] tracking-widest uppercase font-semibold transition-colors rounded-none"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (couponCode === 'SAVE10') {
                            setAppliedPromo('SAVE10');
                            setPromoError('');
                            alert('Promo code SAVE10 applied! (10% discount)');
                          } else {
                            setPromoError('Invalid promo code');
                            setAppliedPromo('');
                          }
                        }}
                        className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors rounded-none"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedPromo && (
                    <p className="text-[10px] tracking-wide text-green-600 dark:text-green-500 uppercase font-semibold">
                      Promo code SAVE10 applied (10% discount)
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[10px] tracking-wide text-red-500 uppercase font-semibold">
                      {promoError}
                    </p>
                  )}
                </div>

                {/* Final Calculation Block */}
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-500 font-medium">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">Shipping</span>
                    <span className="font-semibold text-green-650 dark:text-green-500 uppercase tracking-widest text-[10px]">Free</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 dark:border-zinc-900 pt-3">
                    <span className="text-gray-500 dark:text-zinc-400 font-sans">Estimated Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 dark:border-zinc-800 pt-4 text-sm font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100 transition-colors rounded-none disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting ? 'Processing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back / Next Buttons Overlay */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-900 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3.5 bg-transparent border border-black dark:border-white text-black dark:text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 rounded-none disabled:opacity-30"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 && (
            <button
              onClick={handleNext}
              className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100 transition-colors rounded-none"
            >
              {step === 1 ? 'Continue to Payment' : 'Continue to Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}