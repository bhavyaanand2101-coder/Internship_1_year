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
    <div className="min-h-[calc(100vh-4rem)] py-16 text-black dark:text-white bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">
            Contact Us
          </h1>
          <p className="text-[10px] text-gray-450 dark:text-zinc-400 mt-2 uppercase tracking-widest">
            Customer Relations & Support
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="py-16 text-center space-y-6 max-w-md mx-auto">
                <div className="flex items-center justify-center h-14 w-14 border border-zinc-200 dark:border-zinc-800 rounded-full mx-auto text-black dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">Message Sent Successfully</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting CoSoStyle. Our advisors will review your inquiry and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-8 py-3.5 border border-black dark:border-white text-[10px] font-semibold uppercase tracking-widest rounded-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs font-mono rounded-none focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>


          {/* Contact Info */}
          <div className="space-y-10 lg:pl-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-4">Get In Touch</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
                We&apos;d love to hear from you. Whether you have a question about our products, need styling advice, or want to share feedback, our team is here to help.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-0.5 text-black dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-1">Email</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                    <a href="mailto:hello@cosostyle.com" className="underline hover:text-black dark:hover:text-white transition-colors">
                      hello@cosostyle.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-0.5 text-black dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2V9.414a1 1 0 01-.293-.707L3.293 3.707A1 1 0 013 3V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-1">Phone</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                    <a href="tel:+1234567890" className="underline hover:text-black dark:hover:text-white transition-colors">
                      +1 (234) 567-890
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-0.5 text-black dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-1">Address</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
                    123 Fashion Avenue<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="lg:col-span-3 border-t border-zinc-150 dark:border-zinc-900 pt-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6 text-center">Our Location</h2>
            <div className="aspect-[21/9] w-full overflow-hidden border border-zinc-150 dark:border-zinc-900">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.358873170312!2d-73.98930848454392!3d40.75050297933634!2m3!1f0!2f0!3f0!3m2!1i0!2i0!4f13.1!3m3!1m2!1s0x89c25a22a3bda36d:0x89c25a8a0a0b6e2a!2sTimes+Square,+New+York,+NY!5e0!3m2!1sen!2sus!4v1579785000000"
                width="100%"
                height="100%"
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