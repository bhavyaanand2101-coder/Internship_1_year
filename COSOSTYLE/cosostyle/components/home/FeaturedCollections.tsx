export default function FeaturedCollections() {
    const collections = [
        {
            title: "Men",
            description: "Timeless essentials crafted for modern confidence.",
        },
        {
            title: "Women",
            description: "Elegant silhouettes with luxury detailing.",
        },
        {
            title: "New Arrivals",
            description: "The latest premium pieces from CoSoStyle.",
        },
    ];

    return (
        <section className="py-28 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm">
                        Collections
                    </p>

                    <h2 className="text-5xl md:text-6xl font-bold mt-4">
                        Featured Collections
                    </h2>

                    <p className="text-zinc-600 mt-6 max-w-2xl mx-auto">
                        Explore our carefully curated collections designed with
                        luxury, quality and timeless style in mind.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {collections.map((collection) => (
                        <div
                            key={collection.title}
                            className="group overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Placeholder Image */}
                            <div className="h-[500px] bg-zinc-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-3xl font-bold">
                                        {collection.title}
                                    </h3>
                                </div>

                                <div className="absolute inset-0 group-hover:scale-105 transition duration-700 bg-zinc-300" />
                            </div>

                            <div className="p-8">
                                <p className="text-zinc-600 leading-7">
                                    {collection.description}
                                </p>

                                <button className="mt-6 text-[#D4AF37] font-semibold">
                                    Explore Collection →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}