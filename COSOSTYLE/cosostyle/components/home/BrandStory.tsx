"use client";

import FadeIn from "@/components/animations/FadeIn";

export default function BrandStory() {
    return (
        <section className="bg-[#FAFAFA] py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <FadeIn>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Luxury Placeholder Image */}
                        <div className="relative">
                            <div className="h-[700px] rounded-3xl bg-gradient-to-br from-black via-zinc-900 to-zinc-800 shadow-2xl" />

                            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-3xl bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37]/30" />
                        </div>

                        {/* Content */}
                        <div>
                            <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm font-medium">
                                Our Story
                            </p>

                            <h2 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
                                Crafted For
                                <br />
                                Modern Luxury
                            </h2>

                            <div className="w-24 h-1 bg-[#D4AF37] mt-8 rounded-full" />

                            <p className="mt-8 text-zinc-600 text-lg leading-8">
                                CoSoStyle was founded with a simple vision:
                                create premium fashion that combines timeless elegance
                                with contemporary design.
                            </p>

                            <p className="mt-6 text-zinc-600 text-lg leading-8">
                                Every garment is carefully designed to deliver confidence,
                                sophistication, and exceptional comfort. We focus on
                                premium materials, refined craftsmanship, and minimalist
                                aesthetics that never go out of style.
                            </p>

                            <p className="mt-6 text-zinc-600 text-lg leading-8">
                                Our mission is to redefine luxury fashion by making
                                premium-quality apparel accessible to individuals who
                                appreciate excellence in every detail.
                            </p>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                <button className="bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition duration-300">
                                    Explore Our Story
                                </button>

                                <button className="border border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition duration-300">
                                    View Collection
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-16">
                                <div>
                                    <h3 className="text-3xl font-bold text-[#D4AF37]">
                                        2026
                                    </h3>
                                    <p className="text-zinc-500 mt-2">
                                        Founded
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-[#D4AF37]">
                                        50K+
                                    </h3>
                                    <p className="text-zinc-500 mt-2">
                                        Customers
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-[#D4AF37]">
                                        4.9★
                                    </h3>
                                    <p className="text-zinc-500 mt-2">
                                        Rating
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}