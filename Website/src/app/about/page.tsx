import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Story Hero */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-black mb-6">
                Our Story
              </h1>
              <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                Founded in 2020, CoSoStyle began with a simple vision: to create luxury fashion that&apos;s accessible without compromising on quality. We believe that true style is timeless, and every garment should tell a story of craftsmanship and confidence.
              </p>
              <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                From our sustainably sourced materials to our ethical manufacturing processes, we&apos;re committed to creating fashion that not only looks good but does good. Each collection is designed with the modern individual in mind—someone who values elegance, quality, and sustainability.
              </p>
              <Link
                href="/collections"
                className="inline-block px-6 py-3 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
              >
                Explore Collections
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <Image
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Brand Story"
                width={800}
                height={600}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
                <p className="font-medium">Crafted with Passion</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-black text-center">
            Mission & Vision
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4 text-lg font-semibold text-black">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower individuals to express their unique style through meticulously crafted, sustainable luxury fashion that transcends trends and stands the test of time.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4 text-lg font-semibold text-black">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading global luxury fashion brand known for uncompromising quality, innovative design, and a profound commitment to environmental and social responsibility.
              </p>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-black text-center">
            Our Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01.5-.5h.7a.5.5 0 010 1h-.7a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black">Quality</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use only the finest materials and employ expert craftsmanship to ensure every piece meets our exacting standards.
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c-1.263 0-2.42.488-3.256 1.176A11.925 11.925 0 003.341 12c0 5.241 4.275 9.524 9.583 9.524 5.308 0 9.583-4.283 9.583-9.524a11.925 11.925 0 006.236-6.648A11.894 11.894 0 0020.75 4.426c-.836-.688-1.993-1.176-3.256-1.176z" />
                    </svg>
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black">Sustainability</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We prioritize eco-friendly materials and ethical production processes to minimize our environmental impact.
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-2m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 014.837 7.004M12 20.043c-2.749 0-5.468-.668-7.668-1.68" />
                    </svg>
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black">Innovation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We continuously innovate in design, materials, and technology to stay at the forefront of luxury fashion.
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-1.104-.275-2.158-.764-3.082" />
                    </svg>
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black">Integrity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We conduct business with honesty, transparency, and respect for all stakeholders.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-black text-center">
            Our Team
          </h2>
          <p className="mb-8 text-center text-gray-600 max-w-xl">
            Our diverse team of designers, artisans, and professionals brings together global expertise and a shared passion for excellence.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Team Member 1 */}
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                alt="Team Member 1"
                width={150}
                height={150}
                className="rounded-full mb-4"
              />
              <h3 className="font-semibold text-black">Isabella Rossi</h3>
              <p className="text-sm text-gray-600">Creative Director</p>
            </div>
            {/* Team Member 2 */}
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                alt="Team Member 2"
                width={150}
                height={150}
                className="rounded-full mb-4"
              />
              <h3 className="font-semibold text-black">James Chen</h3>
              <p className="text-sm text-gray-600">Head of Design</p>
            </div>
            {/* Team Member 3 */}
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1529626455594-4ff0802bcb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                alt="Team Member 3"
                width={150}
                height={150}
                className="rounded-full mb-4"
              />
              <h3 className="font-semibold text-black">Maria Gonzalez</h3>
              <p className="text-sm text-gray-600">Sustainability Lead</p>
            </div>
            {/* Team Member 4 */}
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                alt="Team Member 4"
                width={150}
                height={150}
                className="rounded-full mb-4"
              />
              <h3 className="font-semibold text-black">David Kim</h3>
              <p className="text-sm text-gray-600">CEO & Founder</p>
            </div>
          </div>
        </section>

        {/* Fashion Photography Gallery */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-black text-center">
            Fashion Photography
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Gallery Image 1 */}
            <Image
              src="https://images.unsplash.com/photo-1515378791036-1-5473257598?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Fashion Photography 1"
              width={800}
              height={1200}
              className="rounded-lg object-cover"
            />
            {/* Gallery Image 2 */}
            <Image
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Fashion Photography 2"
              width={800}
              height={1200}
              className="rounded-lg object-cover"
            />
            {/* Gallery Image 3 */}
            <Image
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Fashion Photography 3"
              width={800}
              height={1200}
              className="rounded-lg object-cover"
            />
            {/* Gallery Image 4 */}
            <Image
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Fashion Photography 4"
              width={800}
              height={1200}
              className="rounded-lg object-cover"
            />
          </div>
        </section>
      </div>
    </div>
  );
}