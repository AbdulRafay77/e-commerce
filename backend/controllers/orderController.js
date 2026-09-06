const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');

const createOrder = async (req, res) => {
  try{
    const { items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items){
      const product = await Product.findById(item.productId);

      if (!product){
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity){
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount
    });

    res.status(201).json(order);

  }catch(err){
    res.status(400).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try{
    const myOrders = await Order.find({ user: req.user.id }).populate('items.product');
    res.status(200).json(myOrders);

  }catch(err){
    res.status(400).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  
  try{
    const allOrders = await Order.find().populate('items.product');
    res.status(200).json(allOrders);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status : req.body.status },
      { new: true, runValidators: true }
    );

    if (!order){
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };