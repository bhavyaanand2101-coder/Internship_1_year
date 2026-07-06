import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Container, Truck, RefreshCw } from 'lucide-react';
import Manifesto from '../components/Manifesto';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';
import SEO from '../components/SEO';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const list = await api.getProducts();
        // Take first 4 as studio featured picks
        setFeaturedProducts(list.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="w-full bg-black">
      <SEO title="Luxury Streetwear" />

      {/* Hero Poster Landing Section */}
      <section className="relative w-full min-h-[75vh] flex flex-col justify-center items-start px-6 md:px-16 bg-black overflow-hidden pt-16 pb-24 select-none">
        {/* Abstract background gradient details */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl z-10 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-red rounded-full"></span>
            <span className="text-[10px] font-black text-brand-red tracking-widest uppercase">AW '26 • THE NEW DROP</span>
          </div>

          <h1 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-impact tracking-tight leading-[0.95] uppercase">
            PURE COTTON.<br />
            <span className="text-brand-red">PURE INTENT.</span>
          </h1>

          <p className="text-neutral-400 text-xs md:text-sm max-w-lg leading-relaxed tracking-wide font-medium">
            CosoStyle crafts heavyweight 240 GSM organic cotton tees in limited batch runs. No polyester. No fillers. Just pure structured architecture and silent lines.
          </p>

          <div className="pt-6 flex flex-wrap gap-4">
            <Link to="/shop" className="bg-brand-red hover:bg-red-700 text-white font-black text-xs tracking-widest px-8 py-4 flex items-center gap-3 uppercase transition-colors duration-300 rounded-full shadow-lg hover:shadow-brand-red/20">
              EXPLORE DROPS <ArrowRight size={14} strokeWidth={3} />
            </Link>
            <Link to="/shop?category=oversized" className="bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-700 text-white font-black text-xs tracking-widest px-8 py-4 uppercase transition-colors duration-300 rounded-full">
              OVERSIZED CUTS
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Value Proposition Banner */}
      <section className="w-full bg-[#050507] py-10 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="text-brand-red mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">100% PURE COTTON</h4>
              <p className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase">Combed & organic weave</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Container className="text-brand-red mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">240 GSM HEAVYWEIGHT</h4>
              <p className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase">Structured drape forms</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Truck className="text-brand-red mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">FREE DISPATCH OVER ₹999</h4>
              <p className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase">Worldwide express shipment</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <RefreshCw className="text-brand-red mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">LIMITED BATCH RUNS</h4>
              <p className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase">Zero inventory waste</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Collection Gallery - Compact Luxury Grid Structure */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <div className="flex items-end justify-between border-b border-neutral-950 pb-4">
          <div>
            <span className="text-[10px] font-black text-brand-red tracking-widest uppercase block mb-1">FEATURED</span>
            <h2 className="text-white text-3xl font-black font-impact tracking-wide uppercase">THE STUDIO PICKS</h2>
          </div>
          <Link to="/shop" className="text-[10px] font-black text-neutral-500 hover:text-white tracking-widest uppercase flex items-center gap-1.5 transition">
            SHOP ALL <ArrowRight size={10} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-950 rounded-luxury animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Manifesto block */}
      <Manifesto />
    </div>
  );
}