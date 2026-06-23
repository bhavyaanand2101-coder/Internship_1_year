import Link from 'next/link';

export default function Account() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-16 text-black dark:text-white bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-xl font-light uppercase tracking-widest text-black dark:text-white">
            Account Dashboard
          </h1>
          <p className="text-[10px] text-gray-450 dark:text-zinc-400 mt-2 uppercase tracking-widest">
            Manage your style preferences and orders
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-between text-center rounded-none bg-transparent hover:border-black dark:hover:border-white transition-colors duration-300">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                Orders
              </h3>
              <p className="text-gray-500 dark:text-zinc-450 text-xs leading-relaxed uppercase tracking-wider">
                View your order history and track shipments
              </p>
            </div>
            <Link
              href="/account/order-history"
              className="mt-8 inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity"
            >
              View Orders
            </Link>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-between text-center rounded-none bg-transparent hover:border-black dark:hover:border-white transition-colors duration-300">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                Wishlist
              </h3>
              <p className="text-gray-500 dark:text-zinc-450 text-xs leading-relaxed uppercase tracking-wider">
                Save your favorite items for later
              </p>
            </div>
            <Link
              href="/wishlist"
              className="mt-8 inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity"
            >
              View Wishlist
            </Link>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-between text-center rounded-none bg-transparent hover:border-black dark:hover:border-white transition-colors duration-300">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                Addresses
              </h3>
              <p className="text-gray-500 dark:text-zinc-450 text-xs leading-relaxed uppercase tracking-wider">
                Manage your shipping and billing addresses
              </p>
            </div>
            <Link
              href="/account/addresses"
              className="mt-8 inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity"
            >
              Manage Addresses
            </Link>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-between text-center rounded-none bg-transparent hover:border-black dark:hover:border-white transition-colors duration-300">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                Account Details
              </h3>
              <p className="text-gray-500 dark:text-zinc-450 text-xs leading-relaxed uppercase tracking-wider">
                Update your personal information and preferences
              </p>
            </div>
            <Link
              href="/account/profile"
              className="mt-8 inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-widest rounded-none border border-black dark:border-white hover:opacity-85 transition-opacity"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}