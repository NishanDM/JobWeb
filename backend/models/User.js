// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  type: String // 'technician' or 'job_creator'
});

const User = mongoose.model('User', userSchema);
module.exports = User;

