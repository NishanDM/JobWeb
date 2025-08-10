

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },  // previously: email
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
