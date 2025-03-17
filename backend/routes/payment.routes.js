const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/payment.controller');
const auth = require('../middleware/auth');

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);

module.exports = router;