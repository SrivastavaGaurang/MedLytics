import { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Divider, 
  IconButton, InputAdornment, Fade, Tabs, Tab, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { API } from '../../../service/api';

// Import icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Modern professional colors
const colors = {
  primary: '#2563eb', // Blue
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  secondary: '#ffffff',
  background: '#f8fafc',
  darkText: '#1e293b',
  lightText: '#64748b',
  error: '#ef4444',
  success: '#10b981',
  border: '#e2e8f0',
  inputBg: '#ffffff'
};

// Container styles
const PageContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.background,
  padding: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    right: '0',
    width: '60%',
    height: '100%',
    background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.08) 100%)`,
    clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
    zIndex: 0,
  }
}));

const AuthContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '950px',
  display: 'flex',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  zIndex: 1,
  height: '600px',
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: '1',
  backgroundColor: colors.secondary,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: '1',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: '-100px',
    right: '-100px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: '-50px',
    left: '-50px',
  }
}));

const Logo = styled('img')({
  height: '40px',
  marginBottom: '20px',
});

const WelcomeImage = styled('img')({
  width: '80%',
  maxWidth: '300px',
  marginBottom: '30px',
});

const StyledTabs = styled(Tabs)({
  marginBottom: '24px',
  '& .MuiTabs-indicator': {
    backgroundColor: colors.primary,
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '16px',
    color: colors.lightText,
    '&.Mui-selected': {
      color: colors.primary,
    },
  },
});

const StyledTab = styled(Tab)({
  padding: '12px 24px',
});

const FormContainer = styled(Box)({
  flex: 1,
  overflow: 'auto',
  paddingRight: '10px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: colors.border,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: colors.lightText,
    borderRadius: '4px',
  },
});

const InputField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.inputBg,
    borderRadius: '10px',
    height: '50px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.lightText,
    '&.Mui-focused': {
      color: colors.primary,
    },
  },
});

const PrimaryButton = styled(Button)({
  borderRadius: '10px',
  padding: '10px 20px',
  height: '50px',
  backgroundColor: colors.primary,
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '16px',
  '&:hover': {
    backgroundColor: colors.primaryDark,
  },
  '&.Mui-disabled': {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
    color: 'white',
  },
});

const SocialButton = styled(Button)({
  borderRadius: '10px',
  padding: '10px 20px',
  height: '50px',
  backgroundColor: 'white',
  color: colors.darkText,
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '14px',
  border: `1px solid ${colors.border}`,
  marginBottom: '12px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
  '& .MuiButton-startIcon': {
    marginRight: '10px',
  },
});

const OrDivider = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  margin: '20px 0',
  '& hr': {
    flex: 1,
    border: 'none',
    height: '1px',
    backgroundColor: colors.border,
  },
  '& span': {
    padding: '0 15px',
    color: colors.lightText,
    fontSize: '14px',
  },
});

const ErrorText = styled(Typography)({
  color: colors.error,
  fontSize: '14px',
  marginTop: '-8px',
  marginBottom: '16px',
});

const SuccessText = styled(Typography)({
  color: colors.success,
  fontSize: '14px',
  marginBottom: '16px',
  fontWeight: 500,
});

// Custom TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Fade in={value === index} timeout={500}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`auth-tabpanel-${index}`}
        aria-labelledby={`auth-tab-${index}`}
        {...other}
        style={{ display: value === index ? 'block' : 'none' }}
      >
        {value === index && children}
      </div>
    </Fade>
  );
}

const Auth = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginMethod, setLoginMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    setError('');
  };

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
  };

  const handleSignup = async () => {
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
  };

  const handleSocialLogin = (provider) => {
    setError('');
    console.log(`Initiating ${provider} login flow`);
    // Implement social login logic here
  };

  return (
    <PageContainer>
      <AuthContainer elevation={0}>
        <LeftPanel>
          <Logo src="/your-logo.png" alt="Your Logo" />
          
          <StyledTabs value={tabValue} onChange={handleTabChange}>
            <StyledTab label="Login" />
            <StyledTab label="Sign Up" />
          </StyledTabs>
          
          <FormContainer>
            {/* Login Panel */}
            <TabPanel value={tabValue} index={0}>
              <Box mb={2}>
                <Typography variant="h5" fontWeight={700} color={colors.darkText}>
                  Welcome Back
                </Typography>
                <Typography color={colors.lightText} mt={1}>
                  Log in to your account to continue
                </Typography>
              </Box>
              
              {/* Login Method Toggle */}
              <Box display="flex" mb={3}>
                <Button
                  variant={loginMethod === 'email' ? 'contained' : 'outlined'}
                  color={loginMethod === 'email' ? 'primary' : 'inherit'}
                  onClick={() => handleLoginMethodChange('email')}
                  sx={{ 
                    mr: 1, 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    backgroundColor: loginMethod === 'email' ? colors.primary : 'transparent'
                  }}
                >
                  Email
                </Button>
                <Button
                  variant={loginMethod === 'phone' ? 'contained' : 'outlined'}
                  color={loginMethod === 'phone' ? 'primary' : 'inherit'}
                  onClick={() => handleLoginMethodChange('phone')}
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    backgroundColor: loginMethod === 'phone' ? colors.primary : 'transparent'
                  }}
                >
                  Phone
                </Button>
              </Box>
              
              {/* Email/Phone Input based on method */}
              {loginMethod === 'email' ? (
                <InputField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: colors.lightText }} />
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <InputField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={loginData.phone}
                  onChange={handleLoginInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: colors.lightText }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              
              {/* Password field */}
              <InputField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleLoginInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: colors.lightText }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? 
                          <VisibilityOffIcon sx={{ color: colors.lightText }} /> : 
                          <VisibilityIcon sx={{ color: colors.lightText }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box display="flex" justifyContent="flex-end" mb={3}>
                <Typography 
                  color={colors.primary} 
                  fontWeight={500} 
                  sx={{ cursor: 'pointer', fontSize: '14px' }}
                >
                  Forgot Password?
                </Typography>
              </Box>
              
              {error && <ErrorText>{error}</ErrorText>}
              {success && <SuccessText>{success}</SuccessText>}
              
              <PrimaryButton 
                fullWidth 
                onClick={handleLogin} 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </PrimaryButton>
              
              <OrDivider>
                <hr /><span>or continue with</span><hr />
              </OrDivider>
              
              {/* Social Login Buttons */}
              <Box>
                <SocialButton 
                  fullWidth 
                  startIcon={<GoogleIcon style={{ color: '#EA4335' }} />}
                  onClick={() => handleSocialLogin('Google')}
                >
                  Continue with Google
                </SocialButton>
                
                <SocialButton 
                  fullWidth 
                  startIcon={<FacebookIcon style={{ color: '#1877F2' }} />}
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  Continue with Facebook
                </SocialButton>
                
                <SocialButton 
                  fullWidth 
                  startIcon={<AppleIcon style={{ color: '#000000' }} />}
                  onClick={() => handleSocialLogin('Apple')}
                >
                  Continue with Apple
                </SocialButton>
              </Box>
            </TabPanel>
            
            {/* Signup Panel */}
            <TabPanel value={tabValue} index={1}>
              <Box mb={2}>
                <Typography variant="h5" fontWeight={700} color={colors.darkText}>
                  Create Account
                </Typography>
                <Typography color={colors.lightText} mt={1}>
                  Fill in your details to get started
                </Typography>
              </Box>
              
              <InputField
                fullWidth
                label="Full Name"
                name="name"
                value={signupData.name}
                onChange={handleSignupInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: colors.lightText }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <InputField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={signupData.email}
                onChange={handleSignupInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: colors.lightText }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <InputField
                fullWidth
                label="Phone Number (Optional)"
                name="phone"
                type="tel"
                value={signupData.phone}
                onChange={handleSignupInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: colors.lightText }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <InputField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={handleSignupInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: colors.lightText }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? 
                          <VisibilityOffIcon sx={{ color: colors.lightText }} /> : 
                          <VisibilityIcon sx={{ color: colors.lightText }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <InputField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={signupData.confirmPassword}
                onChange={handleSignupInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: colors.lightText }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography 
                fontSize="12px" 
                color={colors.lightText} 
                mb={3}
              >
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Typography>
              
              {error && <ErrorText>{error}</ErrorText>}
              {success && <SuccessText>{success}</SuccessText>}
              
              <PrimaryButton 
                fullWidth 
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>
              
              <OrDivider>
                <hr /><span>or sign up with</span><hr />
              </OrDivider>
              
              {/* Social Signup Buttons */}
              <Box>
                <SocialButton 
                  fullWidth 
                  startIcon={<GoogleIcon style={{ color: '#EA4335' }} />}
                  onClick={() => handleSocialLogin('Google')}
                >
                  Sign up with Google
                </SocialButton>
                
                <SocialButton 
                  fullWidth 
                  startIcon={<FacebookIcon style={{ color: '#1877F2' }} />}
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  Sign up with Facebook
                </SocialButton>
              </Box>
            </TabPanel>
          </FormContainer>
        </LeftPanel>
        
        <RightPanel>
          <WelcomeImage src="\public\823541c3-9b72-4602-b3d5-0ec79638d060.jpg" alt="Welcome" />
          <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
            Join Our Community
          </Typography>
          <Typography textAlign="center" sx={{ opacity: 0.9, maxWidth: '350px' }}>
            Get access to exclusive features, personalized recommendations, and much more when you join our platform.
          </Typography>
          
          <Box mt={6} sx={{ display: 'flex', gap: 2 }}>
            <IconButton 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <GoogleIcon />
            </IconButton>
            <IconButton 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </RightPanel>
      </AuthContainer>
    </PageContainer>
  );
};

export default Auth;