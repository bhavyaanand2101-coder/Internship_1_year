import Link from 'next/link';

export default function Account() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-black">
          Account Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-black">
                Orders
              </h3>
              <p className="text-gray-600 text-sm">
                View your order history and track shipments
              </p>
            </div>
            <Link
              href="/account/order-history"
              className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200"
            >
              View Orders
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-black">
                Wishlist
              </h3>
              <p className="text-gray-600 text-sm">
                Save your favorite items for later
              </p>
            </div>
            <Link
              href="/wishlist"
              className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200"
            >
              View Wishlist
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-black">
                Addresses
              </h3>
              <p className="text-gray-600 text-sm">
                Manage your shipping and billing addresses
              </p>
            </div>
            <Link
              href="/account/addresses"
              className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200"
            >
              Manage Addresses
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-black">
                Account Details
              </h3>
              <p className="text-gray-600 text-sm">
                Update your personal information and preferences
              </p>
            </div>
            <Link
              href="/account/profile"
              className="mt-6 inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}