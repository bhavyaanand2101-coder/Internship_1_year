export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">
                    CoSoStyle
                </h1>

                <nav className="hidden md:flex gap-8 text-white">
                    <a href="/">Home</a>
                    <a href="/men">Men</a>
                    <a href="/women">Women</a>
                    <a href="/collections">Collections</a>
                    <a href="/contact">Contact</a>
                </nav>

                <div className="flex gap-4 text-white">
                    <span>♡</span>
                    <span>🛒</span>
                    <span>👤</span>
                </div>
            </div>
        </header>
    );
}