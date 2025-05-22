// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import User from '../models/User.js';

const router = express.Router();

// ✅ Auth0 middleware (for protected routes) - using environment variables
const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE || 'YOUR_API_IDENTIFIER',
  issuer: `https://${process.env.AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'}/`,
  algorithms: ['RS256']
});

// ✅ Public route - Register new user (local JWT)
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    } catch (err) {
      console.error('Error in user registration:', err.message);
      res.status(500).json({ 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }
);

// ✅ Protected route - Get user profile (Auth0)
router.get('/profile', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub;
    
    // Try to find user in database
    let user = await User.findOne({ authId }).select('-password');
    
    if (!user) {
      // If user doesn't exist in database, create a basic profile from Auth0 data
      user = {
        id: authId,
        authId: authId,
        name: req.user.name || 'User',
        email: req.user.email || `${authId}@auth0.com`,
        created_at: new Date().toISOString()
      };
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ 
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ✅ Protected route - Update user profile (Auth0)
router.put('/profile', checkJwt, async (req, res) => {
  try {
    const { name, email, preferences } = req.body;
    const authId = req.user.sub;

    // Find or create user
    let user = await User.findOne({ authId });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        authId,
        name: name || 'User',
        email: email || `${authId}@auth0.com`,
        password: 'Auth0User' // Placeholder for Auth0 users
      });
    } else {
      // Update existing user
      if (name) user.name = name;
      if (email) user.email = email;
      if (preferences) user.preferences = preferences;
      user.updatedAt = new Date();
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      ...userResponse,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ 
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ✅ Protected route - Get user's health analysis history
router.get('/health-history', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub;
    
    const user = await User.findOne({ authId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // This would need to be implemented based on your health analysis models
    // For now, returning a placeholder response
    res.json({
      userId: user._id,
      authId: authId,
      analyses: {
        depression: [], // Would be populated from DepressionAnalysis model
        anxiety: [],    // Would be populated from AnxietyAnalysis model
        sleep: [],      // Would be populated from SleepAnalysis model
        bmi: []         // Would be populated from BMIAnalysis model
      },
      totalAnalyses: 0,
      lastAnalysis: null
    });
  } catch (err) {
    console.error('Error fetching health history:', err.message);
    res.status(500).json({ 
      message: 'Server error fetching health history',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ✅ Protected route - Delete user account
router.delete('/account', checkJwt, async (req, res) => {
  try {
    const authId = req.user.sub;
    
    const user = await User.findOne({ authId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you'd also want to delete related data
    // like health analyses, but be careful about data retention policies
    await User.findByIdAndDelete(user._id);

    res.json({ 
      message: 'User account deleted successfully',
      deletedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error deleting user account:', err.message);
    res.status(500).json({ 
      message: 'Server error deleting account',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ✅ Public route - Check if email exists (for registration flow)
router.post('/check-email', [
  check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    res.json({ exists: !!user });
  } catch (err) {
    console.error('Error checking email:', err.message);
    res.status(500).json({ 
      message: 'Server error checking email',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

export default router;