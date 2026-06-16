import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number | null;
    discount?: number | null;
    image: string;
    category?: string;
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.discount ?? 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative group">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={500}
          className="object-cover w-full h-48"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 bg-black/50 flex flex-col items-center justify-center p-4 space-y-2">
          <button
            className="flex items-center px-3 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0l4.418 4.418A11.944 11.944 0 0012 21c5.522 0 10-4.478 10-10S17.522 4 12 4zm0-2h7a2 2 0 012 2v5h-.586m0 0L12.586 9.414a2 2 0 00-2.828 0L5.414 12H2a2 2 0 012-2V6a2 2 0 012 2h7z" />
            </svg>
            Quick View
          </button>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0l4.418 4.418A11.944 11.944 0 0012 21c5.522 0 10-4.478 10-10S17.522 4 12 4zm0-2h7a2 2 0 012 2v5h-.586m0 0L12.586 9.414a2 2 0 00-2.828 0L5.414 12H2a2 2 0 012-2V6a2 2 0 012 2h7z" />
              </svg>
              Wishlist
            </button>
            <button
              className="flex items-center px-3 py-2 bg-[#D4AF37] text-white text-sm font-medium rounded hover:bg-[#b8860b]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l2.292 6.232A2.916 2.916 0 0010.417 15H15a2 2 0 002 2v2a2 2 0 002 2m-7-4h12a2 2 0 012 2v4.314c0 .58-.33 1.095-.801 1.406a2.007 2.007 0 01-.416 1.12l-.378 1.088a2 2 0 01-2.074 0L9.41 18.25a2 2 0 01-2.074 0L6.34 16.26a2 2 0 01-.708 0l-.138-.395a2.007 2.007 0 01-.193-.451z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-black">{product.name}</h3>
        <div className="flex items-baseline mb-2">
          {hasDiscount ? (
            <>
              <span className="mr-2 text-sm font-medium text-gray-500 line-through">
                ${product.originalPrice}.00
              </span>
              <span className="font-bold text-black text-lg">
                ${product.price}.00
              </span>
            </>
          ) : (
            <span className="font-bold text-black text-lg">${product.price}.00</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-2 text-sm">
          {/* Sizes */}
          {product.sizes?.map((size) => (
            <span key={size} className="px-2 py-1 bg-gray-50 text-xs rounded border border-gray-300">
              {size}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2 text-sm">
          {/* Colors */}
          {product.colors?.map((color) => (
            <span
              key={color}
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{
                backgroundColor:
                  color.toLowerCase() === 'white'
                    ? '#f0f0f0'
                    : color.toLowerCase() === 'black'
                    ? '#000000'
                    : color.toLowerCase() === 'navy'
                    ? '#000080'
                    : color.toLowerCase() === 'gray'
                    ? '#808080'
                    : color.toLowerCase() === 'beige'
                    ? '#f5f5dc'
                    : color.toLowerCase() === 'brown'
                    ? '#a52a2a'
                    : color.toLowerCase() === 'charcoal'
                    ? '#36454f'
                    : '#808080',
              }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
      </div>
    </div>
  );
}