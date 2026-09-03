const mongoose= require('mongoose');
const User = require('./User');
const { applyTimestamps } = require('./RefreshToken.js');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['clothing', 'food', 'books', 'electronics']
  },
  imageURL: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { Timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;