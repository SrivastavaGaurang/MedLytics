// routes/contactRoutes.js
import express from 'express';
import { check, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';

const router = express.Router();

// @route   POST api/contact
// @desc    Submit a contact form
// @access  Public
router.post(
  '/',
  [
    // Validation middleware
    check('firstName', 'First name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('message', 'Message is required').not().isEmpty().trim()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create new contact form submission
      const { firstName, lastName, email, phone, subject, message } = req.body;

      const newContact = new Contact({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
      });

      // Save to database
      const contact = await newContact.save();

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Contact form submitted successfully',
        contactId: contact._id
      });
    } catch (err) {
      console.error('Error submitting contact form:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error while processing your request'
      });
    }
  }
);

// @route   GET api/contact
// @desc    Get all contact submissions
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check if user has admin role (you'll need to implement this)
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/contact/:id
// @desc    Get contact by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/contact/:id
// @desc    Update contact status
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    // Find and update the contact
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error('Error updating contact:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;