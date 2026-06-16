"use client";

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to submit message');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setSubmitted(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
          });
        } else {
          alert(data.error || 'Failed to submit message');
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-black text-center">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white p-12 rounded-lg border border-gray-200 text-center space-y-4 shadow-sm max-w-xl mx-auto">
                <div className="flex items-center justify-center h-14 w-14 bg-[#D4AF37]/20 rounded-full mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">Message Sent Successfully!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Thank you for contacting CoSoStyle. Our advisors will review your inquiry and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
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
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                    placeholder="Enter your phone number (optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-black disabled:bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>


          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-black">Get In Touch</h2>
              <p className="text-gray-600">
                We&apos;d love to hear from you. Whether you have a question about our products, need styling advice, or want to share feedback, our team is here to help.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-black">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:hello@cosostyle.com" className="underline">
                      hello@cosostyle.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2V9.414a1 1 0 01-.293-.707L3.293 3.707A1 1 0 013 3V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-black">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+1234567890" className="underline">
                      +1 (234) 567-890
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11h2 4m3 3h9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-black">Address</h3>
                  <p className="text-gray-600">
                    123 Fashion Avenue<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold text-black">Our Location</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200">
              {/* Google Maps Embed - replace with actual embed URL */}
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.358873170312!2d-73.98930848454392!3d40.75050297933634!2m3!1f0!2f0!3f0!3m2!1i0!2i0!4f13.1!3m3!1m2!1s0x89c25a22a3bda36d:0x89c25a8a0a0b6e2a!2sTimes+Square,+New+York,+NY!5e0!3m2!1sen!2sus!4v1579785000000"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}