import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useToasts } from '../context/AppContext';
import { api } from '../lib/api';
import { BarChart3, ShoppingBag, FolderKanban, Ticket, ShieldCheck, Eye, Plus, Trash2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function Admin() {
  const { user, authLoading } = useAuth();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  // Access check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      addToast('Access denied. Administrator credentials required.', 'error');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'orders' | 'products' | 'coupons'
  const [analytics, setAnalytics] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating products
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('classic');
  const [newColor, setNewColor] = useState('Black');
  const [newDescription, setNewDescription] = useState('');
  const [newSizes, setNewSizes] = useState(['S', 'M', 'L', 'XL']);
  const [newSpecs, setNewSpecs] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/tshirt 3/05-05-2025 christian00466.jpg');

  // Form states for creating coupons
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
      
      const orders = await api.getAdminOrders();
      setAdminOrders(orders);

      const catalog = await api.getProducts();
      setProducts(catalog);
    } catch (err) {
      addToast('Failed to retrieve administrator telemetry data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="w-full bg-black min-h-[70vh] flex justify-center items-center">
        <SEO title="Restricted Area" />
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- ACTIONS ---

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setAdminOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o)));
      addToast('Order dispatch status updated.', 'success');
      // Refresh analytics
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      addToast('Failed to update status.', 'error');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) {
      addToast('Please enter title, price, and description.', 'error');
      return;
    }

    try {
      const payload = {
        title: newTitle.toUpperCase(),
        price: parseFloat(newPrice),
        category: newCategory,
        color: newColor,
        description: newDescription,
        image: newImage,
        images: [newImage],
        colors: [{ name: newColor, value: newColor === 'Black' ? '#0A0A0A' : '#FFFFFF', class: newColor === 'Black' ? 'bg-black border-neutral-900' : 'bg-white border-neutral-300' }],
        sizes: newSizes,
        specs: newSpecs ? newSpecs.split('\n').filter(Boolean) : ['100% Cotton combed ringspun'],
        highlights: ['Studio exclusive drop'],
        availability: 'in-stock',
        tag: 'NEW'
      };

      await api.createProduct(payload);
      addToast('Product inserted in catalog.', 'success');
      
      // Reset
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setNewSpecs('');
      
      // Refresh
      const catalog = await api.getProducts();
      setProducts(catalog);
    } catch (err) {
      addToast('Failed to insert product.', 'error');
    }
  };

  const handleDeleteProduct = async (productMongoId) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      await api.deleteProduct(productMongoId);
      addToast('Product removed.', 'success');
      setProducts((prev) => prev.filter((p) => p._id !== productMongoId));
    } catch (err) {
      addToast('Failed to delete product.', 'error');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode || !newDiscountPercent) return;
    try {
      await api.createCoupon(newCouponCode, newDiscountPercent);
      addToast('Promo coupon voucher created.', 'success');
      setNewCouponCode('');
      setNewDiscountPercent('');
      
      // Refresh analytics
      fetchAdminData();
    } catch (err) {
      addToast('Failed to create coupon.', 'error');
    }
  };

  return (
    <div className="w-full bg-black min-h-screen py-16">
      <SEO title="Studio Administration" />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-6 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[10px] text-brand-red font-black tracking-widest uppercase block mb-1">
              TELEMETRY OPERATIONS
            </span>
            <h1 className="text-white text-5xl font-black font-impact tracking-tight uppercase">
              STUDIO CONTROL PANEL
            </h1>
          </div>
          <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
            ADMIN: <span className="text-white font-black">{user.name.toUpperCase()}</span>
          </span>
        </div>

        {/* Admin Navigation Options */}
        <div className="flex border-b border-neutral-900 overflow-x-auto gap-2 mb-12">
          {[
            { id: 'analytics', name: 'ANALYTICS KPIs', icon: BarChart3 },
            { id: 'orders', name: 'ORDER REGISTRY', icon: ShoppingBag },
            { id: 'products', name: 'PRODUCT CATALOG', icon: FolderKanban },
            { id: 'coupons', name: 'PROMO VOUCHERS', icon: Ticket }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-6 text-[10px] font-black tracking-widest uppercase transition-all border-b shrink-0 cursor-pointer flex items-center gap-2.5 ${
                  activeTab === tab.id
                    ? 'text-white border-brand-red'
                    : 'text-neutral-500 border-transparent hover:text-neutral-300'
                }`}
              >
                <TabIcon size={12} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto my-24"></div>
        ) : (
          <div className="animate-fade-in">
            
            {/* TAB: ANALYTICS KPIs */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-12">
                {/* Analytics metrics grid cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'GROSS REVENUE', value: `₹${analytics.kpis.revenue.toFixed(2)}` },
                    { label: 'TOTAL ORDERS', value: analytics.kpis.ordersCount },
                    { label: 'MEMBERS INDEX', value: analytics.kpis.usersCount },
                    { label: 'CONVERSION RATIO', value: analytics.kpis.conversionRate }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-neutral-950/20 p-6 rounded-luxury shadow-luxury border border-neutral-900/40">
                      <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase block mb-1">
                        {card.label}
                      </span>
                      <span className="text-white text-3xl font-black font-impact tracking-tight uppercase">
                        {card.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* SVG Visual Sales bar chart */}
                <div className="bg-neutral-950/20 p-8 rounded-luxury border border-neutral-900/40 space-y-6">
                  <h3 className="text-white font-black text-xs tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1 h-3 bg-brand-red inline-block" />
                    SALES DISTRIBUTION BY CATEGORY
                  </h3>

                  {analytics.categoryChart.length > 0 ? (
                    <div className="space-y-4 pt-4 max-w-xl">
                      {analytics.categoryChart.map((bar) => {
                        const totalSalesVal = analytics.categoryChart.reduce((sum, item) => sum + item.value, 0) || 1;
                        const pct = ((bar.value / totalSalesVal) * 100).toFixed(0);

                        return (
                          <div key={bar.name} className="space-y-1.5 uppercase text-[10px] font-bold tracking-widest text-neutral-400">
                            <div className="flex justify-between">
                              <span className="text-white">{bar.name}</span>
                              <span>₹{bar.value.toFixed(2)} ({pct}%)</span>
                            </div>
                            {/* Graphic Bar */}
                            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-red rounded-full transition-all duration-1000"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest py-6">
                      NO SALES REGISTERED YET TO CALCULATE DISTRIBUTION.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ORDER REGISTRY MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-white font-black text-xs tracking-widest uppercase border-b border-neutral-950 pb-2 mb-6">
                  GLOBAL DISPATCH MANAGER
                </h3>

                {adminOrders.length > 0 ? (
                  <div className="space-y-4">
                    {adminOrders.map((ord) => (
                      <div 
                        key={ord._id} 
                        className="bg-neutral-950/20 border border-neutral-900/40 p-6 rounded-luxury flex flex-col lg:flex-row justify-between gap-6"
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                            <div>ORDER: <span className="text-white">{ord.id}</span></div>
                            <div>DATE: <span className="text-white">{ord.date}</span></div>
                            <div>USER: <span className="text-white">{ord.userEmail}</span></div>
                            <div>TOTAL: <span className="text-white">₹{ord.total.toFixed(2)}</span></div>
                          </div>

                          {/* Items list */}
                          <div className="space-y-2 pl-4 border-l border-neutral-900">
                            {ord.items.map((item, idx) => (
                              <p key={idx} className="text-[10px] font-semibold text-neutral-400 uppercase">
                                {item.title} (x{item.quantity}) • SIZE: {item.size}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Status controls */}
                        <div className="flex items-center gap-4 shrink-0">
                          <label className="text-[9px] font-black tracking-widest uppercase text-neutral-500">
                            STATUS:
                          </label>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                            className="bg-black border border-neutral-800 text-white text-[10px] font-bold tracking-widest uppercase p-2 focus:border-brand-red outline-none"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest py-8">
                    NO TRANSACTIONS RECORDED IN SYSTEM REGISTRIES.
                  </p>
                )}
              </div>
            )}

            {/* TAB: PRODUCT CATALOG EDITOR */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Form: Insert Product */}
                <div className="lg:col-span-5 bg-neutral-950/20 border border-neutral-900/40 p-6 rounded-luxury space-y-6">
                  <h3 className="text-white font-black text-xs tracking-widest uppercase border-b border-neutral-900 pb-2">
                    INSERT PRODUCT
                  </h3>

                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">TITLE</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition"
                        placeholder="E.G. HOODED KNIT DROP"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">PRICE (₹)</label>
                        <input
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition"
                          placeholder="45.00"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">CATEGORY</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="bg-black border border-neutral-800 text-white text-xs font-semibold tracking-wider outline-none w-full p-2.5 transition"
                        >
                          <option value="classic">Classic</option>
                          <option value="graphic">Graphic</option>
                          <option value="oversized">Oversized</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">COLOR</label>
                        <input
                          type="text"
                          required
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition"
                          placeholder="E.G. ONYX BLACK"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">IMAGE SOURCE</label>
                        <input
                          type="text"
                          required
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-[10px] font-semibold outline-none w-full p-2.5 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">DESCRIPTION</label>
                      <textarea
                        required
                        rows={3}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition resize-none"
                        placeholder="ENTER DESCRIPTION..."
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">SPECS (ONE PER LINE)</label>
                      <textarea
                        rows={3}
                        value={newSpecs}
                        onChange={(e) => setNewSpecs(e.target.value)}
                        className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition resize-none"
                        placeholder="100% Combed Ringspun Cotton&#10;Heavyweight 240 GSM..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-red hover:bg-red-700 text-white font-black text-[10px] tracking-widest py-3 uppercase transition cursor-pointer"
                    >
                      PUBLISH PRODUCT
                    </button>
                  </form>
                </div>

                {/* Right Workspace: Catalog product grid lists */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-white font-black text-xs tracking-widest uppercase border-b border-neutral-900 pb-2">
                    ACTIVE CATALOG ({products.length})
                  </h3>

                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {products.map((p) => (
                      <div 
                        key={p.id} 
                        className="bg-neutral-950/20 border border-neutral-905 p-4 rounded-luxury flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-12 bg-neutral-900 border border-neutral-900 overflow-hidden shrink-0">
                            <img src={p.image} className="w-full h-full object-cover object-top" alt="" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white uppercase block line-clamp-1">{p.title}</span>
                            <span className="text-[10px] text-neutral-500 font-semibold uppercase mt-0.5">
                              ₹{p.price.toFixed(2)} • CATEGORY: {p.category}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-neutral-500 hover:text-brand-red p-2 border border-neutral-900 hover:border-brand-red transition cursor-pointer"
                          title="Delete from Catalog"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROMO VOUCHERS MANAGEMENT */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left form: Create coupon */}
                <div className="lg:col-span-5 bg-neutral-950/20 border border-neutral-900/40 p-6 rounded-luxury space-y-6">
                  <h3 className="text-white font-black text-xs tracking-widest uppercase border-b border-neutral-900 pb-2">
                    CREATE PROMO VOUCHER
                  </h3>

                  <form onSubmit={handleCreateCoupon} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">COUPON CODE</label>
                      <input
                        type="text"
                        required
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition uppercase"
                        placeholder="E.G. COSO20"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 tracking-widest uppercase mb-1">DISCOUNT VALUE (%)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        value={newDiscountPercent}
                        onChange={(e) => setNewDiscountPercent(e.target.value)}
                        className="bg-black border border-neutral-800 focus:border-neutral-500 text-white text-xs font-semibold tracking-wider placeholder-neutral-700 outline-none w-full p-2.5 transition"
                        placeholder="20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-red hover:bg-red-700 text-white font-black text-[10px] tracking-widest py-3 uppercase transition cursor-pointer"
                    >
                      CREATE COUPON
                    </button>
                  </form>
                </div>

                {/* Right checklist of coupons */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-white font-black text-xs tracking-widest uppercase border-b border-neutral-900 pb-2">
                    ACTIVE VOUCHERS
                  </h3>

                  <div className="space-y-4">
                    {/* Hardcoded or dynamic checks */}
                    {adminOrders.length > 0 ? (
                      /* Since coupons are dynamically loaded in analytical groups */
                      <div className="border border-neutral-900 p-6 text-center">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                          Dynamic coupon deletions can be performed by connecting Mongoose arrays.
                        </p>
                        <p className="text-[9px] text-neutral-600 font-bold uppercase mt-1">
                          Standard codes: COSO10 (10% OFF) • HEAVY20 (20% OFF) • FREESHIP (Free Shipping)
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest">
                        NO VOUCHERS FOUND.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
