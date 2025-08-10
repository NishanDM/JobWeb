const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');

router.post('/send', sendEmail);  // <-- This should match /api/email/send

module.exports = router;
