// components/account/OAuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc',
}));

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        const processOAuthCallback = () => {
            // Get token and user data from URL parameters
            const token = searchParams.get('token');
            const userDataString = searchParams.get('user');
            const errorParam = searchParams.get('error');

            // Check for errors
            if (errorParam) {
                setProcessing(false);
                const errorMessages = {
                    google_auth_failed: 'Google authentication failed. Please try again.',
                    facebook_auth_failed: 'Facebook authentication failed. Please try again.',
                    server_config: 'Server configuration error. Please contact support.',
                    token_generation_failed: 'Failed to generate authentication token.',
                    callback_failed: 'OAuth callback failed. Please try again.',
                };
                setError(errorMessages[errorParam] || 'Authentication failed. Please try again.');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
                return;
            }

            // Check for token
            if (!token) {
                setProcessing(false);
                setError('No authentication token received. Please try again.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
                return;
            }

            try {
                // Store token
                localStorage.setItem('token', token);

                // Store user data if provided
                if (userDataString) {
                    const userData = JSON.parse(decodeURIComponent(userDataString));
                    localStorage.setItem('user', JSON.stringify(userData));
                }

                // Redirect to dashboard
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } catch (err) {
                console.error('OAuth callback processing error:', err);
                setProcessing(false);
                setError('Failed to process authentication. Please try again.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        processOAuthCallback();
    }, [searchParams, navigate]);

    return (
        <Container>
            {processing && !error && (
                <>
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                    <Typography variant="h5" color="text.primary" gutterBottom>
                        Completing authentication...
                    </Typography>
                    <Typography color="text.secondary">
                        Please wait while we log you in
                    </Typography>
                </>
            )}

            {error && (
                <Alert severity="error" sx={{ maxWidth: '500px', mb: 3 }}>
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default OAuthCallback;
