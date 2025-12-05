// routes/oauth.js - OAuth 2.0 Authentication Routes
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Configure Passport Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/oauth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (!user) {
                        // Create new user
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            authId: `google|${profile.id}`,
                            avatar: profile.photos[0]?.value,
                            emailVerified: true, // Google emails are verified
                        });
                        await user.save();
                    } else {
                        // Update last login
                        user.lastLogin = Date.now();
                        await user.save();
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
}

// Configure Passport Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/oauth/facebook/callback',
                profileFields: ['id', 'displayName', 'emails', 'photos'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (!user) {
                        // Create new user
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            authId: `facebook|${profile.id}`,
                            avatar: profile.photos[0]?.value,
                            emailVerified: true,
                        });
                        await user.save();
                    } else {
                        // Update last login
                        user.lastLogin = Date.now();
                        await user.save();
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
}

// @route   GET /api/oauth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @route   GET /api/oauth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed` }),
    (req, res) => {
        try {
            // Generate JWT token
            const payload = {
                user: {
                    id: req.user.id,
                },
            };

            if (!process.env.JWT_SECRET) {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_config`);
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '24h' },
                (err, token) => {
                    if (err) {
                        console.error('JWT signing error:', err);
                        return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
                    }

                    // Redirect to frontend with token
                    const userData = {
                        id: req.user.id,
                        name: req.user.name,
                        email: req.user.email,
                        avatar: req.user.avatar,
                    };

                    res.redirect(
                        `${process.env.FRONTEND_URL}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
                    );
                }
            );
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
        }
    }
);

// @route   GET /api/oauth/facebook
// @desc    Initiate Facebook OAuth
// @access  Public
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));

// @route   GET /api/oauth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed` }),
    (req, res) => {
        try {
            // Generate JWT token
            const payload = {
                user: {
                    id: req.user.id,
                },
            };

            if (!process.env.JWT_SECRET) {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_config`);
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '24h' },
                (err, token) => {
                    if (err) {
                        console.error('JWT signing error:', err);
                        return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
                    }

                    // Redirect to frontend with token
                    const userData = {
                        id: req.user.id,
                        name: req.user.name,
                        email: req.user.email,
                        avatar: req.user.avatar,
                    };

                    res.redirect(
                        `${process.env.FRONTEND_URL}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
                    );
                }
            );
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
        }
    }
);

// @route   GET /api/oauth/status
// @desc    Check OAuth configuration status
// @access  Public
router.get('/status', (req, res) => {
    res.json({
        google: {
            configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
        facebook: {
            configured: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
        },
    });
});

export default router;
