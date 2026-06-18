export default function BestSellers() {
    return (
        <section className="py-28 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm">
                        Best Sellers
                    </p>

                    <h2 className="text-5xl font-bold mt-4">
                        Most Loved Pieces
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="h-[650px] rounded-3xl bg-zinc-200" />

                    <div className="flex flex-col justify-center">
                        <h3 className="text-5xl font-bold">
                            Premium Oversized Collection
                        </h3>

                        <p className="mt-8 text-zinc-600 text-lg leading-8">
                            Designed with premium fabrics and modern silhouettes,
                            our best-selling collection represents the essence of
                            luxury streetwear.
                        </p>

                        <button className="mt-8 bg-black text-white px-8 py-4 rounded-full w-fit">
                            Shop Best Sellers
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}