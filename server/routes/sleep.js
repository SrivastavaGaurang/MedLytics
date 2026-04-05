// routes/sleep.js — Analysis only, no database (Firebase handles persistence)
import express from 'express';
import analyzeSleepDisorder from '../utils/analyzeSleepDisorder.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// POST /api/sleep/analyze — Run analysis, return result (no DB save)
router.post('/analyze', async (req, res) => {
  try {
    const formData = req.body;

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ message: 'Form data is required' });
    }

    const analysisResult = analyzeSleepDisorder(formData);

    res.status(200).json({
      ...formData,
      result: analysisResult,
    });
  } catch (error) {
    console.error('Error analyzing sleep:', error);
    res.status(500).json({ message: 'Server error during sleep analysis' });
  }
});

export default router;