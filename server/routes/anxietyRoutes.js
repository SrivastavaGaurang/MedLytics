// routes/anxietyRoutes.js - Updated version
import express from 'express';
import { expressjwt } from 'express-jwt'; // Fixed import
import jwksRsa from 'jwks-rsa';

const router = express.Router();

// Setup Auth0 authentication middleware
const checkJwt = expressjwt({ // Fixed usage
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

// Example route to get anxiety assessment data
router.get('/assessments', checkJwt, (req, res) => {
  // Here you would typically query your database
  // For now, returning mock data
  res.json([
    { id: 1, date: '2025-05-01', score: 7, notes: 'Feeling anxious about exams' },
    { id: 2, date: '2025-05-05', score: 5, notes: 'Slightly better today' },
    { id: 3, date: '2025-05-10', score: 3, notes: 'Sleeping well, anxiety decreased' }
  ]);
});

// Route to submit new anxiety assessment
router.post('/assessments', checkJwt, (req, res) => {
  // Here you would save the new assessment to your database
  const { score, notes } = req.body;
  
  // Mock response - normally you'd save to DB and return the new record
  res.status(201).json({
    id: Math.floor(Math.random() * 1000),
    date: new Date().toISOString().split('T')[0],
    score,
    notes,
    userId: req.user.sub // from Auth0
  });
});

export default router;