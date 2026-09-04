const Product = require('../models/Product.js');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
};

const createProduct = async (req, res) => {
  try{
    const { name, desciption, price, stock, category, imageURL } = req.body;

    const product = await Product.create({ 
      name,
      description,
      price,
      stock,
      category,
      imageURL,
      createdBy: req.user.id
     });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try{
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product){
      return res.status(404).json({ message: 'Product not found' });
    }
  }catch(err){
    res.status(401).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try{
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  }catch(err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };