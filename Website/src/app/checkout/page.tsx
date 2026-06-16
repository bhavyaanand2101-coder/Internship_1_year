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

  const steps = [
    { label: 'Shipping Information', description: 'Enter your delivery details' },
    { label: 'Payment Information', description: 'Securely enter your payment details' },
    { label: 'Review Order', description: 'Review your order and place it' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">Checkout</h1>
          <div className="mt-2 flex space-x-4">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex-1 text-center py-3">
                <div className={`h-2.5 w-full rounded bg-gray-200 ${
                  index + 1 < step
                    ? 'bg-[#D4AF37]'
                    : index + 1 === step
                    ? 'bg-[#D4AF37]'
                    : 'bg-gray-300'
                }`}></div>
                <div className="mt-2">
                  <span className={`text-sm font-medium ${
                    index + 1 < step
                      ? 'text-[#D4AF37]'
                      : index + 1 === step
                      ? 'text-black'
                      : 'text-gray-500'
                  }`}>
                    {stepItem.label}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{stepItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-black">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your street address"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment, Suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter apartment or suite"
                    value={shippingInfo.apartment}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        apartment: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      placeholder="Enter state or province"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ZIP or postal code"
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-black">Payment Information</h2>
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="same-as-shipping"
                    checked={isSameAsShipping}
                    onChange={(e) => setIsSameAsShipping(e.target.checked)}
                    className="h-4 w-4 text-[#D4AF37]"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700" htmlFor="same-as-shipping">
                    Bill to same address
                  </label>
                </div>
                {isSameAsShipping ? (
                  <p className="text-sm text-gray-600">
                    Your billing address will be the same as your shipping address.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Billing Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter first name"
                          value={billingInfo.firstName}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          value={billingInfo.lastName}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          placeholder="Enter street address"
                          value={billingInfo.address}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apartment, Suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Enter apartment or suite"
                          value={billingInfo.apartment}
                          onChange={(e) =>
                            setBillingInfo((prev) => ({
                              ...prev,
                              apartment: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            placeholder="Enter city"
                            value={billingInfo.city}
                            onChange={(e) =>
                              setBillingInfo((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State / Province
                          </label>
                          <input
                            type="text"
                            placeholder="Enter state or province"
                            value={billingInfo.state}
                            onChange={(e) =>
                              setBillingInfo((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP / Postal Code
                          </label>
                          <input
                            type="text"
                            placeholder="Enter ZIP or postal code"
                            value={billingInfo.zipCode}
                            onChange={(e) =>
                              setBillingInfo((prev) => ({
                                ...prev,
                                zipCode: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        required
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date (MM/YY)
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        required
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                      maxLength={3}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-black">Review Order</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-black">Shipping To</h3>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}{shippingInfo.apartment ? ` ${shippingInfo.apartment}` : ''}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black">Billing To</h3>
                    <p className="text-sm text-gray-600">
                      {isSameAsShipping
                        ? 'Same as shipping address'
                        : `${billingInfo.firstName} ${billingInfo.lastName}<br />
                         ${billingInfo.address}${billingInfo.apartment ? ` ${billingInfo.apartment}` : ''}<br />
                         ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}<br />
                         ${billingInfo.country}`}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <div className="space-y-4">
                    {/* Dynamic Cart Items list */}
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-xs text-gray-500 block">
                            Size: {item.size} • Color: {item.color}
                          </span>
                        </div>
                        <span className="font-medium text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    
                    {cartItems.length === 0 && (
                      <p className="text-sm text-gray-500 py-4 text-center">Your cart is empty.</p>
                    )}

                    {/* Promo Code Input Block */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. SAVE10"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setPromoError('');
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                          disabled={!!appliedPromo}
                        />
                        {appliedPromo ? (
                          <button
                            onClick={() => {
                              setAppliedPromo('');
                              setCouponCode('');
                            }}
                            className="px-4 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
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
                            className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                      {appliedPromo && (
                        <p className="text-xs text-green-600 mt-1">
                          Promo code SAVE10 applied (10% discount)
                        </p>
                      )}
                      {promoError && (
                        <p className="text-xs text-red-600 mt-1">
                          {promoError}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start justify-between mb-2 border-t border-gray-300 pt-4">
                      <span className="font-medium text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-600">${subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex items-start justify-between mb-2 text-green-600 font-medium">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>

                    <div className="flex items-start justify-between mb-2 border-t border-gray-300 pt-2">
                      <span className="font-medium text-gray-600">Tax (10%)</span>
                      <span className="font-medium text-gray-600">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex items-start justify-between mb-4 border-t border-gray-300 pt-2">
                      <span className="text-xl font-bold text-black">Total</span>
                      <span className="text-xl font-bold text-black">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full px-6 py-3 bg-black disabled:bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting ? 'Processing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              {step === 1 ? 'Continue to Payment' : 'Continue to Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}