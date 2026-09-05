const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController.js');
const requireRole = require('../middleware/roleMiddleware.js');
const auth = require('../middleware/authMiddleware.js');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/all',auth, requireRole('admin'),  getAllOrders);
router.put('/:id/status', auth, requireRole('admin'), updateOrderStatus);

module.exports = router;