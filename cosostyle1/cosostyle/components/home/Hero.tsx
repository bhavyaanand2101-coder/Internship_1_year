export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2070&auto=format&fit=crop')",
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex min-h-screen items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-3xl">
                        <p className="mb-6 text-[#D4AF37] uppercase tracking-[8px] text-sm font-medium">
                            Premium Luxury Fashion
                        </p>

                        <h1 className="text-white font-bold leading-none text-6xl md:text-8xl lg:text-9xl">
                            CoSoStyle
                        </h1>

                        <h2 className="mt-4 text-2xl md:text-4xl text-white font-light">
                            Luxury Redefined
                        </h2>

                        <p className="mt-8 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed">
                            Discover premium apparel crafted with exceptional quality,
                            timeless elegance, and modern sophistication for those who
                            demand the very best.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition duration-300">
                                Shop Now
                            </button>

                            <button className="border border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition duration-300">
                                New Collection
                            </button>

                            <button className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition duration-300">
                                Explore Luxury
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl">
                            <div>
                                <h3 className="text-[#D4AF37] text-3xl font-bold">50K+</h3>
                                <p className="text-zinc-400 text-sm">Happy Customers</p>
                            </div>

                            <div>
                                <h3 className="text-[#D4AF37] text-3xl font-bold">200+</h3>
                                <p className="text-zinc-400 text-sm">Luxury Products</p>
                            </div>

                            <div>
                                <h3 className="text-[#D4AF37] text-3xl font-bold">4.9★</h3>
                                <p className="text-zinc-400 text-sm">Customer Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
                ↓
            </div>
        </section>
    );
}