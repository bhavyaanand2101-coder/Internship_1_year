import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // Get auth functions from context
  const { login, signup, googleLogin } = useAuth();
  
  // Toggle between login and signup mode
  const [isSignup, setIsSignup] = useState(false);
  
  // Store email input value
  const [email, setEmail] = useState("");
  
  // Store password input value
  const [pass, setPass] = useState("");

  // Handle form submission for login/signup
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh
    try {
      // If in signup mode, create new account; otherwise login
      isSignup ? await signup(email, pass) : await login(email, pass);
      // If successful, AuthContext updates user state and redirects to home
    } catch (err) { 
      // If error (wrong password, email exists, etc), show error message
      alert(err.message); 
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-box">
        {/* Title changes based on login/signup mode */}
        <h2>{isSignup ? "Join Us" : "Welcome Back"}</h2>
        
        {/* Login/Signup form */}
        <form onSubmit={handleSubmit}>
          {/* Email input - stores in email state */}
          <input 
            className="auth-input" 
            type="email" 
            placeholder="Email" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          {/* Password input - stores in pass state */}
          <input 
            className="auth-input" 
            type="password" 
            placeholder="Password" 
            onChange={e => setPass(e.target.value)} 
            required 
          />
          
          {/* Submit button - text changes based on mode */}
          <button type="submit" className="btn btn-primary">
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>
        
        <p style={{margin: '15px 0', fontSize: '12px', color: 'gray'}}>OR</p>
        
        {/* Google sign-in button */}
        <button onClick={googleLogin} className="btn" style={{width: '100%', background: 'white', border: '1px solid #ddd', color: '#444'}}>
          Continue with Google
        </button>
        
        {/* Toggle between login and signup modes */}
        <p 
          className="toggle-text" 
          onClick={() => setIsSignup(!isSignup)} 
          style={{marginTop: '20px', cursor: 'pointer', color: 'var(--primary)'}}
        >
          {isSignup ? "Have an account? Login" : "New here? Create Account"}
        </p>
      </div>
    </div>
  );
}