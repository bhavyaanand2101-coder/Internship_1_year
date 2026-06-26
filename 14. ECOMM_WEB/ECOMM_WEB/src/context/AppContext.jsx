// Import React Context API
import { createContext, useContext, useState } from "react";

// Create a Context for app-wide state (cart, search, theme, filters)
const AppContext = createContext();

// AppProvider component - manages shopping cart and app settings globally
export const AppProvider = ({ children }) => {
  // State for shopping cart - array of product objects with quantities
  const [cart, setCart] = useState([]);
  
  // State for search input - user's search query
  const [search, setSearch] = useState("");
  
  // State for dark mode toggle - true = dark mode, false = light mode
  const [dark, setDark] = useState(false);
  
  // State for category filter - which product category is selected
  const [category, setCategory] = useState("all");
  
  // State for price sorting - "none", "low", or "high"
  const [sort, setSort] = useState("none");

  // Function to add product to cart or increase quantity if already there
  const addToCart = (p) => {
    setCart(prev => {
      // Check if product already exists in cart
      const exist = prev.find(x => x.id === p.id);
      
      // If exists, increase quantity by 1
      if (exist) 
        return prev.map(x => x.id === p.id ? {...x, qty: x.qty + 1} : x);
      
      // If new product, add to cart with quantity 1
      return [...prev, {...p, qty: 1}];
    });
  };

  // Function to remove product from cart by ID
  const removeFromCart = (id) => setCart(prev => prev.filter(x => x.id !== id));
  
  // Function to update product quantity (add or subtract)
  // val is +1 to increase or -1 to decrease
  const updateQty = (id, val) => {
    setCart(prev => prev.map(x => 
      x.id === id ? {...x, qty: Math.max(1, x.qty + val)} : x
      // Math.max(1, ...) ensures quantity never goes below 1
    ));
  };

  // Provide all app state and functions to child components
  return (
    <AppContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQty, 
      search, setSearch, 
      dark, setDark, 
      category, setCategory, 
      sort, setSort 
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access app context from any component
export const useApp = () => useContext(AppContext);