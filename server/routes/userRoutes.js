// routes/userRoutes.js
import express from 'express';
import { expressjwt } from 'express-jwt'; // Fixed this line
import jwksRsa from 'jwks-rsa';

const router = express.Router();

// Setup Auth0 authentication middleware (similar to anxietyRoutes)
const checkJwt = expressjwt({ // Fixed this line
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

// Route to get user profile
router.get('/profile', checkJwt, (req, res) => {
  // Would typically fetch from database
  // For now, return mock data based on the authenticated user
  res.json({
    id: req.user.sub,
    name: 'Test User',
    email: 'user@example.com',
    created_at: '2025-01-01'
  });
});

// Route to update user profile
router.put('/profile', checkJwt, (req, res) => {
  const { name, email } = req.body;
  
  // Would typically update the database
  res.json({
    id: req.user.sub,
    name,
    email,
    updated_at: new Date().toISOString()
  });
});

export default router;