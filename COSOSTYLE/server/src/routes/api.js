import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth, adminOnly } from '../middleware/auth.js';

// Models
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'coso_secret_token_100_percent_cotton';

// --- AUTH ROUTER ---

// Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during authentication.' });
  }
});

// Register
router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Auto-admin for admin@cosostyle.com
    const role = email.toLowerCase() === 'admin@cosostyle.com' ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      addresses: [],
      phone: ''
    });

    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: []
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Get profile
router.get('/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      addresses: user.addresses || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update Profile
router.put('/auth/profile', auth, async (req, res) => {
  const { name, phone } = req.body;
  try {
    const user = await User.findOne({ email: req.userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const updated = await User.findByIdAndUpdate(
      user._id,
      { name: name || user.name, phone: phone || user.phone },
      { new: true }
    );

    res.json({
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      addresses: updated.addresses || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

// Change Password
router.put('/auth/password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: req.userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error changing password.' });
  }
});

// --- ADDRESS WORKSPACE ---
router.post('/auth/addresses', auth, async (req, res) => {
  const address = req.body;
  try {
    const user = await User.findOne({ email: req.userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const currentAddresses = user.addresses || [];

    if (address.isDefault) {
      currentAddresses.forEach(a => a.isDefault = false);
    }

    if (address.id) {
      // Edit
      const idx = currentAddresses.findIndex(a => a.id === address.id);
      if (idx !== -1) {
        currentAddresses[idx] = address;
      }
    } else {
      // Create
      address.id = Date.now();
      if (currentAddresses.length === 0) address.isDefault = true;
      currentAddresses.push(address);
    }

    const updated = await User.findByIdAndUpdate(user._id, { addresses: currentAddresses }, { new: true });
    res.json(updated.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error saving address.' });
  }
});

router.delete('/auth/addresses/:id', auth, async (req, res) => {
  const addressId = parseInt(req.params.id);
  try {
    const user = await User.findOne({ email: req.userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    let currentAddresses = user.addresses || [];
    currentAddresses = currentAddresses.filter(a => a.id !== addressId);

    // If default was deleted
    if (currentAddresses.length > 0 && !currentAddresses.some(a => a.isDefault)) {
      currentAddresses[0].isDefault = true;
    }

    const updated = await User.findByIdAndUpdate(user._id, { addresses: currentAddresses }, { new: true });
    res.json(updated.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting address.' });
  }
});


// --- PRODUCTS ROUTER ---

router.get('/products', async (req, res) => {
  try {
    const list = await Product.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error loading catalog.' });
  }
});

router.get('/products/:id', async (req, res) => {
  const prodId = parseInt(req.params.id);
  try {
    const product = await Product.findOne({ id: prodId });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reviews API
router.get('/products/:id/reviews', async (req, res) => {
  const prodId = parseInt(req.params.id);
  try {
    const reviews = await Review.find({ productId: prodId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error loading reviews.' });
  }
});

router.post('/products/:id/reviews', async (req, res) => {
  const prodId = parseInt(req.params.id);
  const { user, rating, comment } = req.body;
  try {
    const review = await Review.create({
      productId: prodId,
      user,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to post review.' });
  }
});

router.put('/products/:id/reviews/:reviewId/like', async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { likes: (review.likes || 0) + 1, helpful: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to like review.' });
  }
});


// --- ORDERS ROUTER ---

router.get('/orders', auth, async (req, res) => {
  try {
    const list = await Order.find({ userEmail: req.userEmail });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error loading orders.' });
  }
});

router.post('/orders', auth, async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = await Order.create({
      userEmail: req.userEmail,
      date: new Date().toISOString().split('T')[0],
      status: 'Placed',
      trackingNumber: `1Z${Math.random().toString(36).substring(2, 17).toUpperCase()}`,
      ...orderData
    });
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order.' });
  }
});

router.put('/orders/:id/cancel', auth, async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (order.status !== 'Placed' && order.status !== 'Processing') {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered orders.' });
    }

    const updated = await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order.' });
  }
});


// --- COUPON VALIDATION ---
router.post('/coupons/validate', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
    if (!coupon) return res.status(400).json({ message: 'Coupon invalid or expired.' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error validating promo code.' });
  }
});


// --- ADMIN PANELS ROUTERS ---

// Analytics KPIs
router.get('/admin/analytics', auth, adminOnly, async (req, res) => {
  try {
    const allOrders = await Order.find({});
    const activeOrders = allOrders.filter(o => o.status !== 'Cancelled');
    
    const revenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const ordersCount = activeOrders.length;
    const usersCount = await User.countDocuments({ role: 'user' });

    // Category Sales Distribution calculation
    const categorySales = {};
    activeOrders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.category || 'classic';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      });
    });

    const categoryChartData = Object.keys(categorySales).map(key => ({
      name: key.toUpperCase(),
      value: categorySales[key]
    }));

    res.json({
      kpis: {
        revenue,
        ordersCount,
        usersCount,
        conversionRate: ordersCount > 0 ? ((ordersCount / (usersCount || 1)) * 10).toFixed(1) + '%' : '0%'
      },
      categoryChart: categoryChartData
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics extraction failed.' });
  }
});

// Manage All Orders
router.get('/admin/orders', auth, adminOnly, async (req, res) => {
  try {
    const list = await Order.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load order registry.' });
  }
});

router.put('/admin/orders/:id/status', auth, adminOnly, async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status.' });
  }
});

// Manage Catalog Products
router.post('/admin/products', auth, adminOnly, async (req, res) => {
  try {
    const list = await Product.find({});
    const nextId = list.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
    
    const newProduct = await Product.create({
      id: nextId,
      ...req.body
    });
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

router.put('/admin/products/:id', auth, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

router.delete('/admin/products/:id', auth, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

// Manage Coupon list
router.post('/admin/coupons', auth, adminOnly, async (req, res) => {
  const { code, discountPercent } = req.body;
  try {
    const newCoupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountPercent: parseFloat(discountPercent) / 100,
      active: true
    });
    res.json(newCoupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create coupon.' });
  }
});

router.delete('/admin/coupons/:id', auth, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete coupon.' });
  }
});

export default router;
