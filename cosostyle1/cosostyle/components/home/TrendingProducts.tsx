export default function TrendingProducts() {
    const products = Array.from({ length: 4 });

    return (
        <section className="py-28 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm">
                        Trending
                    </p>

                    <h2 className="text-5xl font-bold mt-4">
                        Trending Products
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((_, index) => (
                        <div
                            key={index}
                            className="group"
                        >
                            <div className="h-[420px] bg-zinc-800 rounded-3xl overflow-hidden">
                                <div className="w-full h-full bg-zinc-700 group-hover:scale-105 transition duration-500" />
                            </div>

                            <div className="mt-5">
                                <h3 className="text-lg font-semibold">
                                    Premium Oversized Tee
                                </h3>

                                <p className="text-[#D4AF37] mt-2">
                                    ₹1,999
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}