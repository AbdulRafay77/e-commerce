const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController.js');
const requireRole = require('../middleware/roleMiddleware.js');
const auth = require('../middleware/authMiddleware.js');

router.post('/createOrder', auth, createOrder);
router.get('/getMyOrders', auth, getMyOrders);
router.get('/getAllOrders',auth, requireRole('admin'),  getAllOrders);

module.exports = router;