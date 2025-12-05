import re

# Read the file
with open(r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\account\Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import statement
content = content.replace(
    "import { API } from '../../../service/api';",
    "import { useNavigate } from 'react-router-dom';\nimport { useAuth } from '../../contexts/useAuth';"
)

# Add hooks to Auth component
content = re.sub(
    r'const Auth = \(\) => \{',
    'const Auth = () => {\n  const navigate = useNavigate();\n  const { login, register } = useAuth();\n  ',
    content
)

# Replace handleLogin function
old_login = r'''  const handleLogin = async \(\) => \{
    setError\(''\);
    
    \/\/ Form validation
    if \(loginMethod === 'email' && \(!loginData\.email \|\| !loginData\.password\)\) \{
      setError\('Please enter both email and password'\);
      return;
    \} else if \(loginMethod === 'phone' && \(!loginData\.phone \|\| !loginData\.password\)\) \{
      setError\('Please enter both phone number and password'\);
      return;
    \}
    
    setLoading\(true\);
    
    try \{
      \/\/ Simulate API call
      await new Promise\(resolve => setTimeout\(resolve, 1500\)\);
      
      setSuccess\('Login successful! Redirecting\.\.\.'\);
      setLoading\(false\);
      
      \/\/ Simulate redirect
      setTimeout\(\(\) => \{
        \/\/ Redirect logic
        console\.log\('Redirecting to dashboard\.\.\.'\);
      \}, 1000\);
    \} catch \(error\) \{
      setLoading\(false\);
      setError\('Invalid credentials\. Please try again\.'\);
    \}
  \};'''

new_login = '''  const handleLogin = async () => {
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
      const credentials = loginMethod === 'email' 
        ? { email: loginData.email, password: loginData.password }
        : { phone: loginData.phone, password: loginData.password };
      
      const result = await login(credentials, loginMethod);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setLoading(false);
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setLoading(false);
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('Invalid credentials. Please try again.');
    }
  };'''

content = re.sub(old_login, new_login, content, flags=re.DOTALL)

# Replace handleSignup function
old_signup = r'''  const handleSignup = async \(\) => \{
    setError\(''\);
    
    \/\/ Form validation
    if \(!signupData\.name \|\| !signupData\.email \|\| !signupData\.password \|\| !signupData\.confirmPassword\) \{
      setError\('Please fill in all required fields'\);
      return;
    \}
    
    if \(signupData\.password\.length < 8\) \{
      setError\('Password must be at least 8 characters long'\);
      return;
    \}
    
    if \(signupData\.password !== signupData\.confirmPassword\) \{
      setError\('Passwords do not match'\);
      return;
    \}
    
    setLoading\(true\);
    
    try \{
      \/\/ Simulate API call
      await new Promise\(resolve => setTimeout\(resolve, 1500\)\);
      
      setSuccess\('Account created successfully! You can now login\.'\);
      setLoading\(false\);
      
      \/\/ Clear form and switch to login tab after delay
      setTimeout\(\(\) => \{
        setTabValue\(0\);
        setSignupData\(\{
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        \}\);
      \}, 2000\);
    \} catch \(error\) \{
      setLoading\(false\);
      setError\('Could not create your account\. Please try again\.'\);
    \}
  \};'''

new_signup = '''  const handleSignup = async () => {
    setError('');
    
    // Form validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone || undefined,
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting...');
        setLoading(false);
        
        // Clear form and redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setLoading(false);
        setError(result.error || 'Could not create your account. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('Could not create your account. Please try again.');
    }
  };'''

content = re.sub(old_signup, new_signup, content, flags=re.DOTALL)

# Write the file
with open(r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\account\Login.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Login.jsx updated successfully!")
