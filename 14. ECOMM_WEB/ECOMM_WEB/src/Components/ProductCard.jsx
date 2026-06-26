import { useApp } from "../context/AppContext";

// ProductCard component - displays a single product with image, title, price, and add to cart button
// product prop is passed from Home.jsx when mapping through products
export default function ProductCard({ product }) {
  // Get addToCart function from app context
  const { addToCart } = useApp();

  return (
    <div className="product-card">
      {/* Product image container */}
      <div className="img-wrapper">
        <img src={product.image} alt={product.title} />
      </div>
      
      {/* Product title */}
      <h4>{product.title}</h4>
      
      {/* Product price */}
      <p className="price">₹{product.price}</p>
      
      {/* Add to Cart button - calls addToCart function with this product */}
      <button 
        className="btn btn-primary" 
        onClick={() => addToCart(product)}  // Add this product to cart
      >
        Add to Cart
      </button>
    </div>
  );
}