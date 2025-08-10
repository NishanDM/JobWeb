const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @route   GET /api/notifications?username=Ethan%20Technician
// @desc    Get all notifications for a specific technician (by username)
// @access  Public or Protected (you can add middleware later)
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username query param required' });
    }

    const notifications = await Notification.find({ username }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// @route   POST /api/notifications
// @desc    Create/send a new notification to a technician
// @access  Public or Protected (you can add middleware later)
router.post('/', async (req, res) => {
  try {
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).json({ message: 'Username and message are required' });
    }

    const newNotification = new Notification({ username, message });
    await newNotification.save();

    res.status(201).json({ message: 'Notification sent', notification: newNotification });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ message: 'Server error creating notification' });
  }
});

module.exports = router;


