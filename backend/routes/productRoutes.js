const express = require('express');
const router = express.Router();
const { getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController.js');
const requireRole = require('../middleware/roleMiddleware.js');
const auth = require('../middleware/authMiddleware.js');

router.get('/', getProduct);
router.post('/', auth, requireRole('admin'), createProduct);
router.put('/:id', auth, requireRole('admin'), updateProduct);
router.delete('/:id', auth, requireRole('admin'), deleteProduct);

module.exports = router;