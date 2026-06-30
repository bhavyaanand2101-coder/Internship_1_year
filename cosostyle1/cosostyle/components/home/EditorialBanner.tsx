export default function EditorialBanner() {
    return (
        <section className="bg-black text-white py-40">

            <div className="max-w-6xl mx-auto px-6 text-center">

                <p className="uppercase tracking-[8px] text-[#D4AF37]">
                    Luxury Collection
                </p>

                <h2 className="text-6xl md:text-8xl font-bold mt-8">
                    The Art of
                    <br />
                    Modern Fashion
                </h2>

                <p className="max-w-3xl mx-auto mt-10 text-zinc-400 text-lg leading-8">
                    Discover premium collections crafted for those
                    who appreciate quality, sophistication and timeless design.
                </p>

                <button className="mt-12 border border-white px-10 py-4 rounded-full hover:bg-white hover:text-black transition">
                    View Collection
                </button>

            </div>

        </section>
    );
}