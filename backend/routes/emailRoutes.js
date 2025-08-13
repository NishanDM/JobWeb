const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// POST /api/email/sendJobStart
router.post('/sendJobStart', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ message: 'Recipient email and message are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // await transporter.sendMail({
    //   from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
    //   to,
    //   subject: subject || 'Job Started',
    //   text: message, // Plain text
    //   html: message.replace(/\n/g, '<br>'), // HTML version
    // });

    await transporter.sendMail({
        from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
        to,
        subject: subject || 'Job Started',
        html: message // now this will render HTML
      });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});


module.exports = router;
