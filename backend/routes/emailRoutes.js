const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// POST /api/email/sendJobStart
router.post('/sendJobStart', async (req, res) => {
  const { to, subject, jobDetails } = req.body;

  if (!to || !jobDetails) {
    return res.status(400).json({ message: 'Recipient email and job details are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build a detailed email message
    const message = `
      Dear ${jobDetails.customerName},

      Your job (${jobDetails.jobRef}) has been started.

      📱 Device Details:
      - Type: ${jobDetails.deviceType}
      - Model: ${jobDetails.model}
      - Series: ${jobDetails.series}
      - Color: ${jobDetails.color}

      ⚠ Reported Faults:
      ${jobDetails.faults.join(', ')}

      🗓 Estimated Completion: ${jobDetails.estimatedCompletion || 'N/A'}

      Thank you for choosing our service!
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: subject || 'Job Started',
      text: message,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});


module.exports = router;
