// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import User from '../models/User.js';

const router = express.Router();

// ✅ Auth0 middleware (for protected routes)
const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json` // Replace with your Auth0 domain
  }),
  audience: 'YOUR_API_IDENTIFIER', // Replace with your API identifier
  issuer: `https://YOUR_AUTH0_DOMAIN/`, // Replace with your Auth0 domain
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
        process.env.JWT_SECRET,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// ✅ Protected route - Get user profile (Auth0)
router.get('/profile', checkJwt, (req, res) => {
  res.json({
    id: req.user.sub,
    name: 'Test User',
    email: 'user@example.com',
    created_at: '2025-01-01'
  });
});

// ✅ Protected route - Update user profile (Auth0)
router.put('/profile', checkJwt, (req, res) => {
  const { name, email } = req.body;

  res.json({
    id: req.user.sub,
    name,
    email,
    updated_at: new Date().toISOString()
  });
});

export default router;
