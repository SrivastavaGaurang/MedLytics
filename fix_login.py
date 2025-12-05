import re

# Read the file
with open(r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\account\Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace line 1-7: Fix imports
old_imports = """import { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Divider, 
  IconButton, InputAdornment, Fade, Tabs, Tab, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { API } from '../../../service/api';"""

new_imports = """import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, TextField, Button, Typography, Divider, 
  IconButton, InputAdornment, Fade, Tabs, Tab, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { loginWithEmail, loginWithPhone, registerUser } from '../../services/authService';"""

content = content.replace(old_imports, new_imports)

# Replace handleLogin function - find and replace simulated login with real API
old_login = """  const handleLogin = async () => {
    setError('');
    
    // Form validation
    if (loginMethod === 'email' && (!loginData.email || !loginData.password)) {
      setError('Please enter both email and password');
      return;
    } else if (loginMethod === 'phone' && (!loginData.phone || !loginData.password)) {
      setError('Please enter both phone number and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Login successful! Redirecting...');
      setLoading(false);
      
      // Simulate redirect
      setTimeout(() => {
        // Redirect logic
        console.log('Redirecting to dashboard...');
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError('Invalid credentials. Please try again.');
    }
  };"""

new_login = """  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    
    // Form validation
    if (loginMethod === 'email' && (!loginData.email || !loginData.password)) {
      setError('Please enter both email and password');
      return;
    } else if (loginMethod === 'phone' && (!loginData.phone || !loginData.password)) {
      setError('Please enter both phone number and password');
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      if (loginMethod === 'email') {
        response = await loginWithEmail({ email: loginData.email, password: loginData.password });
      } else {
        response = await loginWithPhone({ phone: loginData.phone, password: loginData.password });
      }
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setSuccess('Login successful! Redirecting...');
      setLoading(false);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };"""

content = content.replace(old_login, new_login)

# Replace handleSignup function - find and replace simulated signup with real API
old_signup = """  const handleSignup = async () => {
    setError('');
    
    // Form validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Account created successfully! You can now login.');
      setLoading(false);
      
      // Clear form and switch to login tab after delay
      setTimeout(() => {
        setTabValue(0);
        setSignupData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError('Could not create your account. Please try again.');
    }
  };"""

new_signup = """  const handleSignup = async () => {
    setError('');
    
    // Form validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Real API call to register user
      const response = await registerUser({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password
      });
      
      setSuccess('Account created successfully! You can now login.');
      setLoading(false);
      
      // Clear form and switch to login tab after delay
      setTimeout(() => {
        setTabValue(0);
        setSignupData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Could not create your account. Please try again.');
    }
  };"""

content = content.replace(old_signup, new_signup)

# Write the fixed content back
with open(r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\account\Login.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Login.jsx has been successfully updated with real API integration!")
print("✓ Added useNavigate import")
print("✓ Replaced API import with authService imports (loginWithEmail, loginWithPhone, registerUser)")
print("✓ Updated handleLogin to use real backend API calls")
print("✓ Updated handleSignup to use real backend API calls")
print("✓ Added proper navigation to dashboard after successful login")
