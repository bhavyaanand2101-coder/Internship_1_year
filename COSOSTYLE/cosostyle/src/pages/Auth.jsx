import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth, useToasts } from '../context/AppContext';
import SEO from '../components/SEO';

export default function Auth() {
  const { user, login, register } = useAuth();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialTab = searchParams.get('tab') || 'login';
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync tab state with URL parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'login' || tabParam === 'register') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'login') {
        await login(email, password, rememberMe);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      // Ignored: toast displayed in AppContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen py-16 flex flex-col justify-center items-center px-4 select-none animate-fade-in">
      <SEO title={activeTab === 'login' ? 'Member Login' : 'Register Account'} />

      {/* Auth Panel */}
      <div className="w-full max-w-md bg-neutral-950/20 border border-neutral-900/40 p-8 rounded-luxury shadow-luxury space-y-8">
        
        {/* Toggle options */}
        <div className="flex border-b border-neutral-950 pb-4 justify-center gap-8 text-[11px] font-black tracking-widest uppercase">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-1 cursor-pointer transition ${
              activeTab === 'login' ? 'text-white border-b-2 border-brand-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            MEMBER LOGIN
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-1 cursor-pointer transition ${
              activeTab === 'register' ? 'text-white border-b-2 border-brand-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Brand visual header */}
        <div className="text-center">
          <h2 className="text-white text-3xl font-black font-impact tracking-widest uppercase">
            {activeTab === 'login' ? 'SIGN IN' : 'REGISTER'}
          </h2>
          <p className="text-neutral-500 text-[10px] tracking-widest font-black uppercase mt-1">
            {activeTab === 'login' ? 'ENTER STUDIO CREDENTIALS' : 'JOIN THE COSOSTYLE CATALOG'}
          </p>
        </div>

        {/* Input Forms */}
        <form onSubmit={handleAuthSubmit} className="space-y-5">
          {activeTab === 'register' && (
            <div>
              <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1.5">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black border border-neutral-900 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-3 px-4 rounded-full transition"
                placeholder="ALEX COSO"
              />
            </div>
          )}

          <div>
            <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1.5">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-neutral-900 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-3 px-4 rounded-full transition"
              placeholder="YOUR@EMAIL.COM"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1.5">PASSWORD</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-neutral-900 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-3 px-4 rounded-full transition"
              placeholder="••••••••"
            />
          </div>

          {activeTab === 'login' && (
            <div className="flex justify-between items-center text-[9px] font-bold tracking-widest uppercase text-neutral-500">
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-brand-red cursor-pointer"
                />
                <span>REMEMBER SESSION</span>
              </label>
              <Link to="/faq" className="hover:text-white transition">
                FORGOT PASSWORD?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-red-700 text-white font-black text-xs tracking-widest py-4 uppercase transition duration-300 rounded-full shadow-lg hover:shadow-brand-red/20 cursor-pointer disabled:opacity-40"
          >
            {loading ? 'AUTHENTICATING...' : activeTab === 'login' ? 'LOG IN' : 'REGISTER'}
          </button>
        </form>

        {/* Admin hint footnote */}
        <div className="border-t border-neutral-950 pt-4 text-center">
          <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">
            FOR TEST ADMIN DEMOS, SIGN IN OR REGISTER AS:<br />
            <span className="text-brand-red font-black">admin@cosostyle.com</span> / PASSWORD: <span className="text-white font-black">admin123</span>
          </p>
        </div>

      </div>
    </div>
  );
}
