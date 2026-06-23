import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 text-black dark:text-white bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Story Hero */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 flex flex-col items-start">
              <h1 className="text-2xl font-light uppercase tracking-widest text-black dark:text-white mb-8">
                Our Story
              </h1>
              <p className="mb-6 text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                Founded in 2020, CoSoStyle began with a simple vision: to create luxury fashion that&apos;s accessible without compromising on quality. We believe that true style is timeless, and every garment should tell a story of craftsmanship and confidence.
              </p>
              <p className="mb-8 text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                From our sustainably sourced materials to our ethical manufacturing processes, we&apos;re committed to creating fashion that not only looks good but does good. Each collection is designed with the modern individual in mind—someone who values elegance, quality, and sustainability.
              </p>
              <Link
                href="/collections"
                className="inline-block px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none hover:opacity-85 transition-opacity"
              >
                Explore Collections
              </Link>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Brand Story"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-3 text-right">
                Crafted with Passion
              </p>
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="mb-24 border-t border-zinc-150 dark:border-zinc-900 pt-16">
          <div className="mb-12 text-center">
            <h2 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">
              Mission & Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">Our Mission</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                To empower individuals to express their unique style through meticulously crafted, sustainable luxury fashion that transcends trends and stands the test of time.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">Our Vision</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                To be the leading global luxury fashion brand known for uncompromising quality, innovative design, and a profound commitment to environmental and social responsibility.
              </p>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-24 border-t border-zinc-150 dark:border-zinc-900 pt-16">
          <div className="mb-12 text-center">
            <h2 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">
              Our Values
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-6 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-2m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 014.837 7.004M12 20.043c-2.749 0-5.468-.668-7.668-1.68" />
                </svg>
              </div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white">Quality</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-450 leading-relaxed">
                We use only the finest materials and employ expert craftsmanship to ensure every piece meets our exacting standards.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-6 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white">Sustainability</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-450 leading-relaxed">
                We prioritize eco-friendly materials and ethical production processes to minimize our environmental impact.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-6 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white">Innovation</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-450 leading-relaxed">
                We continuously innovate in design, materials, and technology to stay at the forefront of luxury fashion.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-6 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-1.104-.275-2.158-.764-3.082" />
                </svg>
              </div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white">Integrity</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-450 leading-relaxed">
                We conduct business with honesty, transparency, and respect for all stakeholders.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-24 border-t border-zinc-150 dark:border-zinc-900 pt-16">
          <div className="mb-12 text-center max-w-xl mx-auto">
            <h2 className="text-xl font-light uppercase tracking-widest text-black dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
              Global expertise and a shared passion for excellence
            </p>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-44 h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="Isabella Rossi"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">Isabella Rossi</h3>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Creative Director</p>
            </div>
            {/* Team Member 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-44 h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="James Chen"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">James Chen</h3>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Head of Design</p>
            </div>
            {/* Team Member 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-44 h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802bcb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="Maria Gonzalez"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">Maria Gonzalez</h3>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Sustainability Lead</p>
            </div>
            {/* Team Member 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-44 h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="David Kim"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">David Kim</h3>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-1">CEO & Founder</p>
            </div>
          </div>
        </section>

        {/* Fashion Photography Gallery */}
        <section className="mb-16 border-t border-zinc-150 dark:border-zinc-900 pt-16">
          <div className="mb-12 text-center">
            <h2 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">
              Fashion Photography
            </h2>
          </div>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1515378791036-1-5473257598?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            ].map((url, index) => (
              <div key={index} className="relative aspect-[2/3] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <Image
                  src={url}
                  alt={`Fashion Photography ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}