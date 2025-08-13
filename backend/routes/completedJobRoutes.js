// routes/jobRoutes.js
const express = require('express');
const { getCompletedJobs } = require('../controllers/jobController');

const router = express.Router();

router.get('/completed', getCompletedJobs);

module.exports = router;
