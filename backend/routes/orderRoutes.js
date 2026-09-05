const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController.js');
const requireRole = require('../middleware/roleMiddleware.js');
const auth = require('../middleware/authMiddleware.js');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/all',auth, requireRole('admin'),  getAllOrders);

module.exports = router;