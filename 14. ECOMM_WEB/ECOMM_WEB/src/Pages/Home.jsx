import { useEffect, useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  // Get search, category, and sort filters from global app context
  const { search, category, setCategory, sort, setSort } = useApp();
  
  // Store all products fetched from API
  const [products, setProducts] = useState([]);

  // Fetch products from Fake Store API when component mounts
  useEffect(() => {
    // API call to get all products
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())          // Convert response to JSON
      .then(setProducts);               // Store in products state
    // Empty dependency array [] means this runs only once on mount
  }, []);

  // Calculate filtered and sorted products
  // useMemo optimizes performance - only recalculates when dependencies change
  const filtered = useMemo(() => {
    // Start with all products
    let data = products.filter(p => 
      // Filter by search query (case-insensitive)
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    
    // Filter by category if not "all"
    if (category !== "all") {
        // API returns "men's clothing" but we show "men" to user
        if (category === "men") 
          data = data.filter(p => p.category === "men's clothing");
        else if (category === "women") 
          data = data.filter(p => p.category === "women's clothing");
        else 
          data = data.filter(p => p.category === category);
    }
    
    // Sort by price if selected
    if (sort === "low") 
      data.sort((a,b) => a.price - b.price);   // Low to High
    if (sort === "high") 
      data.sort((a,b) => b.price - a.price);   // High to Low
    
    return data;
    // Recalculate only if these values change
  }, [products, search, category, sort]);

  return (
    <div>
      {/* FILTER BAR SECTION - User controls for searching and filtering */}
      <section className="filter-bar">
        <div className="filter-container">
          {/* Category filter options */}
          <div className="filter-group">
            <h3>Categories</h3>
            {/* Map through categories and create radio buttons */}
            {['all', 'men', 'women', 'electronics', 'jewelery'].map(c => (
              <label key={c} className="filter-label">
                <input 
                  type="radio" 
                  name="cat" 
                  onChange={() => setCategory(c)}        // Update category on selection
                  checked={category === c}               // Mark current category as checked
                />
                <span style={{textTransform: 'capitalize'}}>{c}</span>
              </label>
            ))}
          </div>

          {/* Price sorting dropdown */}
          <div className="filter-group">
            <h3>Sort By</h3>
            <select 
                style={{padding: '8px', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)'}} 
                onChange={(e) => setSort(e.target.value)}  // Update sort on selection
            >
              <option value="none">Latest Products</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID SECTION - Display filtered products */}
      <main className="grid-container">
        <div className="products-grid">
          {/* Map through filtered products and create ProductCard for each */}
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </div>
  );
}