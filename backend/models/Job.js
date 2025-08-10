const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobRef: { type: String, required: true, unique: true },
  createdDate: { type: String, required: true },
  jobFlag: String,
  createdBy: String,

  // 🔹 Prefix for name
  customerPrefix: String,

  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerCompany: String,
  customerAddress: String,

  deviceType: String,
  model: String,
  series: String,
  emei: String,
  capacity: String,
  color: String,
  passcode: String,
  underWarranty: String,

  faults: [String], // ✅ Changed from String → Array of Strings
  technician: String,
  status: String,
  repaired_accessories: [String], // ✅ Changed from String → Array of Strings
  estimatedCompletion: String,
  estimatedCost: String,
  remarks: String,

  // 🔹 Job progress
  jobProgress: {
    type: String,
    default: 'Just_started'
  },

  // ✅ NEW FIELDS
  simTrayCollected: {
    type: Boolean,
    default: false
  },
  simTraySerial: {
    type: String,
    default: ''
  },

  // ✅ Newly added fields
  customer_reported: {
    type: [String],
    default: []
  },
  collected_accessories: {
    type: [String],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
