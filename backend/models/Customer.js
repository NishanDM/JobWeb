const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  prefix: { type: String },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  company: { type: String },
  address: { type: String },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
