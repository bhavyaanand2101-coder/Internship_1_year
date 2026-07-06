import mongoose from 'mongoose';
import { isJsonDb } from '../config/db.js';
import { JsonModel } from '../config/jsonDb.js';

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  gender: { type: String, default: 'unisex' },
  tag: { type: String, default: 'NEW' },
  image: { type: String, required: true },
  images: [String],
  color: { type: String, required: true },
  colors: [{
    name: String,
    value: String,
    class: String
  }],
  sizes: [String],
  description: { type: String, required: true },
  specs: [String],
  highlights: [String],
  careInstructions: { type: String, default: 'Wash cold, hang to dry.' },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  availability: { type: String, default: 'in-stock' }
});

let mongooseProductModel;
const jsonProductModel = new JsonModel('products');

const getProductModel = () => {
  if (isJsonDb()) {
    return jsonProductModel;
  }
  if (!mongooseProductModel) {
    mongooseProductModel = mongoose.model('Product', productSchema);
  }
  return mongooseProductModel;
};

const ProductProxy = new Proxy({}, {
  get: (target, prop) => {
    const model = getProductModel();
    const val = model[prop];
    if (typeof val === 'function') {
      return val.bind(model);
    }
    return val;
  }
});

export default ProductProxy;
