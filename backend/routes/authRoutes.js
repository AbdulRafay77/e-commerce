const express = require('express');
const router = express.Router();
const { signup, login, refresh, logout } = require('../controllers/authControllers.js');
const { loginLimiter, signupLimiter } = require('../middleware/rateLimiter.js');

router.post('/signup', signupLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;