// controllers/jobController.js
const Job = require('../models/Job');

const getCompletedJobs = async (req, res) => {
  try {
    // ✅ Filter using jobProgress
    const completedJobs = await Job.find({ jobProgress: 'Completed' }).sort({ createdAt: -1 });
    res.json(completedJobs);
  } catch (error) {
    console.error('Error fetching completed jobs:', error);
    res.status(500).json({ message: 'Server error fetching completed jobs' });
  }
};

module.exports = { getCompletedJobs };
