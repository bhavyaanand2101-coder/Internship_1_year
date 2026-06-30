export default function Testimonials() {
    return (
        <section className="py-32 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-20">

                    <p className="uppercase tracking-[6px] text-[#D4AF37]">
                        Testimonials
                    </p>

                    <h2 className="text-5xl font-bold mt-4">
                        Loved By Customers
                    </h2>

                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="p-10 rounded-3xl border shadow-sm"
                        >
                            <p className="text-zinc-600 leading-8">
                                “The quality exceeded my expectations.
                                Every detail feels premium and luxurious.”
                            </p>

                            <h4 className="mt-8 font-bold">
                                Customer {item}
                            </h4>
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}