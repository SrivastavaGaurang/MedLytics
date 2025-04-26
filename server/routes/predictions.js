// routes/predictions.js
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const auth = require('../middleware/authMiddleware');

// POST route for sleep disorder prediction
router.post('/sleep-disorder', predictionController.predictSleepDisorder);

// GET route for user's prediction history (protected)
router.get('/history/sleep/:userId', auth, predictionController.getPredictionHistory);

module.exports = router;