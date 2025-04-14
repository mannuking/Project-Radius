const express = require('express');
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get aging report
router.get('/aging', protect, reportController.getAgingReport);

// Region report route
router.get('/regions', protect, reportController.getRegionReport);

module.exports = router; 
