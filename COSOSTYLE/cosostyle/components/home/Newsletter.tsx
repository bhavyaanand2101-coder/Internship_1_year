export default function Newsletter() {
    return (
        <section className="bg-black text-white py-32">

            <div className="max-w-4xl mx-auto text-center px-6">

                <p className="uppercase tracking-[6px] text-[#D4AF37]">
                    Newsletter
                </p>

                <h2 className="text-5xl font-bold mt-6">
                    Join CoSoStyle
                </h2>

                <p className="mt-6 text-zinc-400">
                    Receive exclusive access to new collections,
                    premium offers and fashion insights.
                </p>

                <div className="mt-10 flex flex-col md:flex-row gap-4">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-6 py-4 rounded-full text-black"
                    />

                    <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold">
                        Subscribe
                    </button>

                </div>

            </div>

        </section>
    );
}