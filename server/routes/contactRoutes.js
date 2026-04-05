// routes/contactRoutes.js — No database (contact submissions acknowledged only)
// Contact form submissions are handled client-side via Firebase Firestore.
// This route validates and acknowledges the request for backwards compatibility.
import express from 'express';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// POST /api/contact — Validate and acknowledge (client saves to Firestore)
router.post(
  '/',
  [
    check('firstName', 'First name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('message', 'Message is required').not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, email, phone, subject, message } = req.body;

      // No database save — client saves to Firestore directly
      console.log(`📧 Contact form received from ${firstName} (${email}): ${subject}`);

      res.status(200).json({
        success: true,
        message: 'Contact form submitted successfully. We will get back to you soon!',
      });
    } catch (err) {
      console.error('Error processing contact form:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error while processing your request',
      });
    }
  }
);

export default router;