import { useApp } from "../context/AppContext";

export default function Cart() {
  // Get cart items and cart management functions from context
  const { cart, removeFromCart, updateQty } = useApp();
  
  // Calculate total price using reduce method
  // reduce iterates through cart and sums up (price × quantity) for each item
  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  // s = sum accumulator (starts at 0)
  // i = current item
  // s + (i.price * i.qty) = add item's total price to running sum

  return (
    <div className="cart-page">
      <h2 style={{marginBottom: '25px', color: 'var(--text-main)'}}>Your Shopping Bag</h2>
      <div className="cart-card">
        {/* Check if cart is empty */}
        {cart.length === 0 ? (
          // Show empty cart message if no items
          <p style={{textAlign: 'center', padding: '40px'}}>Your bag is empty</p> 
        ) : (
          // Show cart items if there are items
          <>
            {/* Map through each item in cart and display it */}
            {cart.map(item => (
              <div key={item.id} className="cart-item-row">
                {/* Product image */}
                <div className="cart-img-box">
                  <img src={item.image} alt="" />
                </div>
                
                {/* Product info (title and price) */}
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p style={{color: 'var(--primary)', fontWeight: '700'}}>₹{item.price}</p>
                </div>
                
                {/* Quantity controls - Decrease, Show Qty, Increase */}
                <div className="qty-controls">
                  {/* Decrease quantity button */}
                  <button 
                    className="btn" 
                    style={{padding: '2px 10px'}} 
                    onClick={() => updateQty(item.id, -1)}
                  >
                    -
                  </button>
                  
                  {/* Display current quantity */}
                  <span style={{fontWeight: '700'}}>{item.qty}</span>
                  
                  {/* Increase quantity button */}
                  <button 
                    className="btn" 
                    style={{padding: '2px 10px'}} 
                    onClick={() => updateQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                
                {/* Remove item from cart button */}
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="btn" 
                  style={{color: 'red', background: 'none'}}
                >
                  Remove
                </button>
              </div>
            ))}
            
            {/* Cart summary section - Total and Checkout */}
            <div style={{marginTop: '30px', textAlign: 'right'}}>
              {/* Display total price with 2 decimal places */}
              <h3 style={{color: 'var(--text-main)'}}>Total: ₹{total.toFixed(2)}</h3>
              {/* Checkout button (currently UI only) */}
              <button className="btn btn-primary" style={{width: '200px'}}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}